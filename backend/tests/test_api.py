import os
from pathlib import Path

TEST_DB = Path(__file__).with_name("test_surgimap.db")
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB}"
os.environ["SURGIMAP_SYNC_API_KEY"] = "test-sync-key"

from fastapi.testclient import TestClient

from app.main import app
from app.services.master_catalog import (
    find_matching_standard_names,
    normalize_item_name,
)


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
SYNC_HEADERS = {"X-Sync-Key": "test-sync-key"}


def test_health_sync_and_search():
    with TestClient(app) as client:
        assert client.get("/health").json() == {
            "status": "healthy",
            "database": "connected",
        }
        preflight_response = client.options(
            "/search",
            headers={
                "Origin": "http://localhost:5174",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert preflight_response.status_code == 200
        assert preflight_response.headers["access-control-allow-origin"] == "http://localhost:5174"

        assert client.post("/sync/inventory", json=SAMPLE_PAYLOAD).status_code == 401
        assert client.post(
            "/sync/inventory",
            json=SAMPLE_PAYLOAD,
            headers={"X-Sync-Key": "wrong-key"},
        ).status_code == 401

        sync_response = client.post(
            "/sync/inventory",
            json=SAMPLE_PAYLOAD,
            headers=SYNC_HEADERS,
        )
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
        nearby_distances = [result["distance_km"] for result in nearby_results]
        assert nearby_distances == sorted(nearby_distances)

        invalid_location_response = client.get(
            "/search",
            params={"item_name": "caesarean", "user_latitude": 6.8649},
        )
        assert invalid_location_response.status_code == 400

        invalid_search_response = client.get(
            "/search",
            params={"item_name": "---"},
        )
        assert invalid_search_response.status_code == 400

        for search_term in ("c section", "CSK", "cesareen", "  Caesarean   KIT  "):
            flexible_response = client.get(
                "/search",
                params={"item_name": search_term},
            )
            assert flexible_response.status_code == 200
            assert len(flexible_response.json()) == 2

        suggestion_response = client.get(
            "/search/suggestions",
            params={"q": "cesarin"},
        )
        assert suggestion_response.status_code == 200
        assert suggestion_response.json()[0] == "Caesarean Surgical Kit"

        duplicate_response = client.post(
            "/sync/inventory",
            json=[SAMPLE_PAYLOAD[0], SAMPLE_PAYLOAD[0]],
            headers=SYNC_HEADERS,
        )
        assert duplicate_response.status_code == 400

        assert client.post(
            "/sync/inventory",
            json=[],
            headers=SYNC_HEADERS,
        ).status_code == 422

        assert client.post(
            "/sync/inventory",
            json=[SAMPLE_PAYLOAD[0]] * 501,
            headers=SYNC_HEADERS,
        ).status_code == 422

        assert client.post(
            "/stock/upsert",
            json={"pharmacy_id": 1, "kit_id": 1, "quantity": 10},
        ).status_code == 404


def test_master_catalog_matching():
    assert normalize_item_name("  C-SECTION   KIT ") == "Caesarean Surgical Kit"
    assert find_matching_standard_names("appendix")[0] == "Appendectomy Surgical Kit"
    assert find_matching_standard_names("DRK")[0] == "Dressing Kit"
    assert "General Surgery Kit" in find_matching_standard_names("surgery")


def teardown_module():
    if TEST_DB.exists():
        TEST_DB.unlink()
