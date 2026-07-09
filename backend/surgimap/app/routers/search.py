# routers/search.py
# Handles: GET /search?kit_name=Laparoscopic+Kit
# This is your most important endpoint — what the frontend search bar calls

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


def compute_status(quantity: int) -> str:
    """Convert a raw quantity number into a human-readable status label."""
    if quantity > 5:
        return "Available"
    elif quantity > 0:
        return "Low Stock"
    else:
        return "Not Available"


@router.get("/", response_model=List[schemas.StockResult])
def search_by_kit_name(
    kit_name: str = Query(..., description="Name of the surgical kit to search for"),
    db: Session = Depends(get_db),
):
    """
    Search for pharmacies that stock a given surgical kit.
    Returns availability status and contact info for each matching pharmacy.
    """

    # Query joins stock → pharmacies → surgical_kits
    # Then filters by kit name (case-insensitive partial match using ilike)
    results = (
        db.query(models.Stock)
        .join(models.Pharmacy)
        .join(models.SurgicalKit)
        .filter(models.SurgicalKit.standard_name.ilike(f"%{kit_name}%"))
        .all()
    )

    # Log this search so judges can see real usage data in the demo
    log = models.SearchLog(
        query_text=kit_name,
        result_count=len(results),
    )
    db.add(log)
    db.commit()

    # Build the response shape from the joined data
    response = []
    for row in results:
        response.append(schemas.StockResult(
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
        ))

    return response
