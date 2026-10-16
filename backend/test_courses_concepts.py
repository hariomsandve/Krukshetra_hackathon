"""
Comprehensive tests for Courses, Concepts, RBAC, and DAG Prerequisite Cycle Prevention
"""
import sys
from bson import ObjectId
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_database

client = TestClient(app)


class InMemoryCollection:
    def __init__(self):
        self.docs = []

    def _match(self, doc, query):
        for k, v in query.items():
            if k == "_id":
                if str(doc.get("_id")) != str(v):
                    return False
            elif isinstance(v, dict):
                # handle $set or basic sub-queries if needed
                continue
            else:
                doc_val = doc.get(k)
                if isinstance(doc_val, list):
                    if v not in doc_val:
                        return False
                elif doc_val != v:
                    return False
        return True

    async def create_index(self, *args, **kwargs):
        pass

    async def insert_one(self, doc):
        if "_id" not in doc:
            doc["_id"] = ObjectId()
        self.docs.append(doc)
        class InsertResult:
            inserted_id = doc["_id"]
        return InsertResult()

    async def find_one(self, query):
        for doc in self.docs:
            if self._match(doc, query):
                return doc
        return None

    def find(self, query=None):
        results = []
        q = query or {}
        for doc in self.docs:
            if self._match(doc, q):
                results.append(doc)

        class Cursor:
            def __init__(self, items):
                self.items = items
            def sort(self, *args, **kwargs):
                return self
            def skip(self, n):
                self.items = self.items[n:]
                return self
            def limit(self, n):
                self.items = self.items[:n]
                return self
            async def to_list(self, length=None):
                return self.items[:length] if length else self.items
        return Cursor(results)

    async def count_documents(self, query):
        return len([d for d in self.docs if self._match(d, query)])

    async def update_one(self, query, update):
        doc = await self.find_one(query)
        if doc and "$set" in update:
            doc.update(update["$set"])
        class UpdateResult:
            modified_count = 1 if doc else 0
        return UpdateResult()

    async def delete_one(self, query):
        idx = -1
        for i, doc in enumerate(self.docs):
            if self._match(doc, query):
                idx = i
                break
        if idx != -1:
            self.docs.pop(idx)
            deleted = 1
        else:
            deleted = 0
        class DeleteResult:
            deleted_count = deleted
        return DeleteResult()


class InMemoryDatabase:
    def __init__(self):
        self.users = InMemoryCollection()
        self.courses = InMemoryCollection()
        self.concepts = InMemoryCollection()


def run_tests():
    print("\n--- Running Course & Concept Integration Tests ---")
    mock_db = InMemoryDatabase()
    app.dependency_overrides[get_database] = lambda: mock_db

    trainer_headers = {"Authorization": "Bearer dev-trainer"}
    student_headers = {"Authorization": "Bearer dev-student"}
    other_trainer_headers = {"Authorization": "Bearer dev-evaluator"}  # Different user

    try:
        # 1. Authorization: Student cannot create a course
        course_payload = {
            "title": "Data Structures & Algorithms",
            "description": "Comprehensive course covering trees, graphs, and dynamic programming.",
            "tags": ["DSA", "Computer Science"],
            "is_published": True
        }
        res = client.post("/api/v1/courses", headers=student_headers, json=course_payload)
        assert res.status_code == 403, f"Expected 403 for student, got {res.status_code}"
        print("[OK] [PASS] Role Authorization: Student denied course creation (403)")

        # 2. Trainer creates course successfully
        res = client.post("/api/v1/courses", headers=trainer_headers, json=course_payload)
        assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
        course = res.json()
        course_id = course["id"]
        assert course["title"] == course_payload["title"]
        assert course["creator_id"] == "dev_user_trainer"
        print("[OK] [PASS] Trainer course creation verified (201)")

        # 3. Invalid ObjectId validation
        res = client.get("/api/v1/courses/not-a-valid-object-id")
        assert res.status_code == 400, f"Expected 400 for bad ObjectId, got {res.status_code}"
        print("[OK] [PASS] Invalid ObjectId format caught with 400 Bad Request")

        # 4. Course details and list
        res = client.get("/api/v1/courses")
        assert res.status_code == 200
        courses = res.json()
        assert len(courses) == 1
        print("[OK] [PASS] Course listing verified")

        # 5. Course ownership: another user cannot update
        update_payload = {"title": "Updated Unauthorized DSA"}
        res = client.patch(f"/api/v1/courses/{course_id}", headers=other_trainer_headers, json=update_payload)
        assert res.status_code == 403, f"Expected 403 for non-owner, got {res.status_code}"
        print("[OK] [PASS] Course ownership protection verified (403 on non-owner update)")

        # 6. Add Concept 1 (Fundamental - No prerequisites) -> Tier 0
        c1_payload = {
            "title": "Arrays and Pointers",
            "description": "Contiguous memory layout and pointer arithmetic fundamentals.",
            "difficulty": "beginner",
            "prerequisite_concept_ids": [],
            "learning_objectives": ["Understand memory allocation", "Implement array indexing"],
            "estimated_minutes": 25,
            "order_index": 1
        }
        res = client.post(f"/api/v1/courses/{course_id}/concepts", headers=trainer_headers, json=c1_payload)
        assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
        c1 = res.json()
        c1_id = c1["id"]
        print("[OK] [PASS] Concept 1 (Root node) added successfully")

        # 7. Add Concept 2 (Depends on Concept 1) -> Tier 1
        c2_payload = {
            "title": "Linked Lists & Stacks",
            "description": "Singly and doubly linked nodes and LIFO stack operations.",
            "difficulty": "beginner",
            "prerequisite_concept_ids": [c1_id],
            "learning_objectives": ["Implement node traversal", "Stack push/pop"],
            "estimated_minutes": 35,
            "order_index": 2
        }
        res = client.post(f"/api/v1/courses/{course_id}/concepts", headers=trainer_headers, json=c2_payload)
        assert res.status_code == 201
        c2 = res.json()
        c2_id = c2["id"]
        print("[OK] [PASS] Concept 2 (Dependent on C1) added successfully")

        # 8. Add Concept 3 (Depends on Concept 2) -> Tier 2
        c3_payload = {
            "title": "Binary Trees & BSTs",
            "description": "Hierarchical node structures and recursive search.",
            "difficulty": "intermediate",
            "prerequisite_concept_ids": [c2_id],
            "learning_objectives": ["Tree traversals (inorder, preorder)", "Binary search property"],
            "estimated_minutes": 45,
            "order_index": 3
        }
        res = client.post(f"/api/v1/courses/{course_id}/concepts", headers=trainer_headers, json=c3_payload)
        assert res.status_code == 201
        c3 = res.json()
        c3_id = c3["id"]
        print("[OK] [PASS] Concept 3 (Dependent on C2) added successfully")

        # 9. Invalid prerequisite reference validation
        fake_id = str(ObjectId())
        bad_prereq_payload = {
            "title": "Invalid Node",
            "description": "Points to non-existent concept",
            "prerequisite_concept_ids": [fake_id]
        }
        res = client.post(f"/api/v1/courses/{course_id}/concepts", headers=trainer_headers, json=bad_prereq_payload)
        assert res.status_code == 400, f"Expected 400 for non-existent prereq, got {res.status_code}"
        print("[OK] [PASS] Non-existent prerequisite rejected (400)")

        # 10. Self-prerequisite validation
        res = client.patch(f"/api/v1/concepts/{c1_id}", headers=trainer_headers, json={"prerequisite_concept_ids": [c1_id]})
        assert res.status_code == 400
        print("[OK] [PASS] Self-prerequisite rejected (400)")

        # 11. Circular prerequisite cycle detection:
        # Currently: C1 -> C2 -> C3
        # Attempt: Make C1 depend on C3 => C1 -> C2 -> C3 -> C1 (CYCLE!)
        res = client.patch(f"/api/v1/concepts/{c1_id}", headers=trainer_headers, json={"prerequisite_concept_ids": [c3_id]})
        assert res.status_code == 400, f"Expected 400 for cycle, got {res.status_code}: {res.text}"
        assert "Circular prerequisite" in res.json()["detail"]
        print(f"[OK] [PASS] Cycle detection prevented circular dependency: {res.json()['detail']}")

        # 12. Concept Graph Layout verification (Nodes, Edges, Topological Tiers)
        res = client.get(f"/api/v1/courses/{course_id}/concepts")
        assert res.status_code == 200
        graph = res.json()
        assert graph["total_concepts"] == 3
        assert len(graph["edges"]) == 2  # C1 -> C2, C2 -> C3

        node_map = {n["id"]: n for n in graph["nodes"]}
        assert node_map[c1_id]["tier_level"] == 0, f"Expected tier 0 for C1, got {node_map[c1_id]['tier_level']}"
        assert node_map[c2_id]["tier_level"] == 1, f"Expected tier 1 for C2, got {node_map[c2_id]['tier_level']}"
        assert node_map[c3_id]["tier_level"] == 2, f"Expected tier 2 for C3, got {node_map[c3_id]['tier_level']}"
        print("[OK] [PASS] Concept Graph layout & topological tiers verified (Tier 0 -> Tier 1 -> Tier 2)")

        # 13. Dependency-protected deletion: cannot delete C1 because C2 depends on it
        res = client.delete(f"/api/v1/concepts/{c1_id}", headers=trainer_headers)
        assert res.status_code == 400, f"Expected 400 for protected deletion, got {res.status_code}"
        assert "depend on it" in res.json()["detail"]
        print("[OK] [PASS] Dependent concept protected against accidental deletion (400)")

        # 14. Deleting leaf concept C3 succeeds
        res = client.delete(f"/api/v1/concepts/{c3_id}", headers=trainer_headers)
        assert res.status_code == 200
        print("[OK] [PASS] Leaf concept deleted successfully (200)")

        print("\nAll Course & Concept module tests passed with 100% compliance!\n")

    finally:
        app.dependency_overrides.clear()


if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"\n[FAIL] Test error: {e}", file=sys.stderr)
        sys.exit(1)
