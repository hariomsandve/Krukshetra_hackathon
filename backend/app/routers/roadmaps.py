from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.dependencies import security
from app.models.roadmap import ProgressUpdateRequest
from app.repositories.roadmap_repository import RoadmapRepository

router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])
my_roadmaps_router = APIRouter(prefix="/my-roadmaps", tags=["My Roadmaps"])


def get_current_user_id(auth_header=Depends(security)) -> str:
    """Extracts user ID from Bearer token or falls back to demo student ID."""
    if auth_header and auth_header.credentials:
        token = auth_header.credentials
        if token.startswith("dev-"):
            return f"dev_{token.replace('dev-', '')}"
        try:
            import firebase_admin.auth as fb_auth
            decoded = fb_auth.verify_id_token(token)
            return decoded.get("uid", "user_parth_demo")
        except Exception:
            return "user_parth_demo"
    return "user_parth_demo"


# ---------------- Public Roadmap Endpoints ----------------

@router.get("", summary="List all domain roadmaps with filtering and search")
async def list_roadmaps(
    search: Optional[str] = Query(None, description="Search by title, description, or skills"),
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    sort: str = Query("default", description="Sort by 'duration', 'stages', or 'title'"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = RoadmapRepository(db)
    await repo.seed_if_empty()
    roadmaps = await repo.list_roadmaps(search=search, category=category, difficulty=difficulty, sort=sort)
    return {
        "status": "success",
        "total": len(roadmaps),
        "data": roadmaps
    }


@router.get("/{roadmap_id}", summary="Get domain roadmap details by ID or slug")
async def get_roadmap(
    roadmap_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = RoadmapRepository(db)
    roadmap = await repo.get_by_id_or_slug(roadmap_id)
    if not roadmap:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")
    return {
        "status": "success",
        "data": roadmap
    }


@router.get("/{roadmap_id}/stages", summary="Get all ordered stages of a domain roadmap")
async def get_roadmap_stages(
    roadmap_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = RoadmapRepository(db)
    roadmap = await repo.get_by_id_or_slug(roadmap_id)
    if not roadmap:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")
    return {
        "status": "success",
        "roadmap_id": roadmap["id"],
        "total_stages": len(roadmap.get("stages", [])),
        "data": roadmap.get("stages", [])
    }


@router.post("/{roadmap_id}/enroll", summary="Enroll current learner into a roadmap")
async def enroll_in_roadmap(
    roadmap_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = RoadmapRepository(db)
    progress = await repo.enroll_user(user_id=user_id, roadmap_id=roadmap_id)
    return {
        "status": "success",
        "message": f"Successfully enrolled in {roadmap_id}",
        "data": progress
    }


@router.get("/{roadmap_id}/export", summary="Export roadmap as JSON or Markdown checklist")
async def export_roadmap(
    roadmap_id: str,
    format: str = Query("json", regex="^(json|markdown|md)$"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = RoadmapRepository(db)
    roadmap = await repo.get_by_id_or_slug(roadmap_id)
    if not roadmap:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")

    if format == "json":
        return roadmap

    # Generate structured Markdown format
    md_lines = [
        f"# Mentos Learning Roadmap: {roadmap['title']}",
        f"> **Category**: {roadmap.get('category', 'Computer Science')} | **Level**: {roadmap.get('difficulty', 'Beginner').capitalize()} | **Duration**: {roadmap.get('estimated_duration', 'N/A')}",
        "",
        f"**Description**: {roadmap.get('description', '')}",
        "",
        f"**Target Skills**: {', '.join(roadmap.get('skills', []))}",
        "",
        "---",
        "",
        "## Learning Stages Checklist",
        ""
    ]

    for stage in roadmap.get("stages", []):
        md_lines.append(f"### [ ] Stage {stage['stage_number']}: {stage['title']}")
        md_lines.append(f"- **Difficulty**: {stage.get('difficulty', 'beginner').capitalize()} | **Est. Time**: {stage.get('estimated_hours', 15)} hours")
        if stage.get("learning_objectives"):
            md_lines.append("- **Learning Objectives**:")
            for obj in stage["learning_objectives"]:
                md_lines.append(f"  - {obj}")
        if stage.get("concepts"):
            md_lines.append(f"- **Key Concepts**: {', '.join(stage['concepts'])}")
        if stage.get("practical_exercises"):
            md_lines.append("- **Practical Exercises**:")
            for ex in stage["practical_exercises"]:
                md_lines.append(f"  - [ ] {ex}")
        if stage.get("milestone_project"):
            proj = stage["milestone_project"]
            md_lines.append(f"- **Milestone Project**: **{proj.get('title', '')}** — {proj.get('description', '')}")
        if stage.get("resources"):
            md_lines.append("- **Verified Learning Resources**:")
            for res in stage["resources"]:
                md_lines.append(f"  - [{res['title']}]({res['url']}) ({res.get('type', 'guide')})")
        md_lines.append("")

    md_lines.append("---")
    md_lines.append("*Generated by Mentos AI Learning Companion — Domain-Wise Roadmap Engine.*")

    markdown_text = "\n".join(md_lines)
    filename = f"mentos-{roadmap['slug']}-roadmap.md"

    return Response(
        content=markdown_text,
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


# ---------------- Personal User Progress Endpoints ----------------

@my_roadmaps_router.get("", summary="Get all enrolled roadmaps and progress for current user")
async def get_my_roadmaps(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = RoadmapRepository(db)
    progress_list = await repo.get_all_user_progress(user_id)
    return {
        "status": "success",
        "user_id": user_id,
        "total_enrolled": len(progress_list),
        "data": progress_list
    }


@my_roadmaps_router.patch("/{roadmap_id}/progress", summary="Update progress, completed status, notes, or confidence on a stage")
async def update_roadmap_progress(
    roadmap_id: str,
    payload: ProgressUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = RoadmapRepository(db)
    updated = await repo.update_progress(
        user_id=user_id,
        roadmap_id=roadmap_id,
        stage_id=payload.stage_id,
        completed=payload.completed,
        note=payload.note,
        confidence=payload.confidence
    )
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Failed to update progress")

    return {
        "status": "success",
        "message": "Progress recorded successfully",
        "data": updated
    }
