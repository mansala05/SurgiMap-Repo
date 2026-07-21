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
    },
    {
        "pharmacy_id": 2,
        "local_item_name": "Cesarean Kit",
        "standard_item_name": "Caesarean Surgical Kit",
        "quantity": 2,
        "status": "Available",
        "last_updated": "2026-07-16T12:05:00",
    },
    {
        "pharmacy_id": 3,
        "local_item_name": "Caesarean Surgery Kit",
        "standard_item_name": "Caesarean Surgical Kit",
        "quantity": 0,
        "status": "Not Available",
        "last_updated": "2026-07-16T12:10:00",
    },
]


def test_health_sync_and_search():
    with TestClient(app) as client:
        assert client.get("/health").json() == {
            "status": "healthy",
            "database": "connected",
        }

        sync_response = client.post("/sync/inventory", json=SAMPLE_PAYLOAD)
        assert sync_response.status_code == 200
        assert sync_response.json()["total"] == 3

        search_response = client.get("/search", params={"item_name": "c section kit"})
        assert search_response.status_code == 200
        results = search_response.json()
        assert len(results) == 2
        assert results[0]["pharmacy_name"] == "City Med Pharmacy"
        assert results[0]["status"] == "Available"
        assert results[0]["latitude"] == 6.9066
        assert results[0]["longitude"] == 79.8648
        assert results[1]["status"] == "Low Stock"
        assert all(result["pharmacy_name"] != "MediQuick Pharmacy" for result in results)

        nearby_response = client.get(
            "/search",
            params={
                "item_name": "cesarean kit",
                "user_latitude": 6.8649,
                "user_longitude": 79.8997,
            },
        )
        assert nearby_response.status_code == 200
        nearby_results = nearby_response.json()
        assert nearby_results[0]["pharmacy_name"] == "CarePlus Pharmacy"
        assert nearby_results[0]["distance_km"] == 0.0

        invalid_location_response = client.get(
            "/search",
            params={"item_name": "caesarean", "user_latitude": 6.8649},
        )
        assert invalid_location_response.status_code == 400


def teardown_module():
    if TEST_DB.exists():
        TEST_DB.unlink()
