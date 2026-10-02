from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.business import contracts as schemas, search as service
from app.data.repositories import InventoryRepository
from app.presentation.dependencies import get_repository

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/catalog", response_model=schemas.CatalogResponse)
def catalog():
    """Return the searchable master catalog used by the UI."""
    return service.catalog()


@router.get("", response_model=List[schemas.StockResult])
@router.get("/", response_model=List[schemas.StockResult], include_in_schema=False)
def search_by_kit_name(
    item_name: Optional[str] = Query(default=None),
    kit_name: Optional[str] = Query(default=None, include_in_schema=False),
    q: Optional[str] = Query(default=None, include_in_schema=False),
    user_latitude: Optional[float] = Query(default=None, ge=-90, le=90),
    user_longitude: Optional[float] = Query(default=None, ge=-180, le=180),
    repository: InventoryRepository = Depends(get_repository),
):
    """Search stock using the canonical `item_name` query parameter.

    `kit_name` and `q` remain accepted so older frontend/backend iterations do not
    break while the project is being consolidated.
    """
    return service.search_by_kit_name(repository, item_name, kit_name, q, user_latitude, user_longitude)


@router.get("/suggestions", response_model=List[str])
def search_suggestions(
    q: str = Query(min_length=1),
    repository: InventoryRepository = Depends(get_repository),
):
    """Suggest the closest searchable kit names that currently have stock."""
    return service.search_suggestions(repository, q)
