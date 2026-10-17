from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RoadmapDifficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    MIXED = "mixed"


class RoadmapResource(BaseModel):
    title: str
    url: str
    type: str = "documentation"  # documentation, guide, course, tutorial
    is_free: bool = True
    last_reviewed: str = "2026-10"


class MilestoneProject(BaseModel):
    title: str
    description: str


class RoadmapStage(BaseModel):
    id: str
    stage_number: int
    title: str
    difficulty: RoadmapDifficulty = RoadmapDifficulty.BEGINNER
    estimated_hours: int = 15
    prerequisites: List[str] = Field(default_factory=list)
    learning_objectives: List[str] = Field(default_factory=list)
    concepts: List[str] = Field(default_factory=list)
    practical_exercises: List[str] = Field(default_factory=list)
    milestone_project: Optional[MilestoneProject] = None
    completion_criteria: str = "Demonstrate comprehension through practical implementation."
    next_stage_id: Optional[str] = None
    resources: List[RoadmapResource] = Field(default_factory=list)


class Roadmap(BaseModel):
    id: str
    slug: str
    title: str
    icon: str
    category: str
    description: str
    difficulty: RoadmapDifficulty = RoadmapDifficulty.BEGINNER
    estimated_duration: str
    stage_count: int
    prerequisites: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    stages: List[RoadmapStage] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class RoadmapProgress(BaseModel):
    user_id: str
    roadmap_id: str
    current_stage_id: str
    completed_stage_ids: List[str] = Field(default_factory=list)
    stage_notes: Dict[str, str] = Field(default_factory=dict)
    stage_confidence: Dict[str, int] = Field(default_factory=dict)
    started_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    completion_percent: float = 0.0


class EnrollmentRequest(BaseModel):
    user_id: Optional[str] = None


class ProgressUpdateRequest(BaseModel):
    stage_id: str
    completed: Optional[bool] = None
    note: Optional[str] = None
    confidence: Optional[int] = Field(default=None, ge=1, le=5)
