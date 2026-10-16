from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase


class ConceptRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.concepts

    async def ensure_indexes(self) -> None:
        """Create indexes for course concepts and prerequisite lookups."""
        await self.collection.create_index("course_id")
        await self.collection.create_index("prerequisite_concept_ids")
        await self.collection.create_index([("course_id", 1), ("order_index", 1)])

    async def create(self, concept_data: dict) -> dict:
        concept_data["created_at"] = datetime.utcnow()
        concept_data["updated_at"] = datetime.utcnow()
        result = await self.collection.insert_one(concept_data)
        concept_data["_id"] = result.inserted_id
        return concept_data

    async def get_by_id(self, concept_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(concept_id):
            return None
        return await self.collection.find_one({"_id": ObjectId(concept_id)})

    async def list_by_course(self, course_id: str) -> List[dict]:
        if not ObjectId.is_valid(course_id):
            return []
        cursor = self.collection.find({"course_id": course_id}).sort("order_index", 1)
        return await cursor.to_list(length=500)

    async def count_by_course(self, course_id: str) -> int:
        if not ObjectId.is_valid(course_id):
            return 0
        return await self.collection.count_documents({"course_id": course_id})

    async def update(self, concept_id: str, update_fields: dict) -> Optional[dict]:
        if not ObjectId.is_valid(concept_id):
            return None

        update_fields["updated_at"] = datetime.utcnow()
        await self.collection.update_one(
            {"_id": ObjectId(concept_id)},
            {"$set": update_fields}
        )
        return await self.get_by_id(concept_id)

    async def delete(self, concept_id: str) -> bool:
        if not ObjectId.is_valid(concept_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(concept_id)})
        return result.deleted_count > 0

    async def find_dependents(self, course_id: str, concept_id: str) -> List[dict]:
        """Finds other concepts in the course that list this concept as a prerequisite."""
        cursor = self.collection.find({
            "course_id": course_id,
            "prerequisite_concept_ids": concept_id
        })
        return await cursor.to_list(length=100)
