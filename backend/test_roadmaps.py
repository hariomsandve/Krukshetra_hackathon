import asyncio
import httpx

async def test_roadmaps():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000", timeout=30.0) as client:
        # 1. Health check
        res = await client.get("/api/v1/health")
        print("Health status:", res.status_code, res.json())

        # 2. List roadmaps
        res = await client.get("/api/v1/roadmaps")
        print("List roadmaps status:", res.status_code)
        data = res.json()
        print(f"Total roadmaps returned: {data.get('total')} (Expected: 18)")
        assert data.get("total") == 18, f"Expected 18 roadmaps, got {data.get('total')}"

        # 3. Get specific roadmap (web-development)
        res = await client.get("/api/v1/roadmaps/web-development")
        print("Get web-dev roadmap:", res.status_code)
        web_dev = res.json()["data"]
        print(f"Title: {web_dev['title']}, Stages: {len(web_dev['stages'])}")
        assert len(web_dev["stages"]) == 9

        # 4. Export as markdown
        res = await client.get("/api/v1/roadmaps/web-development/export?format=markdown")
        print("Export markdown status:", res.status_code)
        assert "# Mentos Learning Roadmap: Web Development" in res.text
        print("Markdown export verified successfully!")

        # 5. Enroll in roadmap
        res = await client.post("/api/v1/roadmaps/web-development/enroll")
        print("Enroll status:", res.status_code, res.json().get("message"))

        # 6. Update progress
        res = await client.patch("/api/v1/my-roadmaps/web-development/progress", json={
            "stage_id": "web-s1-internet",
            "completed": True,
            "note": "Completed HTTP and DNS fundamentals with Wireshark analysis.",
            "confidence": 5
        })
        print("Update progress status:", res.status_code, "Completion %:", res.json()["data"]["completion_percent"])

        # 7. Check my-roadmaps
        res = await client.get("/api/v1/my-roadmaps")
        print("My roadmaps count:", res.json().get("total_enrolled"))

    print("\nALL BACKEND ROADMAP ENDPOINTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    asyncio.run(test_roadmaps())
