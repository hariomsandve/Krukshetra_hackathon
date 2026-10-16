import asyncio
import os
import unittest
from unittest.mock import patch

from fastapi import HTTPException
from pydantic import ValidationError

from backend import main


class MentorHintTests(unittest.TestCase):
    def test_returns_beginner_hint_and_error_severity(self):
        payload = main.MentorRequest(
            code="print(value)",
            language="Python",
            diagnostics=[
                main.Diagnostic(
                    severity="error",
                    message="value is not defined",
                    line=1,
                )
            ],
        )
        with patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}):
            with patch.object(main, "generate_gemini_hint", return_value="Define value first."):
                response = asyncio.run(main.create_mentor_hint(payload))

        self.assertEqual(response.hint, "Define value first.")
        self.assertEqual(response.severity, "error")
        self.assertEqual(response.speak_text, response.hint)

    def test_rejects_unsupported_language(self):
        payload = main.MentorRequest(code="echo hi", language="unknown")

        with self.assertRaises(HTTPException) as raised:
            asyncio.run(main.create_mentor_hint(payload))

        self.assertEqual(raised.exception.status_code, 422)

    def test_reports_missing_provider_configuration(self):
        payload = main.MentorRequest(code="print('hi')", language="python")
        with patch.dict(os.environ, {"GEMINI_API_KEY": ""}):
            with self.assertRaises(HTTPException) as raised:
                asyncio.run(main.create_mentor_hint(payload))

        self.assertEqual(raised.exception.status_code, 503)

    def test_reports_provider_failure_as_gateway_error(self):
        payload = main.MentorRequest(code="print('hi')", language="python")
        with patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}):
            with patch.object(
                main,
                "generate_gemini_hint",
                side_effect=main.GeminiProviderError("provider unavailable"),
            ):
                with self.assertRaises(HTTPException) as raised:
                    asyncio.run(main.create_mentor_hint(payload))

        self.assertEqual(raised.exception.status_code, 502)

    def test_enforces_request_size_limits(self):
        with self.assertRaises(ValidationError):
            main.MentorRequest(code="x" * 20_001, language="python")
        with self.assertRaises(ValidationError):
            main.MentorRequest(
                code="print('hi')",
                language="python",
                diagnostics=[
                    {"severity": "error", "message": "error"}
                    for _ in range(11)
                ],
            )


if __name__ == "__main__":
    unittest.main()
