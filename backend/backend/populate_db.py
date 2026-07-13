import os
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app import models

# Ensure tables are created
Base.metadata.create_all(bind=engine)

def populate_master_catalog():
    db: Session = SessionLocal()
    try:
        # Standard Surgical Kits Catalog
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
        
        print("Populating surgical kits master catalog...")
        for kit_name in standard_kits:
            # Check if exists
            exists = db.query(models.SurgicalKit).filter(models.SurgicalKit.standard_name == kit_name).first()
            if not exists:
                kit = models.SurgicalKit(standard_name=kit_name)
                db.add(kit)
                print(f"Added kit: {kit_name}")
            else:
                print(f"Kit already exists: {kit_name}")
        
        db.commit()
        print("Master catalog populated successfully!\n")
        
        # Optionally populate some dummy pharmacies to start with (these will also be updated via sync agent)
        dummy_pharmacies = [
            {
                "name": "Health First Pharmacy",
                "latitude": 6.9271,
                "longitude": 79.8612,
                "phone": "+94712345678",
                "whatsapp": "+94712345678"
            },
            {
                "name": "Lanka Chemists",
                "latitude": 6.9044,
                "longitude": 79.8543,
                "phone": "+94777654321",
                "whatsapp": "+94777654321"
            },
            {
                "name": "Union Chemists",
                "latitude": 6.9205,
                "longitude": 79.8587,
                "phone": "+94711122334",
                "whatsapp": "+94711122334"
            }
        ]
        
        print("Populating initial pharmacies...")
        for p in dummy_pharmacies:
            exists = db.query(models.Pharmacy).filter(models.Pharmacy.name == p["name"]).first()
            if not exists:
                pharmacy = models.Pharmacy(
                    name=p["name"],
                    latitude=p["latitude"],
                    longitude=p["longitude"],
                    phone=p["phone"],
                    whatsapp=p["whatsapp"]
                )
                db.add(pharmacy)
                print(f"Added pharmacy: {p['name']}")
            else:
                print(f"Pharmacy already exists: {p['name']}")
        
        db.commit()
        print("Pharmacies populated successfully!")
        
    except Exception as e:
        print(f"Error populating database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_master_catalog()
