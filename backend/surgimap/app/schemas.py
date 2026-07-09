# schemas.py
# Pydantic schemas define the SHAPE of data going in and out of your API.
# Think of them as contracts:
#   - Response schemas = what your API sends back to the frontend
#   - (Later) Request schemas = what the frontend/sync agent sends to your API

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# --- Pharmacy ---

class PharmacyBase(BaseModel):
    name:      str
    address:   str
    phone:     Optional[str] = None
    whatsapp:  Optional[str] = None
    latitude:  Optional[float] = None
    longitude: Optional[float] = None

class PharmacyResponse(PharmacyBase):
    id:         int
    created_at: datetime

    class Config:
        from_attributes = True   # allows converting a SQLAlchemy row → this schema


# --- Surgical Kit ---

class SurgicalKitBase(BaseModel):
    standard_name: str
    description:   Optional[str] = None

class SurgicalKitResponse(SurgicalKitBase):
    id:         int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Stock (what search results return) ---

class StockResult(BaseModel):
    pharmacy_id:   int
    pharmacy_name: str
    address:       str
    phone:         Optional[str] = None
    whatsapp:      Optional[str] = None
    latitude:      Optional[float] = None
    longitude:     Optional[float] = None
    kit_name:      str
    quantity:      int
    status:        str            # "Available" / "Low Stock" / "Not Available"
    last_updated:  datetime

    class Config:
        from_attributes = True


# --- Search Log ---

class SearchLogResponse(BaseModel):
    id:           int
    query_text:   str
    result_count: int
    searched_at:  datetime

    class Config:
        from_attributes = True
