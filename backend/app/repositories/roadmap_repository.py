from datetime import datetime
from typing import Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.data.seed_roadmaps import SEED_ROADMAPS


class RoadmapRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.roadmaps = db.roadmaps
        self.progress = db.roadmap_progress

    async def ensure_indexes(self) -> None:
        """Create indexes for roadmap retrieval and user progress tracking."""
        try:
            await self.roadmaps.create_index("slug", unique=True)
            await self.roadmaps.create_index("category")
            await self.roadmaps.create_index("difficulty")
            await self.roadmaps.create_index([("title", "text"), ("description", "text"), ("skills", "text")])
            await self.progress.create_index([("user_id", 1), ("roadmap_id", 1)], unique=True)
            await self.progress.create_index("user_id")
        except Exception as e:
            pass

    async def seed_if_empty(self) -> int:
        """Seeds the 18 domain roadmaps idempotently."""
        count = await self.roadmaps.count_documents({})
        if count == 0:
            now = datetime.utcnow()
            docs = []
            for r in SEED_ROADMAPS:
                doc = dict(r)
                doc["created_at"] = now
                doc["updated_at"] = now
                docs.append(doc)
            if docs:
                await self.roadmaps.insert_many(docs)
            return len(docs)
        return count

    async def list_roadmaps(
        self,
        search: Optional[str] = None,
        category: Optional[str] = None,
        difficulty: Optional[str] = None,
        sort: str = "default",
        limit: int = 50,
        skip: int = 0
    ) -> List[dict]:
        """Fetch roadmaps with search and filter parameters."""
        query = {}
        if category and category.lower() != "all":
            query["category"] = category
        if difficulty and difficulty.lower() != "all":
            query["difficulty"] = difficulty.lower()
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"skills": {"$elemMatch": {"$regex": search, "$options": "i"}}}
            ]

        cursor = self.roadmaps.find(query, {"_id": 0})
        if sort == "duration":
            cursor = cursor.sort("estimated_duration", 1)
        elif sort == "stages":
            cursor = cursor.sort("stage_count", -1)
        else:
            cursor = cursor.sort("title", 1)

        roadmaps = await cursor.skip(skip).limit(limit).to_list(length=limit)
        # Fallback to in-memory seeds if DB query returned empty
        if not roadmaps and not query:
            return SEED_ROADMAPS
        return roadmaps

    async def get_by_id_or_slug(self, id_or_slug: str) -> Optional[dict]:
        """Find a roadmap by either its ID or URL slug."""
        doc = await self.roadmaps.find_one({"$or": [{"id": id_or_slug}, {"slug": id_or_slug}]}, {"_id": 0})
        if not doc:
            for r in SEED_ROADMAPS:
                if r["id"] == id_or_slug or r["slug"] == id_or_slug:
                    return r
        return doc

    async def get_user_progress(self, user_id: str, roadmap_id: str) -> Optional[dict]:
        """Get learner progress for a specific roadmap."""
        return await self.progress.find_one({"user_id": user_id, "roadmap_id": roadmap_id}, {"_id": 0})

    async def get_all_user_progress(self, user_id: str) -> List[dict]:
        """Fetch all roadmaps a user is currently enrolled in."""
        cursor = self.progress.find({"user_id": user_id}, {"_id": 0}).sort("last_activity_at", -1)
        return await cursor.to_list(length=100)

    async def enroll_user(self, user_id: str, roadmap_id: str) -> dict:
        """Enroll a user in a roadmap, initializing stage 1."""
        roadmap = await self.get_by_id_or_slug(roadmap_id)
        first_stage_id = roadmap["stages"][0]["id"] if roadmap and roadmap.get("stages") else ""

        now = datetime.utcnow()
        doc = {
            "user_id": user_id,
            "roadmap_id": roadmap["id"] if roadmap else roadmap_id,
            "roadmap_title": roadmap["title"] if roadmap else "Roadmap",
            "roadmap_slug": roadmap["slug"] if roadmap else "",
            "current_stage_id": first_stage_id,
            "completed_stage_ids": [],
            "stage_notes": {},
            "stage_confidence": {},
            "started_at": now,
            "last_activity_at": now,
            "completed_at": None,
            "completion_percent": 0.0
        }

        await self.progress.update_one(
            {"user_id": user_id, "roadmap_id": doc["roadmap_id"]},
            {"$setOnInsert": doc},
            upsert=True
        )
        return await self.get_user_progress(user_id, doc["roadmap_id"])

    async def update_progress(
        self,
        user_id: str,
        roadmap_id: str,
        stage_id: str,
        completed: Optional[bool] = None,
        note: Optional[str] = None,
        confidence: Optional[int] = None
    ) -> Optional[dict]:
        """Update a stage's completed status, notes, or self-reported confidence."""
        current = await self.get_user_progress(user_id, roadmap_id)
        if not current:
            current = await self.enroll_user(user_id, roadmap_id)

        roadmap = await self.get_by_id_or_slug(roadmap_id)
        total_stages = len(roadmap.get("stages", [])) if roadmap else 1

        completed_ids = set(current.get("completed_stage_ids", []))
        if completed is True:
            completed_ids.add(stage_id)
        elif completed is False:
            completed_ids.discard(stage_id)

        notes = current.get("stage_notes", {})
        if note is not None:
            notes[stage_id] = note

        conf_dict = current.get("stage_confidence", {})
        if confidence is not None:
            conf_dict[stage_id] = confidence

        completion_pct = round((len(completed_ids) / total_stages) * 100, 1) if total_stages > 0 else 0.0

        update_fields = {
            "completed_stage_ids": list(completed_ids),
            "stage_notes": notes,
            "stage_confidence": conf_dict,
            "completion_percent": completion_pct,
            "last_activity_at": datetime.utcnow()
        }

        if completion_pct >= 100.0 and not current.get("completed_at"):
            update_fields["completed_at"] = datetime.utcnow()

        await self.progress.update_one(
            {"user_id": user_id, "roadmap_id": roadmap["id"] if roadmap else roadmap_id},
            {"$set": update_fields}
        )

        return await self.get_user_progress(user_id, roadmap["id"] if roadmap else roadmap_id)
