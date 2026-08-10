"""Update one item in a local pharmacy database for a sync demonstration."""

import argparse
from datetime import datetime
from pathlib import Path
import sqlite3

from app.services.master_catalog import normalize_item_name

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BACKEND_DIR / "data"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pharmacy", type=int, default=1, choices=range(1, 11))
    parser.add_argument("--item", default="C Section Kit")
    parser.add_argument("--quantity", type=int, required=True)
    args = parser.parse_args()

    if args.quantity < 0:
        parser.error("quantity must be zero or greater")

    db_path = DATA_DIR / f"pharmacy_{args.pharmacy:02d}.db"
    with sqlite3.connect(db_path) as connection:
        requested_standard_name = normalize_item_name(args.item)
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
            raise SystemExit(f"Catalog item not found: {args.item}")
        cursor = connection.execute(
            """
            UPDATE inventory
            SET quantity = ?, updated_at = ?
            WHERE item_name = ?
            """,
            (args.quantity, datetime.now().isoformat(), matching_local_name),
        )
        if cursor.rowcount == 0:
            raise SystemExit(f"Item not found: {args.item}")

    print(
        f"Updated {matching_local_name!r} ({requested_standard_name}) "
        f"to {args.quantity} in {db_path.name}."
    )


if __name__ == "__main__":
    main()
