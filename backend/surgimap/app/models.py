# models.py
# Each class here maps directly to one table in your PostgreSQL database.
# SQLAlchemy reads these classes and knows how to create/query those tables.

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    address    = Column(String, nullable=False)
    phone      = Column(String)                  # for the call button on frontend
    whatsapp   = Column(String)                  # for the WhatsApp button
    latitude   = Column(Float)                   # for Google Maps link
    longitude  = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

    # relationship() lets you do pharmacy.stock_items to get all stock rows
    stock_items = relationship("Stock", back_populates="pharmacy")


class SurgicalKit(Base):
    __tablename__ = "surgical_kits"

    id            = Column(Integer, primary_key=True, index=True)
    standard_name = Column(String, nullable=False, unique=True)  # Piyumika's catalog
    description   = Column(String)
    created_at    = Column(DateTime, server_default=func.now())

    stock_items = relationship("Stock", back_populates="kit")


class Stock(Base):
    __tablename__ = "stock"

    id           = Column(Integer, primary_key=True, index=True)
    pharmacy_id  = Column(Integer, ForeignKey("pharmacies.id"), nullable=False)
    kit_id       = Column(Integer, ForeignKey("surgical_kits.id"), nullable=False)
    quantity     = Column(Integer, default=0)
    status       = Column(String)                # "Available" / "Low Stock" / "Not Available"
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # These let you do stock_row.pharmacy.name or stock_row.kit.standard_name
    pharmacy = relationship("Pharmacy", back_populates="stock_items")
    kit      = relationship("SurgicalKit", back_populates="stock_items")


class SearchLog(Base):
    __tablename__ = "search_logs"

    id           = Column(Integer, primary_key=True, index=True)
    query_text   = Column(String, nullable=False)
    result_count = Column(Integer, default=0)
    searched_at  = Column(DateTime, server_default=func.now())
