from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.services.master_catalog import normalize_item_name

router = APIRouter(prefix="/search", tags=["Search"])


def compute_status(quantity: int) -> str:
    if quantity <= 0:
        return "Not Available"
    if quantity <= 3:
        return "Low Stock"
    return "Available"


@router.get("", response_model=List[schemas.StockResult])
@router.get("/", response_model=List[schemas.StockResult], include_in_schema=False)
def search_by_kit_name(
    item_name: Optional[str] = Query(default=None),
    kit_name: Optional[str] = Query(default=None, include_in_schema=False),
    q: Optional[str] = Query(default=None, include_in_schema=False),
    db: Session = Depends(get_db),
):
    """Search stock using the canonical `item_name` query parameter.

    `kit_name` and `q` remain accepted so older frontend/backend iterations do not
    break while the project is being consolidated.
    """
    raw_query = (item_name or kit_name or q or "").strip()
    if not raw_query:
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    normalized_query = normalize_item_name(raw_query)
    rows = (
        db.query(models.Stock)
        .join(models.Pharmacy)
        .join(models.SurgicalKit)
        .filter(models.SurgicalKit.standard_name.ilike(f"%{normalized_query}%"))
        .filter(models.Stock.quantity > 0)
        .order_by(models.Stock.quantity.desc(), models.Pharmacy.name.asc())
        .all()
    )

    db.add(models.SearchLog(query_text=raw_query, result_count=len(rows)))
    db.commit()

    return [
        schemas.StockResult(
            pharmacy_id=row.pharmacy.id,
            pharmacy_name=row.pharmacy.name,
            address=row.pharmacy.address,
            phone=row.pharmacy.phone,
            whatsapp=row.pharmacy.whatsapp,
            latitude=row.pharmacy.latitude,
            longitude=row.pharmacy.longitude,
            kit_name=row.kit.standard_name,
            quantity=row.quantity,
            status=compute_status(row.quantity),
            last_updated=row.last_updated,
        )
        for row in rows
    ]
