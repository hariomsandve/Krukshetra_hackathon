from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

from app.database import get_database
from app.dependencies import get_current_user, require_role
from app.models.user import UserResponse, UserRole, UserSyncRequest

router = APIRouter(prefix="/auth", tags=["Authentication & Roles"])


def _serialize_user(user_doc: dict) -> UserResponse:
    return UserResponse(
        id=str(user_doc.get("_id", "")),
        firebase_uid=user_doc["firebase_uid"],
        email=user_doc["email"],
        display_name=user_doc.get("display_name"),
        role=user_doc.get("role", UserRole.STUDENT),
        branch=user_doc.get("branch"),
        year=user_doc.get("year"),
        skills=user_doc.get("skills", []),
        created_at=user_doc.get("created_at", datetime.utcnow()),
        updated_at=user_doc.get("updated_at", datetime.utcnow())
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Retrieve verified profile and authoritative role for the authenticated user."""
    return _serialize_user(current_user)


@router.post("/sync", response_model=UserResponse)
async def sync_user_profile(
    payload: UserSyncRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Sync profile updates from frontend for the authenticated user.

    Strict security rule: Role cannot be modified through this endpoint.
    """
    update_data = {}
    if payload.display_name is not None:
        update_data["display_name"] = payload.display_name
    if payload.branch is not None:
        update_data["branch"] = payload.branch
    if payload.year is not None:
        update_data["year"] = payload.year
    if payload.skills is not None:
        update_data["skills"] = payload.skills

    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.users.update_one(
            {"firebase_uid": current_user["firebase_uid"]},
            {"$set": update_data}
        )
        updated_user = await db.users.find_one({"firebase_uid": current_user["firebase_uid"]})
        return _serialize_user(updated_user)

    return _serialize_user(current_user)


class RoleUpdateRequest(BaseModel):
    firebase_uid: str
    new_role: UserRole


@router.put("/assign-role", response_model=UserResponse)
async def assign_user_role(
    payload: RoleUpdateRequest,
    current_user: dict = Depends(require_role([UserRole.ADMIN])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Administrative endpoint: assign verified role to a user.

    Requires Admin role.
    """
    target = await db.users.find_one({"firebase_uid": payload.firebase_uid})
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with firebase_uid '{payload.firebase_uid}' not found"
        )

    await db.users.update_one(
        {"firebase_uid": payload.firebase_uid},
        {"$set": {"role": payload.new_role.value, "updated_at": datetime.utcnow()}}
    )
    updated = await db.users.find_one({"firebase_uid": payload.firebase_uid})
    return _serialize_user(updated)
