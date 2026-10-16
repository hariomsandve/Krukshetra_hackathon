"""
Phase 1 Verification Script
Tests health endpoint, authentication security, role enforcement, and FastAPI app routing.
"""
import sys
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_database

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["portal"] == "PS-2 Adaptive Learning and Assessment Portal"
    print("[OK] [PASS] Root route verified")


def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert "status" in data
    assert "database" in data
    print(f"[OK] [PASS] Health check verified (Database state: {data['database']['status']})")


def test_unauthorized_access():
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("[OK] [PASS] Protected route correctly rejects unauthenticated request (401)")


def test_mock_dev_auth():
    # Test dev mock token with in-memory DB override
    class MockCollection:
        def __init__(self):
            self.docs = []

        async def find_one(self, query):
            for doc in self.docs:
                if all(doc.get(k) == v for k, v in query.items()):
                    return doc
            return None

        async def insert_one(self, doc):
            doc["_id"] = "mock_id_123"
            self.docs.append(doc)
            class InsertResult:
                inserted_id = "mock_id_123"
            return InsertResult()

        async def update_one(self, query, update):
            doc = await self.find_one(query)
            if doc and "$set" in update:
                doc.update(update["$set"])

    class MockDatabase:
        def __init__(self):
            self.users = MockCollection()

    mock_db = MockDatabase()
    app.dependency_overrides[get_database] = lambda: mock_db

    try:
        # Dev student token
        headers = {"Authorization": "Bearer dev-student"}
        resp = client.get("/api/v1/auth/me", headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
        data = resp.json()
        assert data["role"] == "student"
        assert data["email"] == "student@adaptiq.io"
        print("[OK] [PASS] Dev authentication and student auto-provisioning verified")

        # Sync profile (cannot escalate role)
        sync_payload = {
            "display_name": "Updated Student",
            "branch": "CSE",
            "year": 3,
            "skills": ["Python", "FastAPI"]
        }
        sync_resp = client.post("/api/v1/auth/sync", headers=headers, json=sync_payload)
        assert sync_resp.status_code == 200
        sync_data = sync_resp.json()
        assert sync_data["display_name"] == "Updated Student"
        assert sync_data["role"] == "student"  # Role remained student
        print("[OK] [PASS] Profile sync verified with strict role preservation")

    finally:
        app.dependency_overrides.clear()


if __name__ == "__main__":
    print("\n--- Running Phase 1 Backend Verification Tests ---")
    try:
        test_root()
        test_health()
        test_unauthorized_access()
        test_mock_dev_auth()
        print("\nAll Phase 1 verification tests passed successfully!\n")
    except Exception as e:
        print(f"\n[FAIL] Test error: {e}", file=sys.stderr)
        sys.exit(1)
