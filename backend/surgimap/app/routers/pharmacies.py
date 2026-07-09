# routers/pharmacies.py
# Handles: GET /pharmacies  — list all pharmacies

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas

router = APIRouter(
    prefix="/pharmacies",   # all routes here start with /pharmacies
    tags=["Pharmacies"],    # groups them in the auto-docs at /docs
)


@router.get("/", response_model=List[schemas.PharmacyResponse])
def list_pharmacies(db: Session = Depends(get_db)):
    """Return all pharmacies in the database."""
    pharmacies = db.query(models.Pharmacy).all()
    return pharmacies
