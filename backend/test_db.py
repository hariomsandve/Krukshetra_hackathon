
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DATABASE", "adaptive_learning")

if not uri:
    raise ValueError("MONGODB_URI missing from .env file")

client = MongoClient(uri, serverSelectionTimeoutMS=10000)

try:
    client.admin.command("ping")
    print("MongoDB Atlas connected successfully!")

    db = client[db_name]

    student = {
        "student_id": "STU001",
        "name": "Demo Student",
        "branch": "CSE",
        "year": 3,
        "skills": ["Python", "SQL"]
    }

    result = db.students.insert_one(student)
    print("Student saved successfully!")
    print("Student ID:", result.inserted_id)

finally:
    client.close()
