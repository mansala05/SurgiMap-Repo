from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    phone = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)

    # Relationships
    stocks = relationship("Stock", back_populates="pharmacy", cascade="all, delete-orphan")


class SurgicalKit(Base):
    __tablename__ = "surgical_kits"

    id = Column(Integer, primary_key=True, index=True)
    standard_name = Column(String, unique=True, index=True, nullable=False)

    # Relationships
    stocks = relationship("Stock", back_populates="kit", cascade="all, delete-orphan")


class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id", ondelete="CASCADE"), nullable=False)
    kit_id = Column(Integer, ForeignKey("surgical_kits.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    pharmacy = relationship("Pharmacy", back_populates="stocks")
    kit = relationship("SurgicalKit", back_populates="stocks")

    # Enforce uniqueness on the combination of pharmacy and kit
    __table_args__ = (
        UniqueConstraint("pharmacy_id", "kit_id", name="uq_pharmacy_kit"),
    )


class SearchLog(Base):
    __tablename__ = "search_logs"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
