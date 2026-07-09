import sqlite3
from datetime import datetime

conn = sqlite3.connect("data/pharmacy_01.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    updated_at TEXT NOT NULL
)
""")

sample_items = [
    ("C Section Kit", 5),
    ("Appendix Surgery Kit", 2),
    ("General Surgery Pack", 0),
    ("Suture Pack", 10),
    ("Dressing Kit", 3)
]

cursor.execute("DELETE FROM inventory")

for item_name, quantity in sample_items:
    cursor.execute("""
    INSERT INTO inventory (item_name, quantity, updated_at)
    VALUES (?, ?, ?)
    """, (item_name, quantity, datetime.now().isoformat()))

conn.commit()
conn.close()

print("pharmacy_01.db created successfully")
