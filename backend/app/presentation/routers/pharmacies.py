from typing import List
from fastapi import APIRouter, Depends
from app.business import contracts as schemas, pharmacies as service
from app.data.repositories import InventoryRepository
from app.presentation.dependencies import get_repository

router = APIRouter(prefix="/pharmacies", tags=["Pharmacies"])


@router.get("", response_model=List[schemas.PharmacyResponse])
@router.get("/", response_model=List[schemas.PharmacyResponse], include_in_schema=False)
def list_pharmacies(repository: InventoryRepository = Depends(get_repository)):
    return service.list_pharmacies(repository)
