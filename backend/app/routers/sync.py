from typing import Annotated

import hmac
import os

from fastapi import APIRouter, Body, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routers.search import compute_status
from app.services.master_catalog import normalize_item_name

router = APIRouter(prefix="/sync", tags=["Sync"])
SYNC_API_KEY = os.getenv("SURGIMAP_SYNC_API_KEY", "surgimap-local-demo-key")


def require_sync_key(
    x_sync_key: Annotated[str | None, Header(alias="X-Sync-Key")] = None,
) -> None:
    if x_sync_key is None or not hmac.compare_digest(x_sync_key, SYNC_API_KEY):
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing sync API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )


@router.post("/inventory")
def sync_inventory(
    items: Annotated[
        list[schemas.InventorySyncItem],
        Body(min_length=1, max_length=500),
    ],
    _: None = Depends(require_sync_key),
    db: Session = Depends(get_db),
):
    created = 0
    updated = 0

    normalized_items: list[tuple[schemas.InventorySyncItem, str]] = []
    seen_items: set[tuple[int, str]] = set()
    for item in items:
        standard_name = normalize_item_name(item.local_item_name)
        item_key = (item.pharmacy_id, standard_name)
        if item_key in seen_items:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Duplicate inventory item in sync batch: "
                    f"pharmacy_id={item.pharmacy_id}, kit={standard_name}"
                ),
            )
        seen_items.add(item_key)
        normalized_items.append((item, standard_name))

    try:
        for item, standard_name in normalized_items:
            pharmacy = db.get(models.Pharmacy, item.pharmacy_id)
            if pharmacy is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unknown pharmacy_id: {item.pharmacy_id}. Seed pharmacies first.",
                )

            kit = (
                db.query(models.SurgicalKit)
                .filter(models.SurgicalKit.standard_name == standard_name)
                .first()
            )
            if kit is None:
                kit = models.SurgicalKit(standard_name=standard_name)
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
                        status=compute_status(item.quantity),
                        last_updated=item.last_updated,
                    )
                )
                created += 1
            else:
                stock_row.quantity = item.quantity
                stock_row.status = compute_status(item.quantity)
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
