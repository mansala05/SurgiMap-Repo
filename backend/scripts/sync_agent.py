"""Read local pharmacy databases and send normalized stock to the API."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sqlite3
import time
import urllib.error
import urllib.request

from dotenv import load_dotenv

from app.services.master_catalog import normalize_item_name
from scripts.demo_config import TOTAL_PHARMACIES

BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")
DATA_DIR = BACKEND_DIR / "data"
OUTPUT_FILE = BACKEND_DIR / "sync_payload.json"
BACKEND_SYNC_URL = os.getenv(
    "SURGIMAP_SYNC_URL",
    "http://127.0.0.1:8000/sync/inventory",
)
SYNC_API_KEY = os.getenv("SURGIMAP_SYNC_API_KEY", "surgimap-local-demo-key")
DEFAULT_SYNC_INTERVAL_SECONDS = os.getenv("SURGIMAP_SYNC_INTERVAL_SECONDS", "30")


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
    failed_pharmacies: list[int] = []
    for pharmacy_id in range(1, TOTAL_PHARMACIES + 1):
        try:
            inventory = read_pharmacy_inventory(pharmacy_id)
        except (FileNotFoundError, sqlite3.Error) as error:
            failed_pharmacies.append(pharmacy_id)
            print(f"Pharmacy {pharmacy_id:02d} unavailable: {error}")
            continue

        for local_name, quantity, updated_at in inventory:
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
    if failed_pharmacies:
        pharmacy_list = ", ".join(f"{item:02d}" for item in failed_pharmacies)
        print(f"Continuing without pharmacy database(s): {pharmacy_list}")
    return payload


def send_payload(payload: list[dict[str, object]]) -> None:
    request = urllib.request.Request(
        BACKEND_SYNC_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "X-Sync-Key": SYNC_API_KEY,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            print(response.read().decode("utf-8"))
    except urllib.error.URLError as error:
        raise RuntimeError(
            "Could not reach the API. Start it with: uvicorn app.main:app --reload"
        ) from error


def sync_once(*, prepare_only: bool = False) -> None:
    payload = build_sync_payload()
    if not payload:
        raise RuntimeError("No pharmacy databases were available to sync")
    OUTPUT_FILE.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Prepared {len(payload)} records and saved {OUTPUT_FILE.name}.")
    if not prepare_only:
        send_payload(payload)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--prepare-only",
        action="store_true",
        help="Write sync_payload.json without sending it to the API",
    )
    parser.add_argument(
        "--watch",
        action="store_true",
        help="Keep running and automatically sync at a fixed interval",
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=DEFAULT_SYNC_INTERVAL_SECONDS,
        metavar="SECONDS",
        help=(
            "Seconds between automatic syncs (default: "
            "SURGIMAP_SYNC_INTERVAL_SECONDS or 30)"
        ),
    )
    args = parser.parse_args()
    if args.interval <= 0:
        parser.error("--interval must be greater than zero")
    if args.prepare_only and args.watch:
        parser.error("--prepare-only cannot be combined with --watch")

    if not args.watch:
        sync_once(prepare_only=args.prepare_only)
        return

    print(f"Automatic sync enabled. Syncing every {args.interval:g} seconds.")
    try:
        while True:
            try:
                sync_once()
                retry_delay = args.interval
            except RuntimeError as error:
                retry_delay = min(args.interval, 5)
                print(f"Sync failed: {error}. Retrying in {retry_delay:g} seconds.")
            time.sleep(retry_delay)
    except KeyboardInterrupt:
        print("Automatic sync stopped.")


if __name__ == "__main__":
    main()
