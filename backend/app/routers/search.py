from math import asin, cos, radians, sin, sqrt
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


def distance_km(
    origin_latitude: float,
    origin_longitude: float,
    destination_latitude: float,
    destination_longitude: float,
) -> float:
    """Calculate a straight-line distance using the haversine formula."""
    latitude_delta = radians(destination_latitude - origin_latitude)
    longitude_delta = radians(destination_longitude - origin_longitude)
    origin_latitude_radians = radians(origin_latitude)
    destination_latitude_radians = radians(destination_latitude)
    haversine = (
        sin(latitude_delta / 2) ** 2
        + cos(origin_latitude_radians)
        * cos(destination_latitude_radians)
        * sin(longitude_delta / 2) ** 2
    )
    return 6371.0 * 2 * asin(sqrt(haversine))


@router.get("", response_model=List[schemas.StockResult])
@router.get("/", response_model=List[schemas.StockResult], include_in_schema=False)
def search_by_kit_name(
    item_name: Optional[str] = Query(default=None),
    kit_name: Optional[str] = Query(default=None, include_in_schema=False),
    q: Optional[str] = Query(default=None, include_in_schema=False),
    user_latitude: Optional[float] = Query(default=None, ge=-90, le=90),
    user_longitude: Optional[float] = Query(default=None, ge=-180, le=180),
    db: Session = Depends(get_db),
):
    """Search stock using the canonical `item_name` query parameter.

    `kit_name` and `q` remain accepted so older frontend/backend iterations do not
    break while the project is being consolidated.
    """
    raw_query = (item_name or kit_name or q or "").strip()
    if not raw_query:
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    if (user_latitude is None) != (user_longitude is None):
        raise HTTPException(
            status_code=400,
            detail="user_latitude and user_longitude must be provided together",
        )

    normalized_query = normalize_item_name(raw_query)
    rows = (
        db.query(models.Stock)
        .join(models.Pharmacy)
        .join(models.SurgicalKit)
        .filter(models.SurgicalKit.standard_name.ilike(f"%{normalized_query}%"))
        .filter(models.Stock.quantity > 0)
        .all()
    )

    results: list[schemas.StockResult] = []
    for row in rows:
        result_distance = None
        if (
            user_latitude is not None
            and user_longitude is not None
            and row.pharmacy.latitude is not None
            and row.pharmacy.longitude is not None
        ):
            result_distance = round(
                distance_km(
                    user_latitude,
                    user_longitude,
                    row.pharmacy.latitude,
                    row.pharmacy.longitude,
                ),
                1,
            )

        results.append(
            schemas.StockResult(
                pharmacy_id=row.pharmacy.id,
                pharmacy_name=row.pharmacy.name,
                address=row.pharmacy.address,
                phone=row.pharmacy.phone,
                whatsapp=row.pharmacy.whatsapp,
                latitude=row.pharmacy.latitude,
                longitude=row.pharmacy.longitude,
                distance_km=result_distance,
                kit_name=row.kit.standard_name,
                quantity=row.quantity,
                status=compute_status(row.quantity),
                last_updated=row.last_updated,
            )
        )

    if user_latitude is not None and user_longitude is not None:
        results.sort(
            key=lambda result: (
                result.distance_km is None,
                result.distance_km or 0,
                result.pharmacy_name,
            )
        )
    else:
        results.sort(key=lambda result: (-result.quantity, result.pharmacy_name))

    db.add(models.SearchLog(query_text=raw_query, result_count=len(results)))
    db.commit()

    return results
