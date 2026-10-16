from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.dependencies import get_current_user, require_role
from app.models.course import (
    ConceptCreate,
    ConceptGraphResponse,
    ConceptResponse,
    CourseCreate,
    CourseResponse,
    CourseUpdate,
)
from app.models.user import UserRole
from app.services.concept_service import ConceptService
from app.services.course_service import CourseService

router = APIRouter(prefix="/courses", tags=["Courses & Concept Maps"])


@router.get("", response_model=List[CourseResponse])
async def list_courses(
    creator_id: Optional[str] = Query(None, description="Filter courses by creator Firebase UID"),
    is_published: Optional[bool] = Query(None, description="Filter by published status"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """List available courses with concept counts. Accessible to all users."""
    service = CourseService(db)
    return await service.list_courses(creator_id=creator_id, is_published=is_published)


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    payload: CourseCreate,
    current_user: dict = Depends(require_role([UserRole.TRAINER, UserRole.ADMIN])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new course. Requires Trainer or Admin role."""
    service = CourseService(db)
    return await service.create_course(payload, current_user)


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Retrieve details of a specific course by ID."""
    service = CourseService(db)
    return await service.get_course(course_id)


@router.patch("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: str,
    payload: CourseUpdate,
    current_user: dict = Depends(require_role([UserRole.TRAINER, UserRole.ADMIN])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update course title, description, or status. Requires course owner or Admin."""
    service = CourseService(db)
    return await service.update_course(course_id, payload, current_user)


@router.get("/{course_id}/concepts", response_model=ConceptGraphResponse)
async def get_course_concepts(
    course_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Retrieve the prerequisite concept DAG (nodes, edges, topological tiers) for a course."""
    service = ConceptService(db)
    return await service.get_course_concepts(course_id)


@router.post("/{course_id}/concepts", response_model=ConceptResponse, status_code=status.HTTP_201_CREATED)
async def add_concept_to_course(
    course_id: str,
    payload: ConceptCreate,
    current_user: dict = Depends(require_role([UserRole.TRAINER, UserRole.ADMIN])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Add a new concept to a course with prerequisite validation and cycle prevention."""
    service = ConceptService(db)
    return await service.add_concept(course_id, payload, current_user)
