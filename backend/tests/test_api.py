import os
from pathlib import Path

TEST_DB = Path(__file__).with_name("test_surgimap.db")
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB}"

from fastapi.testclient import TestClient

from app.main import app


SAMPLE_PAYLOAD = [
    {
        "pharmacy_id": 1,
        "local_item_name": "C Section Kit",
        "standard_item_name": "Caesarean Surgical Kit",
        "quantity": 5,
        "status": "Available",
        "last_updated": "2026-07-16T12:00:00",
    }
]


def test_health_sync_and_search():
    with TestClient(app) as client:
        assert client.get("/health").json() == {
            "status": "healthy",
            "database": "connected",
        }

        sync_response = client.post("/sync/inventory", json=SAMPLE_PAYLOAD)
        assert sync_response.status_code == 200
        assert sync_response.json()["total"] == 1

        search_response = client.get("/search", params={"item_name": "c section kit"})
        assert search_response.status_code == 200
        results = search_response.json()
        assert len(results) == 1
        assert results[0]["pharmacy_name"] == "City Med Pharmacy"
        assert results[0]["status"] == "Available"


def teardown_module():
    if TEST_DB.exists():
        TEST_DB.unlink()
