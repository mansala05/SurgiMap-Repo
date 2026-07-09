import sqlite3
from datetime import datetime

DB_PATH = "data/pharmacy_01.db"
ITEM_NAME = "C Section Kit"

# Change this value for demo:
# 0  = Not Available
# 2  = Low Stock
# 5  = Available
NEW_QUANTITY = 5

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute(
    """
    UPDATE inventory
    SET quantity = ?, updated_at = ?
    WHERE item_name = ?
    """,
    (NEW_QUANTITY, datetime.now().isoformat(), ITEM_NAME)
)

conn.commit()
conn.close()

print(f"{ITEM_NAME} updated to quantity {NEW_QUANTITY} in pharmacy_01.db")