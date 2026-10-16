from datetime import datetime
from enum import Enum
from typing import Annotated, Any, List, Optional
from bson import ObjectId
from pydantic import BaseModel, Field, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema


class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value: Any) -> str:
        if isinstance(value, ObjectId):
            return str(value)
        if isinstance(value, str) and ObjectId.is_valid(value):
            return value
        raise ValueError(f"Invalid ObjectId string: {value}")

    @classmethod
    def __get_pydantic_json_schema__(
        cls, _core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler
    ) -> JsonSchemaValue:
        return {"type": "string", "example": "507f1f77bcf86cd799439011"}


class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


# ---------------- Concept Models ----------------

class ConceptBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150, description="Concept title")
    description: str = Field(..., max_length=2000, description="Concept explanation/summary")
    difficulty: DifficultyLevel = Field(default=DifficultyLevel.BEGINNER)
    prerequisite_concept_ids: List[str] = Field(
        default_factory=list,
        description="List of prerequisite concept IDs required before starting this concept"
    )
    learning_objectives: List[str] = Field(default_factory=list, description="Target outcomes for mastery")
    estimated_minutes: int = Field(default=30, ge=5, le=600, description="Estimated study time in minutes")
    order_index: int = Field(default=0, ge=0, description="Display order within level")


class ConceptCreate(ConceptBase):
    pass


class ConceptUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, max_length=2000)
    difficulty: Optional[DifficultyLevel] = None
    prerequisite_concept_ids: Optional[List[str]] = None
    learning_objectives: Optional[List[str]] = None
    estimated_minutes: Optional[int] = Field(None, ge=5, le=600)
    order_index: Optional[int] = Field(None, ge=0)


class ConceptResponse(ConceptBase):
    id: str
    course_id: str
    created_at: datetime
    updated_at: datetime


# ---------------- Concept Graph Representation ----------------

class ConceptGraphNode(BaseModel):
    id: str
    title: str
    description: str
    difficulty: DifficultyLevel
    tier_level: int = Field(default=0, description="Topological depth level (0 = fundamental, no prereqs)")
    prerequisites: List[str] = Field(default_factory=list)
    learning_objectives: List[str] = Field(default_factory=list)
    estimated_minutes: int = 30


class ConceptGraphEdge(BaseModel):
    source: str = Field(..., description="Prerequisite concept ID")
    target: str = Field(..., description="Dependent concept ID")


class ConceptGraphResponse(BaseModel):
    course_id: str
    course_title: str
    nodes: List[ConceptGraphNode]
    edges: List[ConceptGraphEdge]
    total_concepts: int


# ---------------- Course Models ----------------

class CourseBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=3000)
    tags: List[str] = Field(default_factory=list)
    is_published: bool = Field(default=True)


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=3000)
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None


class CourseResponse(CourseBase):
    id: str
    creator_id: str
    creator_email: str
    concept_count: int = 0
    created_at: datetime
    updated_at: datetime
