"""Pydantic request and response schemas."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PharmacyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    address: str
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime


class StockResult(BaseModel):
    pharmacy_id: int
    pharmacy_name: str
    address: str
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance_km: Optional[float] = None
    kit_name: str
    quantity: int
    status: str
    last_updated: datetime


class CatalogResponse(BaseModel):
    primary_kits: list[str]
    items: list[str]
    total: int


class PharmacyLoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=1, max_length=128)


class PharmacyProfileResponse(BaseModel):
    pharmacy_id: int
    pharmacy_name: str
    email: str


class PharmacySessionResponse(PharmacyProfileResponse):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class PharmacyInventoryItem(BaseModel):
    kit_name: str
    quantity: int
    status: str
    last_updated: datetime


class InventorySyncItem(BaseModel):
    pharmacy_id: int = Field(gt=0)
    local_item_name: str = Field(min_length=1)
    standard_item_name: str = Field(min_length=1)
    quantity: int = Field(ge=0)
    status: str
    last_updated: datetime
