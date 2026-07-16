"""Seed stable pharmacy records required by the demo sync payload."""

from sqlalchemy.orm import Session

from app import models

DEMO_PHARMACIES = [
    {"id": 1, "name": "City Med Pharmacy", "address": "Colombo 07", "phone": "0771234567", "whatsapp": "94771234567"},
    {"id": 2, "name": "CarePlus Pharmacy", "address": "Nugegoda", "phone": "0772345678", "whatsapp": "94772345678"},
    {"id": 3, "name": "MediQuick Pharmacy", "address": "Borella", "phone": "0773456789", "whatsapp": "94773456789"},
    {"id": 4, "name": "HealthHub Pharmacy", "address": "Rajagiriya", "phone": "0774567890", "whatsapp": "94774567890"},
    {"id": 5, "name": "LifeCare Pharmacy", "address": "Dehiwala", "phone": "0775678901", "whatsapp": "94775678901"},
    {"id": 6, "name": "Surgical Care Pharmacy", "address": "Maharagama", "phone": "0776789012", "whatsapp": "94776789012"},
    {"id": 7, "name": "Green Cross Pharmacy", "address": "Kirulapone", "phone": "0777890123", "whatsapp": "94777890123"},
    {"id": 8, "name": "Royal Med Pharmacy", "address": "Kollupitiya", "phone": "0778901234", "whatsapp": "94778901234"},
    {"id": 9, "name": "Family Care Pharmacy", "address": "Battaramulla", "phone": "0779012345", "whatsapp": "94779012345"},
    {"id": 10, "name": "MedLine Pharmacy", "address": "Wellawatte", "phone": "0770123456", "whatsapp": "94770123456"},
]


def seed_demo_pharmacies(db: Session) -> None:
    """Create or update the ten pharmacies referenced by local demo databases."""
    for item in DEMO_PHARMACIES:
        pharmacy = db.get(models.Pharmacy, item["id"])
        if pharmacy is None:
            pharmacy = models.Pharmacy(**item)
            db.add(pharmacy)
        else:
            for field, value in item.items():
                if field != "id":
                    setattr(pharmacy, field, value)
    db.commit()
