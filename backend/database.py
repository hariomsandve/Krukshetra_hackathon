import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv
from pymongo import MongoClient, ASCENDING, DESCENDING

load_dotenv(Path(__file__).with_name(".env"))

MONGO_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("MONGODB_DATABASE", "adaptive_learning")

_client: Optional[MongoClient] = None


def get_db():
    global _client
    if _client is None:
        if not MONGO_URI:
            raise ValueError("MONGODB_URI is not set in environment or .env file.")
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    return _client[DB_NAME]


# Seed data for Concept Map
DEFAULT_CONCEPTS = [
    {
        "concept_id": "vars_types",
        "name": "Variables & Data Types",
        "category": "Foundations",
        "prerequisites": [],
        "difficulty": "Beginner",
        "description": "Understanding primitive types, mutability, references, and memory allocation.",
        "recommended_practice": ["Type Conversion Drills", "Variable Scope Puzzles", "String Formatting"],
        "common_pitfalls": "Confusion between pass-by-value and pass-by-reference.",
    },
    {
        "concept_id": "control_flow",
        "name": "Control Structures & Loops",
        "category": "Foundations",
        "prerequisites": ["Variables & Data Types"],
        "difficulty": "Beginner",
        "description": "Branching (if-else, switch) and iteration (for, while, do-while), break, and continue.",
        "recommended_practice": ["Pattern Printing", "Prime Number Checker", "Collatz Conjecture"],
        "common_pitfalls": "Off-by-one errors in loop boundaries and infinite loops.",
    },
    {
        "concept_id": "functions_scope",
        "name": "Functions & Scope",
        "category": "Foundations",
        "prerequisites": ["Control Structures & Loops"],
        "difficulty": "Beginner",
        "description": "Function definition, parameters, return values, call stack, and variable scoping.",
        "recommended_practice": ["Modular Calculator", "Pure Function Drills", "Closure Examples"],
        "common_pitfalls": "Modifying global state unintentionally inside local functions.",
    },
    {
        "concept_id": "arrays_strings",
        "name": "Arrays & Strings",
        "category": "Data Structures",
        "prerequisites": ["Functions & Scope"],
        "difficulty": "Intermediate",
        "description": "Contiguous memory layout, two-pointer technique, sliding window, and string manipulation.",
        "recommended_practice": ["Two Sum", "Valid Palindrome", "Longest Substring Without Repeating Characters"],
        "common_pitfalls": "IndexOutOfBounds exceptions and expensive string concatenations in loops.",
    },
    {
        "concept_id": "linked_lists",
        "name": "Linked Lists",
        "category": "Data Structures",
        "prerequisites": ["Variables & Data Types", "Functions & Scope"],
        "difficulty": "Intermediate",
        "description": "Singly and doubly linked lists, node traversal, insertion, and cycle detection.",
        "recommended_practice": ["Reverse a Linked List", "Floyd's Cycle Detection", "Merge Two Sorted Lists"],
        "common_pitfalls": "Losing references before relinking and dereferencing null pointers.",
    },
    {
        "concept_id": "stacks_queues",
        "name": "Stacks & Queues",
        "category": "Data Structures",
        "prerequisites": ["Arrays & Strings"],
        "difficulty": "Intermediate",
        "description": "LIFO vs FIFO paradigms, monotonic stacks, circular queues, and expression parsing.",
        "recommended_practice": ["Valid Parentheses", "Daily Temperatures", "Implement Queue using Stacks"],
        "common_pitfalls": "Stack overflow on unbounded structures or checking empty before pop.",
    },
    {
        "concept_id": "recursion",
        "name": "Recursion",
        "category": "Algorithms",
        "prerequisites": ["Functions & Scope"],
        "difficulty": "Intermediate",
        "description": "Base cases, recursive step, call stack unwinding, and recursion tree visualization.",
        "recommended_practice": ["Tower of Hanoi", "Fibonacci with Memoization", "Subsets Generation"],
        "common_pitfalls": "Missing or incorrect base case triggering RecursionError / StackOverflow.",
    },
    {
        "concept_id": "trees_graphs",
        "name": "Trees & Graphs",
        "category": "Data Structures",
        "prerequisites": ["Recursion", "Stacks & Queues"],
        "difficulty": "Advanced",
        "description": "Binary search trees, DFS, BFS, topological sort, and shortest path algorithms.",
        "recommended_practice": ["Binary Tree Level Order Traversal", "Invert Binary Tree", "Number of Islands"],
        "common_pitfalls": "Infinite loops in cyclic graphs due to missing visited tracking.",
    },
    {
        "concept_id": "dynamic_prog",
        "name": "Dynamic Programming",
        "category": "Algorithms",
        "prerequisites": ["Recursion", "Arrays & Strings"],
        "difficulty": "Advanced",
        "description": "Overlapping subproblems, optimal substructure, memoization (top-down), and tabulation (bottom-up).",
        "recommended_practice": ["Climbing Stairs", "Coin Change", "0/1 Knapsack Problem"],
        "common_pitfalls": "Incorrect recurrence relations or memory-heavy state spaces.",
    },
]


def init_database():
    """Initializes collections and indexes, and seeds default concepts and demo student."""
    try:
        db = get_db()
        # Seed concept_map if empty
        if db.concept_map.count_documents({}) == 0:
            db.concept_map.insert_many(DEFAULT_CONCEPTS)

        # Seed or enrich demo student STU001
        db.students.update_one(
            {"student_id": "STU001"},
            {
                "$setOnInsert": {
                    "student_id": "STU001",
                    "name": "Demo Student",
                    "branch": "CSE",
                    "year": 3,
                    "skills": ["Python", "SQL", "JavaScript"],
                },
                "$set": {
                    "mastery": {
                        "Variables & Data Types": 0.95,
                        "Control Structures & Loops": 0.88,
                        "Functions & Scope": 0.82,
                        "Arrays & Strings": 0.75,
                        "Linked Lists": 0.58,
                        "Stacks & Queues": 0.52,
                        "Recursion": 0.35,
                        "Trees & Graphs": 0.30,
                        "Dynamic Programming": 0.20,
                    },
                    "assessments_completed": 7,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
            },
            upsert=True,
        )

        # Ensure indexes
        db.conversations.create_index([("student_id", ASCENDING), ("created_at", DESCENDING)])
        db.viva_records.create_index([("student_id", ASCENDING), ("created_at", DESCENDING)])
    except Exception as e:
        print(f"Database initialization notice: {e}")


def get_student_profile(student_id: str) -> Optional[Dict[str, Any]]:
    db = get_db()
    student = db.students.find_one({"student_id": student_id}, {"_id": 0})
    return student


def get_concept_map() -> List[Dict[str, Any]]:
    db = get_db()
    concepts = list(db.concept_map.find({}, {"_id": 0}))
    if not concepts:
        return DEFAULT_CONCEPTS
    return concepts


def get_student_weak_concepts(student_id: str) -> Dict[str, Any]:
    student = get_student_profile(student_id)
    all_concepts = {c["name"]: c for c in get_concept_map()}

    if not student or "mastery" not in student or not student["mastery"]:
        # Fallback when student performance data is unavailable
        return {
            "has_data": False,
            "message": "Performance records not found. Ask student what topic they need help with.",
            "weak_concepts": [],
            "recommendations": [],
        }

    mastery = student["mastery"]
    # Sort concepts by mastery ascending
    sorted_mastery = sorted(mastery.items(), key=lambda item: item[1])
    weak_items = [item for item in sorted_mastery if item[1] < 0.65]

    recommendations = []
    for concept_name, score in weak_items:
        concept_info = all_concepts.get(concept_name, {})
        prereqs = concept_info.get("prerequisites", [])
        # Check prerequisite mastery
        unmet_prereqs = [p for p in prereqs if mastery.get(p, 0.0) < 0.7]

        why = (
            f"Your mastery in {concept_name} is currently at {int(score * 100)}%. "
            + (
                f"Before diving deeper, reinforce prerequisite: {', '.join(unmet_prereqs)}."
                if unmet_prereqs
                else "Focusing on core pattern recognition and structured practice will bring this to mastery."
            )
        )

        recommendations.append(
            {
                "concept": concept_name,
                "current_mastery": score,
                "difficulty": concept_info.get("difficulty", "Intermediate"),
                "prerequisites": prereqs,
                "unmet_prerequisites": unmet_prereqs,
                "recommended_practice": concept_info.get("recommended_practice", []),
                "common_pitfalls": concept_info.get("common_pitfalls", ""),
                "rationale": why,
            }
        )

    return {
        "has_data": True,
        "student_id": student_id,
        "student_name": student.get("name", "Student"),
        "mastery": mastery,
        "weak_concepts": [w[0] for w in weak_items],
        "recommendations": recommendations,
    }


def update_student_mastery(student_id: str, concept_name: str, new_score: float) -> bool:
    db = get_db()
    score_clamped = max(0.0, min(1.0, float(new_score)))
    res = db.students.update_one(
        {"student_id": student_id},
        {
            "$set": {
                f"mastery.{concept_name}": score_clamped,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )
    return res.modified_count > 0


def save_conversation(student_id: str, messages: List[Dict[str, Any]], title: Optional[str] = None) -> str:
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "student_id": student_id,
        "title": title or (messages[0]["text"][:40] if messages else "Conversation"),
        "messages": messages,
        "created_at": now,
        "updated_at": now,
    }
    result = db.conversations.insert_one(doc)
    return str(result.inserted_id)


def get_student_conversations(student_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    db = get_db()
    cursor = db.conversations.find({"student_id": student_id}, {"_id": 0}).sort("created_at", DESCENDING).limit(limit)
    return list(cursor)


def clear_student_conversations(student_id: str) -> int:
    db = get_db()
    result = db.conversations.delete_many({"student_id": student_id})
    return result.deleted_count


def save_viva_record(
    student_id: str,
    code: str,
    language: str,
    questions: List[str],
    student_answers: Optional[List[str]] = None,
    evaluation: Optional[Dict[str, Any]] = None,
) -> str:
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "student_id": student_id,
        "code": code,
        "language": language,
        "questions": questions,
        "answers": student_answers or [],
        "evaluation": evaluation or {},
        "created_at": now,
    }
    result = db.viva_records.insert_one(doc)
    return str(result.inserted_id)


def get_student_viva_records(student_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    db = get_db()
    cursor = db.viva_records.find({"student_id": student_id}, {"_id": 0}).sort("created_at", DESCENDING).limit(limit)
    return list(cursor)
