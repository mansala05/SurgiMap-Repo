from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routers.search import compute_status

router = APIRouter(prefix="/stock", tags=["Stock"])


@router.post("/upsert")
def upsert_stock(data: schemas.StockUpsert, db: Session = Depends(get_db)):
    if db.get(models.Pharmacy, data.pharmacy_id) is None:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    if db.get(models.SurgicalKit, data.kit_id) is None:
        raise HTTPException(status_code=404, detail="Surgical kit not found")

    row = (
        db.query(models.Stock)
        .filter(
            models.Stock.pharmacy_id == data.pharmacy_id,
            models.Stock.kit_id == data.kit_id,
        )
        .first()
    )

    if row is None:
        row = models.Stock(
            pharmacy_id=data.pharmacy_id,
            kit_id=data.kit_id,
            quantity=data.quantity,
            status=compute_status(data.quantity),
        )
        db.add(row)
    else:
        row.quantity = data.quantity
        row.status = compute_status(data.quantity)
        row.last_updated = datetime.utcnow()

    db.commit()
    return {"message": "Stock updated"}
