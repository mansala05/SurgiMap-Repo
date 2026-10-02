"""Wire request-scoped persistence into application use cases."""
from fastapi import Depends
from sqlalchemy.orm import Session
from app.data.database import get_db
from app.data.repositories import InventoryRepository


def get_repository(db: Session = Depends(get_db)) -> InventoryRepository:
    return InventoryRepository(db)
