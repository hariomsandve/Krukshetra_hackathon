from fastapi import APIRouter
from app.config import get_settings
from app.database import check_database_connection

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def health_check():
    """Health check endpoint verifying API status and MongoDB Atlas connectivity."""
    settings = get_settings()
    db_status = await check_database_connection()

    return {
        "status": "healthy" if db_status.get("status") == "connected" else "degraded",
        "service": "PS-2 Adaptive Learning and Assessment Portal Backend",
        "environment": settings.environment,
        "database": db_status
    }
