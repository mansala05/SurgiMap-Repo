"""Update one item in one or all local pharmacy databases."""

import argparse
from datetime import datetime
from pathlib import Path
import sqlite3

from app.services.master_catalog import normalize_item_name
from scripts.demo_config import TOTAL_PHARMACIES, demo_updated_at

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BACKEND_DIR / "data"


def main() -> None:
    parser = argparse.ArgumentParser()
    scope = parser.add_mutually_exclusive_group()
    scope.add_argument(
        "--pharmacy",
        type=int,
        default=1,
        choices=range(1, TOTAL_PHARMACIES + 1),
    )
    scope.add_argument(
        "--all-pharmacies",
        action="store_true",
        help=f"Update the matching item in all {TOTAL_PHARMACIES} pharmacy databases",
    )
    parser.add_argument("--item", default="C Section Kit")
    change = parser.add_mutually_exclusive_group(required=True)
    change.add_argument("--quantity", type=int)
    change.add_argument(
        "--refresh-only",
        action="store_true",
        help="Refresh demo timestamps without changing quantities",
    )
    args = parser.parse_args()

    if args.quantity is not None and args.quantity < 0:
        parser.error("quantity must be zero or greater")

    requested_standard_name = normalize_item_name(args.item)
    pharmacy_ids = (
        range(1, TOTAL_PHARMACIES + 1)
        if args.all_pharmacies
        else [args.pharmacy]
    )
    updates: list[tuple[int, Path, str]] = []

    for pharmacy_id in pharmacy_ids:
        db_path = DATA_DIR / f"pharmacy_{pharmacy_id:02d}.db"
        with sqlite3.connect(db_path) as connection:
            matching_local_name = next(
                (
                    local_name
                    for (local_name,) in connection.execute(
                        "SELECT item_name FROM inventory"
                    ).fetchall()
                    if normalize_item_name(local_name) == requested_standard_name
                ),
                None,
            )
        if matching_local_name is None:
            raise SystemExit(f"Catalog item not found in {db_path.name}: {args.item}")
        updates.append((pharmacy_id, db_path, matching_local_name))

    snapshot_time = datetime.now()
    for pharmacy_id, db_path, matching_local_name in updates:
        updated_at = (
            demo_updated_at(pharmacy_id, now=snapshot_time)
            if args.all_pharmacies
            else snapshot_time
        ).isoformat()
        with sqlite3.connect(db_path) as connection:
            if args.refresh_only:
                cursor = connection.execute(
                    "UPDATE inventory SET updated_at = ? WHERE item_name = ?",
                    (updated_at, matching_local_name),
                )
            else:
                cursor = connection.execute(
                    """
                    UPDATE inventory
                    SET quantity = ?, updated_at = ?
                    WHERE item_name = ?
                    """,
                    (args.quantity, updated_at, matching_local_name),
                )
            if cursor.rowcount == 0:
                raise SystemExit(f"Item not found in {db_path.name}: {args.item}")

        action = (
            "Refreshed timestamp for"
            if args.refresh_only
            else f"Updated quantity to {args.quantity} for"
        )
        print(f"{action} {matching_local_name!r} in {db_path.name} at {updated_at}.")


if __name__ == "__main__":
    main()
