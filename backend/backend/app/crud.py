from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from . import models, schemas

def get_pharmacy_by_name(db: Session, name: str):
    return db.query(models.Pharmacy).filter(models.Pharmacy.name == name).first()

def get_all_pharmacies(db: Session):
    return db.query(models.Pharmacy).all()

def create_pharmacy(db: Session, pharmacy: schemas.PharmacyCreate):
    db_pharmacy = models.Pharmacy(
        name=pharmacy.name,
        latitude=pharmacy.latitude,
        longitude=pharmacy.longitude,
        phone=pharmacy.phone,
        whatsapp=pharmacy.whatsapp
    )
    db.add(db_pharmacy)
    db.commit()
    db.refresh(db_pharmacy)
    return db_pharmacy

def get_kit_by_name(db: Session, standard_name: str):
    return db.query(models.SurgicalKit).filter(
        func.lower(models.SurgicalKit.standard_name) == func.lower(standard_name)
    ).first()

def create_kit(db: Session, kit: schemas.SurgicalKitCreate):
    db_kit = models.SurgicalKit(standard_name=kit.standard_name)
    db.add(db_kit)
    db.commit()
    db.refresh(db_kit)
    return db_kit

def sync_pharmacy_stocks(db: Session, payload: schemas.SyncPayload):
    # 1. Resolve pharmacy
    db_pharmacy = get_pharmacy_by_name(db, payload.pharmacy_name)
    if not db_pharmacy:
        # Create pharmacy
        db_pharmacy = models.Pharmacy(
            name=payload.pharmacy_name,
            latitude=payload.latitude,
            longitude=payload.longitude,
            phone=payload.phone,
            whatsapp=payload.whatsapp
        )
        db.add(db_pharmacy)
        db.commit()
        db.refresh(db_pharmacy)
    else:
        # Update details
        db_pharmacy.latitude = payload.latitude
        db_pharmacy.longitude = payload.longitude
        db_pharmacy.phone = payload.phone
        db_pharmacy.whatsapp = payload.whatsapp
        db.commit()

    # 2. Sync stocks
    for item in payload.stocks:
        # Get or create kit
        db_kit = get_kit_by_name(db, item.kit_name)
        if not db_kit:
            db_kit = models.SurgicalKit(standard_name=item.kit_name)
            db.add(db_kit)
            db.commit()
            db.refresh(db_kit)

        # Upsert stock
        db_stock = db.query(models.Stock).filter(
            models.Stock.pharmacy_id == db_pharmacy.id,
            models.Stock.kit_id == db_kit.id
        ).first()

        if db_stock:
            db_stock.quantity = item.quantity
            db_stock.last_updated = datetime.utcnow()
        else:
            db_stock = models.Stock(
                pharmacy_id=db_pharmacy.id,
                kit_id=db_kit.id,
                quantity=item.quantity,
                last_updated=datetime.utcnow()
            )
            db.add(db_stock)
    
    db.commit()
    return {"status": "success", "message": f"Synced {len(payload.stocks)} items for {payload.pharmacy_name}."}

def search_kits_by_name(db: Session, query: str):
    # Log the search
    log_search_query(db, query)

    # Perform search
    # Find all stock items where the kit name matches the query (case insensitive) and quantity > 0
    results = db.query(models.Stock).join(models.SurgicalKit).join(models.Pharmacy).filter(
        models.SurgicalKit.standard_name.ilike(f"%{query}%"),
        models.Stock.quantity > 0
    ).all()

    # Format into response schema
    output = []
    for stock in results:
        # Determine status: 1-3 = Low Stock, 4+ = Available
        status_str = "Low Stock" if stock.quantity <= 3 else "Available"
        
        output.append(schemas.SearchResultItem(
            pharmacy_name=stock.pharmacy.name,
            latitude=stock.pharmacy.latitude,
            longitude=stock.pharmacy.longitude,
            phone=stock.pharmacy.phone,
            whatsapp=stock.pharmacy.whatsapp,
            quantity=stock.quantity,
            status=status_str,
            last_updated=stock.last_updated
        ))
    return output

def log_search_query(db: Session, query: str):
    db_log = models.SearchLog(query=query, timestamp=datetime.utcnow())
    db.add(db_log)
    db.commit()
    return db_log
