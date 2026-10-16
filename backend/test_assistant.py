import asyncio
import os
import unittest
from unittest.mock import patch, MagicMock

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


class AssistantApiTests(unittest.TestCase):
    def test_health_check(self):
        response = client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_assistant_chat_success(self):
        payload = {
            "message": "Explain binary search",
            "student_id": "STU001",
            "mode": "chat",
            "history": [],
        }
        response = client.post("/api/assistant/chat", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("reply", data)
        self.assertIn("suggested_actions", data)
        self.assertIsInstance(data["suggested_actions"], list)

    def test_assistant_chat_message_length_validation(self):
        payload = {
            "message": "a" * 4001,
            "student_id": "STU001",
        }
        response = client.post("/api/assistant/chat", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_student_profile_lookup(self):
        response = client.get("/api/student/profile?student_id=STU001")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("student_id"), "STU001")
        self.assertIn("mastery", data)

    def test_student_profile_not_found(self):
        response = client.get("/api/student/profile?student_id=NON_EXISTENT_STU_9999")
        self.assertEqual(response.status_code, 404)

    def test_adaptive_recommendations_endpoint(self):
        response = client.get("/api/adaptive/recommendations?student_id=STU001")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data.get("has_data"))
        self.assertIn("weak_concepts", data)
        self.assertIn("recommendations", data)

    def test_viva_generate_and_evaluate(self):
        code_sample = "def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)"
        gen_payload = {
            "student_id": "STU001",
            "code": code_sample,
            "language": "python",
        }
        gen_res = client.post("/api/assistant/viva/generate", json=gen_payload)
        self.assertEqual(gen_res.status_code, 200)
        gen_data = gen_res.json()
        self.assertIn("questions", gen_data)
        self.assertGreaterEqual(len(gen_data["questions"]), 1)

        eval_payload = {
            "student_id": "STU001",
            "code": code_sample,
            "language": "python",
            "questions": ["What is the time complexity?"],
            "answers": ["It is exponential O(2^N) due to redundant overlapping subproblems."],
        }
        eval_res = client.post("/api/assistant/viva/evaluate", json=eval_payload)
        self.assertEqual(eval_res.status_code, 200)
        eval_data = eval_res.json()
        self.assertIn("evaluation_text", eval_data)
        self.assertIn("score", eval_data)

    def test_conversation_history_retrieval_and_clearing(self):
        chat_payload = {
            "message": "Testing conversation save",
            "student_id": "STU_TEMP_TEST",
            "mode": "chat",
        }
        client.post("/api/assistant/chat", json=chat_payload)

        get_res = client.get("/api/assistant/history?student_id=STU_TEMP_TEST")
        self.assertEqual(get_res.status_code, 200)
        history_data = get_res.json()
        self.assertEqual(history_data["student_id"], "STU_TEMP_TEST")
        self.assertGreaterEqual(len(history_data["conversations"]), 1)

        del_res = client.delete("/api/assistant/history?student_id=STU_TEMP_TEST")
        self.assertEqual(del_res.status_code, 200)
        self.assertGreaterEqual(del_res.json()["deleted_count"], 1)

        get_after = client.get("/api/assistant/history?student_id=STU_TEMP_TEST")
        self.assertEqual(len(get_after.json()["conversations"]), 0)


if __name__ == "__main__":
    unittest.main()
