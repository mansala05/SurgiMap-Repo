import sqlite3
from master_catalog import normalize_item_name


def get_stock_status(quantity):
    if quantity == 0:
        return "Not Available"
    elif quantity <= 3:
        return "Low Stock"
    else:
        return "Available"


conn = sqlite3.connect("data/pharmacy_01.db")
cursor = conn.cursor()

cursor.execute("SELECT id, item_name, quantity, updated_at FROM inventory")
rows = cursor.fetchall()

print("Pharmacy 01 Normalized Inventory")
print("--------------------------------")

for row in rows:
    item_id, local_item_name, quantity, updated_at = row

    standard_item_name = normalize_item_name(local_item_name)
    status = get_stock_status(quantity)

    print(f"{item_id} | Local: {local_item_name} | Standard: {standard_item_name} | Qty: {quantity} | Status: {status}")

conn.close()