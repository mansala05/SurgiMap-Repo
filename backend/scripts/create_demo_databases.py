"""Rebuild local pharmacy databases and the central SurgiMap demo database."""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime
import os
from pathlib import Path
import sqlite3

from app.services.master_catalog import MASTER_CATALOG, STANDARD_NAMES, normalize_item_name

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BACKEND_DIR / "data"
CENTRAL_DB = BACKEND_DIR / "surgimap.db"
TOTAL_PHARMACIES = 10


def _aliases_by_item() -> dict[str, list[str]]:
    aliases: dict[str, list[str]] = defaultdict(list)
    for local_name, standard_name in MASTER_CATALOG.items():
        aliases[standard_name].append(local_name)
    return {name: sorted(values) for name, values in aliases.items()}


def build_pharmacy_data() -> dict[int, list[tuple[str, int]]]:
    """Create deterministic but varied inventory covering the full catalog."""
    aliases = _aliases_by_item()
    inventories: dict[int, list[tuple[str, int]]] = {}
    for pharmacy_id in range(1, TOTAL_PHARMACIES + 1):
        items: list[tuple[str, int]] = []
        for item_index, standard_name in enumerate(STANDARD_NAMES):
            local_aliases = aliases[standard_name]
            local_name = local_aliases[(pharmacy_id + item_index) % len(local_aliases)]
            quantity = (pharmacy_id * 7 + item_index * 3) % 13
            items.append((local_name, quantity))
        inventories[pharmacy_id] = items
    return inventories


PHARMACY_DATA = build_pharmacy_data()


def create_pharmacy_db(pharmacy_id: int, items: list[tuple[str, int]]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    db_path = DATA_DIR / f"pharmacy_{pharmacy_id:02d}.db"
    updated_at = datetime.now().isoformat()
    with sqlite3.connect(db_path) as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        cursor.execute("DELETE FROM inventory")
        cursor.executemany(
            "INSERT INTO inventory (item_name, quantity, updated_at) VALUES (?, ?, ?)",
            [(name, quantity, updated_at) for name, quantity in items],
        )
    print(f"Created {db_path.name} with {len(items)} catalog items")


def create_central_db() -> None:
    """Build a fresh central SQLite database from the local pharmacy data."""
    if CENTRAL_DB.exists():
        CENTRAL_DB.unlink()

    os.environ["DATABASE_URL"] = f"sqlite:///{CENTRAL_DB}"

    from app import models
    from app.database import Base, SessionLocal, engine
    from app.routers.search import compute_status
    from app.seed import seed_demo_pharmacies

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_demo_pharmacies(db)
        kits = {
            name: models.SurgicalKit(standard_name=name)
            for name in STANDARD_NAMES
        }
        db.add_all(kits.values())
        db.flush()

        updated_at = datetime.now()
        for pharmacy_id, inventory in PHARMACY_DATA.items():
            for local_name, quantity in inventory:
                standard_name = normalize_item_name(local_name)
                db.add(
                    models.Stock(
                        pharmacy_id=pharmacy_id,
                        kit_id=kits[standard_name].id,
                        quantity=quantity,
                        status=compute_status(quantity),
                        last_updated=updated_at,
                    )
                )
        db.commit()
    finally:
        db.close()
        engine.dispose()

    print(
        f"Created {CENTRAL_DB.name} with "
        f"{len(STANDARD_NAMES)} catalog items across {TOTAL_PHARMACIES} pharmacies"
    )


def main() -> None:
    for pharmacy_id, items in PHARMACY_DATA.items():
        create_pharmacy_db(pharmacy_id, items)
    create_central_db()
    print("Rebuilt all SurgiMap demo databases.")


if __name__ == "__main__":
    main()
