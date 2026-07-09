# routers/sync.py
# This endpoint receives stock data from Nimsara's sync agent
# and writes it into your PostgreSQL database

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app import models

router = APIRouter(
    prefix="/sync",
    tags=["Sync"],
)


# This matches exactly what Nimsara's sync_agent.py sends
class InventoryItem(BaseModel):
    pharmacy_id: int
    local_item_name: str
    standard_item_name: str
    quantity: int
    status: str
    last_updated: str


@router.post("/inventory")
def sync_inventory(items: List[InventoryItem], db: Session = Depends(get_db)):
    """
    Receives the full stock payload from the sync agent.
    For each item: if it already exists in the DB, update it.
    If it doesn't exist, create it.
    """
    updated = 0
    created = 0

    for item in items:
        # Find or create the surgical kit by standard name
        kit = db.query(models.SurgicalKit).filter_by(
            standard_name=item.standard_item_name
        ).first()

        if not kit:
            kit = models.SurgicalKit(standard_name=item.standard_item_name)
            db.add(kit)
            db.flush()  # get the kit.id before committing

        # Find existing stock row for this pharmacy + kit
        stock_row = db.query(models.Stock).filter_by(
            pharmacy_id=item.pharmacy_id,
            kit_id=kit.id
        ).first()

        if stock_row:
            # Update existing row
            stock_row.quantity     = item.quantity
            stock_row.status       = item.status
            stock_row.last_updated = datetime.fromisoformat(item.last_updated)
            updated += 1
        else:
            # Create new row
            stock_row = models.Stock(
                pharmacy_id  = item.pharmacy_id,
                kit_id       = kit.id,
                quantity     = item.quantity,
                status       = item.status,
                last_updated = datetime.fromisoformat(item.last_updated),
            )
            db.add(stock_row)
            created += 1

    db.commit()

    return {
        "message": "Sync complete",
        "created": created,
        "updated": updated,
        "total":   len(items),
    }