from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import close_mongo_connection, connect_to_mongo, mongo_manager
from app.repositories.concept_repository import ConceptRepository
from app.repositories.course_repository import CourseRepository
from app.routers import auth, concepts, courses, health, voice


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler managing database connection lifecycle and indexes."""
    await connect_to_mongo()
    if mongo_manager.db is not None:
        try:
            await CourseRepository(mongo_manager.db).ensure_indexes()
            await ConceptRepository(mongo_manager.db).ensure_indexes()
        except Exception:
            pass
    yield
    await close_mongo_connection()


settings = get_settings()

app = FastAPI(
    title="PS-2 Adaptive Learning and Assessment Portal API",
    description="Backend API providing adaptive assessments, concept maps, telemetry integrity, and secure role authorization.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(courses.router, prefix="/api/v1")
app.include_router(concepts.router, prefix="/api/v1")
app.include_router(voice.router, prefix="/api/v1")



@app.get("/", tags=["Root"])
async def root():
    return {
        "portal": "PS-2 Adaptive Learning and Assessment Portal",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "health_check": "/api/v1/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
