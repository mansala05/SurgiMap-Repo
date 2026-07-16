"""Read local pharmacy databases and send normalized stock to the API."""

from __future__ import annotations

import json
from pathlib import Path
import sqlite3
import urllib.error
import urllib.request

from app.services.master_catalog import normalize_item_name

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BACKEND_DIR / "data"
OUTPUT_FILE = BACKEND_DIR / "sync_payload.json"
BACKEND_SYNC_URL = "http://127.0.0.1:8000/sync/inventory"
TOTAL_PHARMACIES = 10


def get_stock_status(quantity: int) -> str:
    if quantity <= 0:
        return "Not Available"
    if quantity <= 3:
        return "Low Stock"
    return "Available"


def read_pharmacy_inventory(pharmacy_id: int):
    db_path = DATA_DIR / f"pharmacy_{pharmacy_id:02d}.db"
    if not db_path.exists():
        raise FileNotFoundError(
            f"Missing {db_path.name}. Run: python -m scripts.create_demo_databases"
        )
    with sqlite3.connect(db_path) as connection:
        return connection.execute(
            "SELECT item_name, quantity, updated_at FROM inventory"
        ).fetchall()


def build_sync_payload() -> list[dict[str, object]]:
    payload: list[dict[str, object]] = []
    for pharmacy_id in range(1, TOTAL_PHARMACIES + 1):
        for local_name, quantity, updated_at in read_pharmacy_inventory(pharmacy_id):
            payload.append(
                {
                    "pharmacy_id": pharmacy_id,
                    "local_item_name": local_name,
                    "standard_item_name": normalize_item_name(local_name),
                    "quantity": quantity,
                    "status": get_stock_status(quantity),
                    "last_updated": updated_at,
                }
            )
    return payload


def send_payload(payload: list[dict[str, object]]) -> None:
    request = urllib.request.Request(
        BACKEND_SYNC_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            print(response.read().decode("utf-8"))
    except urllib.error.URLError as error:
        raise RuntimeError(
            "Could not reach the API. Start it with: uvicorn app.main:app --reload"
        ) from error


def main() -> None:
    payload = build_sync_payload()
    OUTPUT_FILE.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Prepared {len(payload)} records and saved {OUTPUT_FILE.name}.")
    send_payload(payload)


if __name__ == "__main__":
    main()
