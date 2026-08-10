from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/pharmacies", tags=["Pharmacies"])


@router.get("", response_model=List[schemas.PharmacyResponse])
@router.get("/", response_model=List[schemas.PharmacyResponse], include_in_schema=False)
def list_pharmacies(db: Session = Depends(get_db)):
    return db.query(models.Pharmacy).order_by(models.Pharmacy.id).all()
