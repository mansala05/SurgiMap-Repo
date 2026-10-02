"""HTTP authentication and pharmacy portal endpoints."""
from typing import Annotated
from fastapi import APIRouter, Depends, Header
from app.business import auth as service, contracts as schemas
from app.data.repositories import InventoryRepository
from app.presentation.dependencies import get_repository

router = APIRouter(prefix="/auth", tags=["Authentication"])


def require_pharmacy_session(
    authorization: Annotated[str | None, Header()] = None,
) -> dict[str, object]:
    return service.require_pharmacy_session(authorization)


@router.post("/pharmacy/login", response_model=schemas.PharmacySessionResponse)
def pharmacy_login(credentials: schemas.PharmacyLoginRequest):
    return service.pharmacy_login(credentials)


@router.get("/pharmacy/me", response_model=schemas.PharmacyProfileResponse)
def pharmacy_me(session: dict[str, object] = Depends(require_pharmacy_session)):
    return service.pharmacy_me(session)


@router.get("/pharmacy/inventory", response_model=list[schemas.PharmacyInventoryItem])
def pharmacy_inventory(
    session: dict[str, object] = Depends(require_pharmacy_session),
    repository: InventoryRepository = Depends(get_repository),
):
    """Return the signed-in pharmacy's inventory from the central sync store."""
    return service.pharmacy_inventory(repository, session)
