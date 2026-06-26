import json
import os
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # demo purpose only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary in-memory storage
inventory_store = []

SYNC_PAYLOAD_FILE = "../sync_payload.json"


def load_inventory_from_json():
    if os.path.exists(SYNC_PAYLOAD_FILE):
        with open(SYNC_PAYLOAD_FILE, "r") as file:
            data = json.load(file)

        inventory_store.clear()
        inventory_store.extend(data)

        print(f"Loaded {len(inventory_store)} records from sync_payload.json")
    else:
        print("sync_payload.json not found. Run sync_agent.py first.")

# Dummy pharmacy details
pharmacies = {
    1: {
        "name": "City Med Pharmacy",
        "phone": "0771234567",
        "whatsapp": "94771234567",
        "address": "Colombo 07",
        "distance_km": 1.2,
        "maps_link": "https://maps.google.com/?q=Colombo+07"
    },
    2: {
        "name": "CarePlus Pharmacy",
        "phone": "0772345678",
        "whatsapp": "94772345678",
        "address": "Nugegoda",
        "distance_km": 2.4,
        "maps_link": "https://maps.google.com/?q=Nugegoda"
    },
    3: {
        "name": "MediQuick Pharmacy",
        "phone": "0773456789",
        "whatsapp": "94773456789",
        "address": "Borella",
        "distance_km": 3.1,
        "maps_link": "https://maps.google.com/?q=Borella"
    },
    4: {
        "name": "HealthHub Pharmacy",
        "phone": "0774567890",
        "whatsapp": "94774567890",
        "address": "Rajagiriya",
        "distance_km": 3.8,
        "maps_link": "https://maps.google.com/?q=Rajagiriya"
    },
    5: {
        "name": "LifeCare Pharmacy",
        "phone": "0775678901",
        "whatsapp": "94775678901",
        "address": "Dehiwala",
        "distance_km": 4.5,
        "maps_link": "https://maps.google.com/?q=Dehiwala"
    },
    6: {
        "name": "Surgical Care Pharmacy",
        "phone": "0776789012",
        "whatsapp": "94776789012",
        "address": "Maharagama",
        "distance_km": 5.3,
        "maps_link": "https://maps.google.com/?q=Maharagama"
    },
    7: {
        "name": "Green Cross Pharmacy",
        "phone": "0777890123",
        "whatsapp": "94777890123",
        "address": "Kirulapone",
        "distance_km": 2.9,
        "maps_link": "https://maps.google.com/?q=Kirulapone"
    },
    8: {
        "name": "Royal Med Pharmacy",
        "phone": "0778901234",
        "whatsapp": "94778901234",
        "address": "Kollupitiya",
        "distance_km": 1.8,
        "maps_link": "https://maps.google.com/?q=Kollupitiya"
    },
    9: {
        "name": "Family Care Pharmacy",
        "phone": "0779012345",
        "whatsapp": "94779012345",
        "address": "Battaramulla",
        "distance_km": 6.2,
        "maps_link": "https://maps.google.com/?q=Battaramulla"
    },
    10: {
        "name": "MedLine Pharmacy",
        "phone": "0770123456",
        "whatsapp": "94770123456",
        "address": "Wellawatte",
        "distance_km": 4.1,
        "maps_link": "https://maps.google.com/?q=Wellawatte"
    },
}


class InventorySyncItem(BaseModel):
    pharmacy_id: int
    local_item_name: str
    standard_item_name: str
    quantity: int
    status: str
    last_updated: str


@app.get("/")
def home():
    return {
        "message": "SurgiMap backend is running"
    }

@app.on_event("startup")
def startup_event():
    load_inventory_from_json()


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


@app.post("/sync/inventory")
def sync_inventory(items: List[InventorySyncItem]):
    inventory_store.clear()

    for item in items:
        inventory_store.append(item.model_dump())

    return {
        "message": "Inventory sync successful",
        "records_received": len(items),
        "stored_records": len(inventory_store)
    }


@app.get("/inventory")
def get_inventory():
    return {
        "total_records": len(inventory_store),
        "data": inventory_store
    }


@app.get("/search")
def search_inventory(item_name: str):
    search_text = item_name.strip().lower()
    results = []

    for item in inventory_store:
        standard_name = item["standard_item_name"].lower()
        status = item["status"]

        if search_text in standard_name and status in ["Available", "Low Stock"]:
            pharmacy_id = item["pharmacy_id"]
            pharmacy = pharmacies.get(pharmacy_id, {})

            result = {
                "pharmacy_id": pharmacy_id,
                "pharmacy_name": pharmacy.get("name"),
                "address": pharmacy.get("address"),
                "phone": pharmacy.get("phone"),
                "whatsapp_link": f"https://wa.me/{pharmacy.get('whatsapp')}",
                "maps_link": pharmacy.get("maps_link"),
                "distance_km": pharmacy.get("distance_km"),
                "local_item_name": item["local_item_name"],
                "standard_item_name": item["standard_item_name"],
                "quantity": item["quantity"],
                "status": item["status"],
                "last_updated": item["last_updated"]
            }

            results.append(result)

    results.sort(key=lambda x: x["distance_km"])

    return {
        "query": item_name,
        "results_count": len(results),
        "results": results
    }