from typing import List, Optional
from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.course import CourseCreate, CourseResponse, CourseUpdate
from app.models.user import UserRole
from app.repositories.concept_repository import ConceptRepository
from app.repositories.course_repository import CourseRepository


class CourseService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.course_repo = CourseRepository(db)
        self.concept_repo = ConceptRepository(db)

    def _to_response(self, doc: dict, concept_count: int = 0) -> CourseResponse:
        return CourseResponse(
            id=str(doc["_id"]),
            title=doc["title"],
            description=doc["description"],
            tags=doc.get("tags", []),
            is_published=doc.get("is_published", True),
            creator_id=doc["creator_id"],
            creator_email=doc["creator_email"],
            concept_count=concept_count,
            created_at=doc["created_at"],
            updated_at=doc["updated_at"]
        )

    async def create_course(self, payload: CourseCreate, user: dict) -> CourseResponse:
        course_data = payload.model_dump()
        course_data["creator_id"] = user["firebase_uid"]
        course_data["creator_email"] = user.get("email", "")

        created = await self.course_repo.create(course_data)
        return self._to_response(created, 0)

    async def list_courses(
        self,
        creator_id: Optional[str] = None,
        is_published: Optional[bool] = None
    ) -> List[CourseResponse]:
        docs = await self.course_repo.list(creator_id=creator_id, is_published=is_published)
        results = []
        for doc in docs:
            cid = str(doc["_id"])
            count = await self.concept_repo.count_by_course(cid)
            results.append(self._to_response(doc, count))
        return results

    async def get_course(self, course_id: str) -> CourseResponse:
        if not ObjectId.is_valid(course_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid course ObjectId format: '{course_id}'"
            )

        doc = await self.course_repo.get_by_id(course_id)
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID '{course_id}' not found"
            )

        count = await self.concept_repo.count_by_course(course_id)
        return self._to_response(doc, count)

    async def update_course(
        self,
        course_id: str,
        payload: CourseUpdate,
        user: dict
    ) -> CourseResponse:
        if not ObjectId.is_valid(course_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid course ObjectId format: '{course_id}'"
            )

        doc = await self.course_repo.get_by_id(course_id)
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID '{course_id}' not found"
            )

        # Enforce course ownership (or Admin override)
        is_owner = doc.get("creator_id") == user["firebase_uid"]
        is_admin = user.get("role") == UserRole.ADMIN.value
        if not (is_owner or is_admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You can only edit courses that you created"
            )

        update_fields = {k: v for k, v in payload.model_dump(exclude_unset=True).items()}
        if not update_fields:
            count = await self.concept_repo.count_by_course(course_id)
            return self._to_response(doc, count)

        updated = await self.course_repo.update(course_id, update_fields)
        count = await self.concept_repo.count_by_course(course_id)
        return self._to_response(updated, count)
