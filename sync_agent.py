import sqlite3
import json
from master_catalog import normalize_item_name


PHARMACY_DB_FOLDER = "data"
TOTAL_PHARMACIES = 10
OUTPUT_FILE = "sync_payload.json"


def get_stock_status(quantity):
    if quantity == 0:
        return "Not Available"
    elif quantity <= 3:
        return "Low Stock"
    else:
        return "Available"


def read_pharmacy_inventory(pharmacy_id):
    db_path = f"{PHARMACY_DB_FOLDER}/pharmacy_{pharmacy_id:02d}.db"

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT item_name, quantity, updated_at FROM inventory")
    rows = cursor.fetchall()

    conn.close()
    return rows


def build_sync_payload():
    payload = []

    for pharmacy_id in range(1, TOTAL_PHARMACIES + 1):
        rows = read_pharmacy_inventory(pharmacy_id)

        for local_item_name, quantity, updated_at in rows:
            standard_item_name = normalize_item_name(local_item_name)
            status = get_stock_status(quantity)

            item_data = {
                "pharmacy_id": pharmacy_id,
                "local_item_name": local_item_name,
                "standard_item_name": standard_item_name,
                "quantity": quantity,
                "status": status,
                "last_updated": updated_at
            }

            payload.append(item_data)

    return payload


def save_payload_to_json(payload):
    with open(OUTPUT_FILE, "w") as file:
        json.dump(payload, file, indent=4)

    print(f"Saved sync payload to {OUTPUT_FILE}")


if __name__ == "__main__":
    sync_payload = build_sync_payload()

    print("Sync Agent Payload from 10 Pharmacies")
    print("-------------------------------------")
    print(f"Total records: {len(sync_payload)}")

    save_payload_to_json(sync_payload)