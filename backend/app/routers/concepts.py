from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.dependencies import require_role
from app.models.course import ConceptResponse, ConceptUpdate
from app.models.user import UserRole
from app.services.concept_service import ConceptService

router = APIRouter(prefix="/concepts", tags=["Concepts"])


@router.patch("/{concept_id}", response_model=ConceptResponse)
async def update_concept(
    concept_id: str,
    payload: ConceptUpdate,
    current_user: dict = Depends(require_role([UserRole.TRAINER, UserRole.ADMIN])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update concept properties or prerequisites with cycle validation. Requires course owner or Admin."""
    service = ConceptService(db)
    return await service.update_concept(concept_id, payload, current_user)


@router.delete("/{concept_id}")
async def delete_concept(
    concept_id: str,
    current_user: dict = Depends(require_role([UserRole.TRAINER, UserRole.ADMIN])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a concept. Fails if other concepts depend on it as a prerequisite. Requires course owner or Admin."""
    service = ConceptService(db)
    return await service.delete_concept(concept_id, current_user)
