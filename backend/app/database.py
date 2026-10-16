import logging
import time
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings

logger = logging.getLogger("uvicorn.error")


class MongoManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None


mongo_manager = MongoManager()


async def connect_to_mongo() -> None:
    """Initialize MongoDB Atlas async connection using Motor."""
    settings = get_settings()
    if not settings.mongodb_uri:
        logger.warning("MONGODB_URI is not set. Database connection skipped at startup.")
        return

    try:
        logger.info("Connecting to MongoDB Atlas...")
        mongo_manager.client = AsyncIOMotorClient(
            settings.mongodb_uri,
            serverSelectionTimeoutMS=10000
        )
        # Test connection with ping
        await mongo_manager.client.admin.command("ping")
        mongo_manager.db = mongo_manager.client[settings.mongodb_database]
        logger.info(f"Successfully connected to MongoDB Atlas database: '{settings.mongodb_database}'")
    except Exception as exc:
        logger.error(f"Failed to connect to MongoDB Atlas: {exc}")
        mongo_manager.client = None
        mongo_manager.db = None


async def close_mongo_connection() -> None:
    """Close MongoDB connection gracefully."""
    if mongo_manager.client:
        logger.info("Closing MongoDB Atlas connection...")
        mongo_manager.client.close()
        mongo_manager.client = None
        mongo_manager.db = None
        logger.info("MongoDB connection closed.")


def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency to retrieve the active MongoDB database."""
    if mongo_manager.db is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is not connected. Please configure a valid MONGODB_URI in backend/.env"
        )
    return mongo_manager.db



async def check_database_connection() -> dict:
    """Diagnostic health check function."""
    if not mongo_manager.client:
        return {
            "status": "disconnected",
            "message": "MongoDB client is not initialized or MONGODB_URI is not configured."
        }

    start_time = time.time()
    try:
        await mongo_manager.client.admin.command("ping")
        latency_ms = round((time.time() - start_time) * 1000, 2)
        return {
            "status": "connected",
            "database": get_settings().mongodb_database,
            "latency_ms": latency_ms
        }
    except Exception as exc:
        return {
            "status": "error",
            "message": str(exc)
        }
