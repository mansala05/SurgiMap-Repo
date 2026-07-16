"""Create the ten local SQLite databases used by the sync-agent demo."""

from datetime import datetime
from pathlib import Path
import sqlite3

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BACKEND_DIR / "data"

PHARMACY_DATA = {
    1: [("C Section Kit", 5), ("Appendix Surgery Kit", 2), ("General Surgery Pack", 0), ("Suture Pack", 10), ("Dressing Kit", 3)],
    2: [("Cesarean Kit", 1), ("Appendectomy Kit", 4), ("Surgery Pack", 6), ("Sutures", 0), ("Wound Dressing Kit", 8)],
    3: [("Caesarean Surgery Kit", 0), ("Appendix Surgery Kit", 3), ("General Surgery Pack", 5), ("Suture Pack", 2), ("Dressing Kit", 7)],
    4: [("C Section Kit", 4), ("Appendectomy Kit", 0), ("Surgery Pack", 1), ("Sutures", 6), ("Wound Dressing Kit", 3)],
    5: [("Cesarean Kit", 7), ("Appendix Surgery Kit", 2), ("General Surgery Pack", 4), ("Suture Pack", 0), ("Dressing Kit", 9)],
    6: [("Caesarean Surgery Kit", 2), ("Appendectomy Kit", 5), ("Surgery Pack", 0), ("Sutures", 3), ("Wound Dressing Kit", 6)],
    7: [("C Section Kit", 0), ("Appendix Surgery Kit", 8), ("General Surgery Pack", 3), ("Suture Pack", 5), ("Dressing Kit", 1)],
    8: [("Cesarean Kit", 6), ("Appendectomy Kit", 2), ("Surgery Pack", 7), ("Sutures", 1), ("Wound Dressing Kit", 0)],
    9: [("Caesarean Surgery Kit", 3), ("Appendix Surgery Kit", 0), ("General Surgery Pack", 9), ("Suture Pack", 2), ("Dressing Kit", 4)],
    10: [("C Section Kit", 8), ("Appendectomy Kit", 1), ("Surgery Pack", 5), ("Sutures", 0), ("Wound Dressing Kit", 2)],
}


def create_pharmacy_db(pharmacy_id: int, items: list[tuple[str, int]]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    db_path = DATA_DIR / f"pharmacy_{pharmacy_id:02d}.db"
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
            [(name, quantity, datetime.now().isoformat()) for name, quantity in items],
        )
    print(f"Created {db_path.name}")


def main() -> None:
    for pharmacy_id, items in PHARMACY_DATA.items():
        create_pharmacy_db(pharmacy_id, items)
    print("Created all 10 demo pharmacy databases.")


if __name__ == "__main__":
    main()
