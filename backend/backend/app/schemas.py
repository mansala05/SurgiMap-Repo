from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Pharmacy Schemas ---
class PharmacyBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    phone: Optional[str] = None
    whatsapp: Optional[str] = None

class PharmacyCreate(PharmacyBase):
    pass

class Pharmacy(PharmacyBase):
    id: int

    class Config:
        from_attributes = True


# --- Surgical Kit Schemas ---
class SurgicalKitBase(BaseModel):
    standard_name: str

class SurgicalKitCreate(SurgicalKitBase):
    pass

class SurgicalKit(SurgicalKitBase):
    id: int

    class Config:
        from_attributes = True


# --- Stock Schemas ---
class StockItem(BaseModel):
    kit_name: str
    quantity: int = Field(..., ge=0)

class SyncPayload(BaseModel):
    pharmacy_name: str
    latitude: float
    longitude: float
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    stocks: List[StockItem]


# --- Search Schemas ---
class SearchResultItem(BaseModel):
    pharmacy_name: str
    latitude: float
    longitude: float
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    quantity: int
    status: str  # "Available" or "Low Stock"
    last_updated: datetime

    class Config:
        from_attributes = True


# --- Search Log Schemas ---
class SearchLogCreate(BaseModel):
    query: str

class SearchLog(BaseModel):
    id: int
    query: str
    timestamp: datetime

    class Config:
        from_attributes = True
