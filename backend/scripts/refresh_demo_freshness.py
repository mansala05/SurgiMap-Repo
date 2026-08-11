"""Refresh demo inventory timestamps without changing any stock quantities."""

from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
import sqlite3

from scripts.demo_config import TOTAL_PHARMACIES, demo_updated_at

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BACKEND_DIR / "data"


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Refresh realistic timestamps across all demo inventory records "
            "without changing quantities."
        )
    )
    parser.parse_args()

    snapshot_time = datetime.now()
    total_updated = 0

    for pharmacy_id in range(1, TOTAL_PHARMACIES + 1):
        db_path = DATA_DIR / f"pharmacy_{pharmacy_id:02d}.db"
        if not db_path.exists():
            raise SystemExit(
                f"Missing {db_path.name}. Run: python -m scripts.create_demo_databases"
            )

        with sqlite3.connect(db_path) as connection:
            item_ids = [
                item_id
                for (item_id,) in connection.execute(
                    "SELECT id FROM inventory ORDER BY id"
                ).fetchall()
            ]
            connection.executemany(
                "UPDATE inventory SET updated_at = ? WHERE id = ?",
                [
                    (
                        demo_updated_at(
                            pharmacy_id,
                            item_index=item_index,
                            now=snapshot_time,
                        ).isoformat(),
                        item_id,
                    )
                    for item_index, item_id in enumerate(item_ids)
                ],
            )

        total_updated += len(item_ids)
        print(f"Refreshed {len(item_ids)} timestamps in {db_path.name}.")

    print(f"Refreshed {total_updated} demo inventory timestamps.")


if __name__ == "__main__":
    main()
