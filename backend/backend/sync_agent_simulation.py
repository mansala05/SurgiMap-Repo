import httpx
import random
import time

# Configurations
API_URL = "http://127.0.0.1:8000/sync"
USERNAME = "sync_agent"
PASSWORD = "supersecretpassword"

# 10 Dummy pharmacies around Colombo area
dummy_pharmacies = [
    {"name": "Health First Pharmacy", "latitude": 6.9271, "longitude": 79.8612, "phone": "+94712345678", "whatsapp": "+94712345678"},
    {"name": "Lanka Chemists", "latitude": 6.9044, "longitude": 79.8543, "phone": "+94777654321", "whatsapp": "+94777654321"},
    {"name": "Union Chemists", "latitude": 6.9205, "longitude": 79.8587, "phone": "+94711122334", "whatsapp": "+94711122334"},
    {"name": "Colombo Medi-Care", "latitude": 6.9112, "longitude": 79.8722, "phone": "+94777999888", "whatsapp": "+94777999888"},
    {"name": "Wellness Pharmacy", "latitude": 6.8978, "longitude": 79.8812, "phone": "+94761234567", "whatsapp": "+94761234567"},
    {"name": "Cargills Food City Pharmacy - Fort", "latitude": 6.9344, "longitude": 79.8450, "phone": "+94112233445", "whatsapp": "+94770001111"},
    {"name": "SuperMed Pharmacy", "latitude": 6.9150, "longitude": 79.8630, "phone": "+94712223334", "whatsapp": "+94712223334"},
    {"name": "Royal Pharma", "latitude": 6.9010, "longitude": 79.8690, "phone": "+94773334445", "whatsapp": "+94773334445"},
    {"name": "MediHelp Kalubowila", "latitude": 6.8744, "longitude": 79.8850, "phone": "+94114455667", "whatsapp": "+94775556667"},
    {"name": "Kandy Drug House (Colombo Branch)", "latitude": 6.9295, "longitude": 79.8510, "phone": "+94723456789", "whatsapp": "+94723456789"}
]

# Standard Kits to distribute
standard_kits = [
    "Orthopedic Surgical Kit",
    "General Surgery Kit",
    "Cardiovascular Surgical Kit",
    "Ophthalmic Surgical Kit",
    "Dental Implant Kit",
    "C-Section Surgical Kit",
    "ENT (Ear, Nose, Throat) Kit",
    "Neurosurgery Kit",
    "Laparoscopic Kit",
    "Plastic Surgery Kit"
]

def run_sync_simulation():
    print("Starting Sync Agent Simulation...\n")
    
    with httpx.Client(auth=(USERNAME, PASSWORD)) as client:
        for idx, pharmacy in enumerate(dummy_pharmacies):
            print(f"[{idx+1}/{len(dummy_pharmacies)}] Simulating sync for: {pharmacy['name']}")
            
            # Randomly select a subset of kits and assign random quantities
            stocks = []
            selected_kits = random.sample(standard_kits, k=random.randint(4, 8)) # Each has 4 to 8 different kits in stock
            
            for kit in selected_kits:
                # Quantity: 0 (not available), 1-3 (low stock), 4-10 (available)
                quantity = random.choice([0, 1, 2, 3, 4, 5, 8, 10])
                stocks.append({
                    "kit_name": kit,
                    "quantity": quantity
                })
            
            payload = {
                "pharmacy_name": pharmacy["name"],
                "latitude": pharmacy["latitude"],
                "longitude": pharmacy["longitude"],
                "phone": pharmacy["phone"],
                "whatsapp": pharmacy["whatsapp"],
                "stocks": stocks
            }
            
            try:
                response = client.post(API_URL, json=payload, timeout=5.0)
                if response.status_code == 200:
                    print(f"  --> Success: {response.json()['message']}")
                else:
                    print(f"  --> Failed (HTTP {response.status_code}): {response.text}")
            except Exception as e:
                print(f"  --> Connection Error: {e}")
            
            time.sleep(0.5) # Short delay between calls
            
    print("\nSync Agent Simulation complete!")

if __name__ == "__main__":
    run_sync_simulation()
