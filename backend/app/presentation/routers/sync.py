from typing import Annotated
from fastapi import APIRouter, Body, Depends, Header
from app.business import contracts as schemas, sync as service
from app.data.repositories import InventoryRepository
from app.presentation.dependencies import get_repository

router = APIRouter(prefix="/sync", tags=["Sync"])


def require_sync_key(
    x_sync_key: Annotated[str | None, Header(alias="X-Sync-Key")] = None,
) -> None:
    service.require_sync_key(x_sync_key)


@router.post("/inventory")
def sync_inventory(
    items: Annotated[list[schemas.InventorySyncItem], Body(min_length=1, max_length=1000)],
    _: None = Depends(require_sync_key),
    repository: InventoryRepository = Depends(get_repository),
):
    return service.sync_inventory(repository, items)
