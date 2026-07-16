from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/sync", tags=["Sync"])


@router.post("/inventory")
def sync_inventory(
    items: List[schemas.InventorySyncItem],
    db: Session = Depends(get_db),
):
    created = 0
    updated = 0

    try:
        for item in items:
            pharmacy = db.get(models.Pharmacy, item.pharmacy_id)
            if pharmacy is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unknown pharmacy_id: {item.pharmacy_id}. Seed pharmacies first.",
                )

            kit = (
                db.query(models.SurgicalKit)
                .filter(models.SurgicalKit.standard_name == item.standard_item_name)
                .first()
            )
            if kit is None:
                kit = models.SurgicalKit(standard_name=item.standard_item_name)
                db.add(kit)
                db.flush()

            stock_row = (
                db.query(models.Stock)
                .filter(
                    models.Stock.pharmacy_id == item.pharmacy_id,
                    models.Stock.kit_id == kit.id,
                )
                .first()
            )

            if stock_row is None:
                db.add(
                    models.Stock(
                        pharmacy_id=item.pharmacy_id,
                        kit_id=kit.id,
                        quantity=item.quantity,
                        status=item.status,
                        last_updated=item.last_updated,
                    )
                )
                created += 1
            else:
                stock_row.quantity = item.quantity
                stock_row.status = item.status
                stock_row.last_updated = item.last_updated
                updated += 1

        db.commit()
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Inventory sync failed") from exc

    return {
        "message": "Sync complete",
        "created": created,
        "updated": updated,
        "total": len(items),
    }
