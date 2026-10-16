from typing import List, Optional
from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.course import (
    ConceptCreate,
    ConceptGraphResponse,
    ConceptResponse,
    ConceptUpdate,
    DifficultyLevel,
)
from app.models.user import UserRole
from app.repositories.concept_repository import ConceptRepository
from app.repositories.course_repository import CourseRepository
from app.services.graph_service import (
    GraphCycleError,
    build_concept_dag_layout,
    validate_dag,
)


class ConceptService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.course_repo = CourseRepository(db)
        self.concept_repo = ConceptRepository(db)

    def _to_response(self, doc: dict) -> ConceptResponse:
        diff_str = doc.get("difficulty", "beginner")
        diff_enum = DifficultyLevel(diff_str) if diff_str in [d.value for d in DifficultyLevel] else DifficultyLevel.BEGINNER

        return ConceptResponse(
            id=str(doc["_id"]),
            course_id=str(doc["course_id"]),
            title=doc["title"],
            description=doc["description"],
            difficulty=diff_enum,
            prerequisite_concept_ids=[str(p) for p in doc.get("prerequisite_concept_ids", [])],
            learning_objectives=doc.get("learning_objectives", []),
            estimated_minutes=doc.get("estimated_minutes", 30),
            order_index=doc.get("order_index", 0),
            created_at=doc["created_at"],
            updated_at=doc["updated_at"]
        )

    async def _verify_course_ownership(self, course_id: str, user: dict) -> dict:
        """Verifies course exists and user is owner or admin."""
        if not ObjectId.is_valid(course_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid course ObjectId format: '{course_id}'"
            )

        course = await self.course_repo.get_by_id(course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID '{course_id}' not found"
            )

        is_owner = course.get("creator_id") == user["firebase_uid"]
        is_admin = user.get("role") == UserRole.ADMIN.value
        if not (is_owner or is_admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You can only modify concepts in courses that you own"
            )

        return course

    def _validate_prerequisite_ids(
        self,
        prereq_ids: List[str],
        existing_concepts: List[dict],
        current_concept_id: Optional[str] = None
    ) -> None:
        """Validates format, self-reference, existence in same course, and DAG cycles."""
        existing_ids = {str(c["_id"]) for c in existing_concepts}

        for pid in prereq_ids:
            if not ObjectId.is_valid(pid):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid prerequisite ObjectId format: '{pid}'"
                )
            if current_concept_id and pid == current_concept_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A concept cannot list itself as a prerequisite"
                )
            if pid not in existing_ids:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Prerequisite concept '{pid}' does not exist in this course"
                )

        # Check for circular dependencies
        try:
            validate_dag(existing_concepts, current_concept_id, prereq_ids)
        except GraphCycleError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(exc)
            )

    async def add_concept(
        self,
        course_id: str,
        payload: ConceptCreate,
        user: dict
    ) -> ConceptResponse:
        await self._verify_course_ownership(course_id, user)

        existing_concepts = await self.concept_repo.list_by_course(course_id)

        # Validate prerequisites
        self._validate_prerequisite_ids(
            payload.prerequisite_concept_ids,
            existing_concepts,
            current_concept_id=None
        )

        concept_data = payload.model_dump()
        concept_data["course_id"] = course_id
        # Normalize difficulty to string
        concept_data["difficulty"] = payload.difficulty.value

        created = await self.concept_repo.create(concept_data)
        return self._to_response(created)

    async def get_course_concepts(
        self,
        course_id: str
    ) -> ConceptGraphResponse:
        if not ObjectId.is_valid(course_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid course ObjectId format: '{course_id}'"
            )

        course = await self.course_repo.get_by_id(course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID '{course_id}' not found"
            )

        concepts = await self.concept_repo.list_by_course(course_id)
        nodes, edges = build_concept_dag_layout(concepts)

        return ConceptGraphResponse(
            course_id=course_id,
            course_title=course["title"],
            nodes=nodes,
            edges=edges,
            total_concepts=len(nodes)
        )

    async def update_concept(
        self,
        concept_id: str,
        payload: ConceptUpdate,
        user: dict
    ) -> ConceptResponse:
        if not ObjectId.is_valid(concept_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid concept ObjectId format: '{concept_id}'"
            )

        concept = await self.concept_repo.get_by_id(concept_id)
        if not concept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Concept with ID '{concept_id}' not found"
            )

        course_id = concept["course_id"]
        await self._verify_course_ownership(course_id, user)

        update_fields = {k: v for k, v in payload.model_dump(exclude_unset=True).items()}

        if "prerequisite_concept_ids" in update_fields:
            new_prereqs = update_fields["prerequisite_concept_ids"]
            existing_concepts = await self.concept_repo.list_by_course(course_id)
            self._validate_prerequisite_ids(
                new_prereqs,
                existing_concepts,
                current_concept_id=concept_id
            )

        if "difficulty" in update_fields and isinstance(update_fields["difficulty"], DifficultyLevel):
            update_fields["difficulty"] = update_fields["difficulty"].value

        if not update_fields:
            return self._to_response(concept)

        updated = await self.concept_repo.update(concept_id, update_fields)
        return self._to_response(updated)

    async def delete_concept(self, concept_id: str, user: dict) -> dict:
        if not ObjectId.is_valid(concept_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid concept ObjectId format: '{concept_id}'"
            )

        concept = await self.concept_repo.get_by_id(concept_id)
        if not concept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Concept with ID '{concept_id}' not found"
            )

        course_id = concept["course_id"]
        await self._verify_course_ownership(course_id, user)

        # Check if other concepts depend on this one
        dependents = await self.concept_repo.find_dependents(course_id, concept_id)
        if dependents:
            dep_titles = [f"'{d.get('title', d['_id'])}'" for d in dependents]
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete concept: {len(dependents)} other concept(s) depend on it as a prerequisite: {', '.join(dep_titles)}"
            )

        deleted = await self.concept_repo.delete(concept_id)
        return {
            "status": "success",
            "message": f"Concept '{concept.get('title', concept_id)}' successfully deleted",
            "deleted_id": concept_id
        }
