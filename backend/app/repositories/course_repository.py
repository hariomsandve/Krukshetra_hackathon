from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase


class CourseRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.courses

    async def ensure_indexes(self) -> None:
        """Create indexes for performance and search."""
        await self.collection.create_index("creator_id")
        await self.collection.create_index("is_published")
        await self.collection.create_index([("title", "text"), ("description", "text")])

    async def create(self, course_data: dict) -> dict:
        course_data["created_at"] = datetime.utcnow()
        course_data["updated_at"] = datetime.utcnow()
        result = await self.collection.insert_one(course_data)
        course_data["_id"] = result.inserted_id
        return course_data

    async def get_by_id(self, course_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(course_id):
            return None
        return await self.collection.find_one({"_id": ObjectId(course_id)})

    async def list(
        self,
        creator_id: Optional[str] = None,
        is_published: Optional[bool] = None,
        limit: int = 50,
        skip: int = 0
    ) -> List[dict]:
        query = {}
        if creator_id:
            query["creator_id"] = creator_id
        if is_published is not None:
            query["is_published"] = is_published

        cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def update(self, course_id: str, update_fields: dict) -> Optional[dict]:
        if not ObjectId.is_valid(course_id):
            return None

        update_fields["updated_at"] = datetime.utcnow()
        await self.collection.update_one(
            {"_id": ObjectId(course_id)},
            {"$set": update_fields}
        )
        return await self.get_by_id(course_id)

    async def delete(self, course_id: str) -> bool:
        if not ObjectId.is_valid(course_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(course_id)})
        return result.deleted_count > 0
