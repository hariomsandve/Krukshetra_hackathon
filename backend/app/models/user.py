from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    STUDENT = "student"
    TRAINER = "trainer"
    EVALUATOR = "evaluator"
    ADMIN = "admin"


class UserBase(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None
    role: UserRole = UserRole.STUDENT
    branch: Optional[str] = None
    year: Optional[int] = None
    skills: List[str] = Field(default_factory=list)


class UserSyncRequest(BaseModel):
    """Payload sent by client when logging in with Firebase.

    Note: The 'role' field is NOT accepted here to prevent privilege escalation.
    Roles are assigned solely via admin processes or DB seeding.
    """
    display_name: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[int] = None
    skills: Optional[List[str]] = None


class UserResponse(BaseModel):
    id: Optional[str] = None
    firebase_uid: str
    email: EmailStr
    display_name: Optional[str] = None
    role: UserRole
    branch: Optional[str] = None
    year: Optional[int] = None
    skills: List[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class UserInDB(UserBase):
    firebase_uid: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
