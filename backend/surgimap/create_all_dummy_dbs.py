import sqlite3
import os
from datetime import datetime

os.makedirs("data", exist_ok=True)

pharmacy_data = {
    1: [
        ("C Section Kit", 5),
        ("Appendix Surgery Kit", 2),
        ("General Surgery Pack", 0),
        ("Suture Pack", 10),
        ("Dressing Kit", 3),
    ],
    2: [
        ("Cesarean Kit", 1),
        ("Appendectomy Kit", 4),
        ("Surgery Pack", 6),
        ("Sutures", 0),
        ("Wound Dressing Kit", 8),
    ],
    3: [
        ("Caesarean Surgery Kit", 0),
        ("Appendix Surgery Kit", 3),
        ("General Surgery Pack", 5),
        ("Suture Pack", 2),
        ("Dressing Kit", 7),
    ],
    4: [
        ("C Section Kit", 4),
        ("Appendectomy Kit", 0),
        ("Surgery Pack", 1),
        ("Sutures", 6),
        ("Wound Dressing Kit", 3),
    ],
    5: [
        ("Cesarean Kit", 7),
        ("Appendix Surgery Kit", 2),
        ("General Surgery Pack", 4),
        ("Suture Pack", 0),
        ("Dressing Kit", 9),
    ],
    6: [
        ("Caesarean Surgery Kit", 2),
        ("Appendectomy Kit", 5),
        ("Surgery Pack", 0),
        ("Sutures", 3),
        ("Wound Dressing Kit", 6),
    ],
    7: [
        ("C Section Kit", 0),
        ("Appendix Surgery Kit", 8),
        ("General Surgery Pack", 3),
        ("Suture Pack", 5),
        ("Dressing Kit", 1),
    ],
    8: [
        ("Cesarean Kit", 6),
        ("Appendectomy Kit", 2),
        ("Surgery Pack", 7),
        ("Sutures", 1),
        ("Wound Dressing Kit", 0),
    ],
    9: [
        ("Caesarean Surgery Kit", 3),
        ("Appendix Surgery Kit", 0),
        ("General Surgery Pack", 9),
        ("Suture Pack", 2),
        ("Dressing Kit", 4),
    ],
    10: [
        ("C Section Kit", 8),
        ("Appendectomy Kit", 1),
        ("Surgery Pack", 5),
        ("Sutures", 0),
        ("Wound Dressing Kit", 2),
    ],
}


def create_pharmacy_db(pharmacy_id, items):
    db_path = f"data/pharmacy_{pharmacy_id:02d}.db"

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        updated_at TEXT NOT NULL
    )
    """)

    cursor.execute("DELETE FROM inventory")

    for item_name, quantity in items:
        cursor.execute("""
        INSERT INTO inventory (item_name, quantity, updated_at)
        VALUES (?, ?, ?)
        """, (item_name, quantity, datetime.now().isoformat()))

    conn.commit()
    conn.close()

    print(f"Created {db_path}")


for pharmacy_id, items in pharmacy_data.items():
    create_pharmacy_db(pharmacy_id, items)

print("All 10 pharmacy databases created successfully")