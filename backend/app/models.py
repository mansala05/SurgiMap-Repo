"""SQLAlchemy models used by the SurgiMap API."""

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import relationship

from app.database import Base


class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    address = Column(String, nullable=False)
    phone = Column(String)
    whatsapp = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    stock_items = relationship(
        "Stock",
        back_populates="pharmacy",
        cascade="all, delete-orphan",
    )


class SurgicalKit(Base):
    __tablename__ = "surgical_kits"

    id = Column(Integer, primary_key=True, index=True)
    standard_name = Column(String, nullable=False, unique=True, index=True)
    description = Column(String)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    stock_items = relationship(
        "Stock",
        back_populates="kit",
        cascade="all, delete-orphan",
    )


class Stock(Base):
    __tablename__ = "stock"
    __table_args__ = (
        UniqueConstraint("pharmacy_id", "kit_id", name="uq_stock_pharmacy_kit"),
    )

    id = Column(Integer, primary_key=True, index=True)
    pharmacy_id = Column(
        Integer,
        ForeignKey("pharmacies.id", ondelete="CASCADE"),
        nullable=False,
    )
    kit_id = Column(
        Integer,
        ForeignKey("surgical_kits.id", ondelete="CASCADE"),
        nullable=False,
    )
    quantity = Column(Integer, default=0, nullable=False)
    status = Column(String, nullable=False, default="Not Available")
    last_updated = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    pharmacy = relationship("Pharmacy", back_populates="stock_items")
    kit = relationship("SurgicalKit", back_populates="stock_items")


class SearchLog(Base):
    __tablename__ = "search_logs"

    id = Column(Integer, primary_key=True, index=True)
    query_text = Column(String, nullable=False)
    result_count = Column(Integer, default=0, nullable=False)
    searched_at = Column(DateTime, server_default=func.now(), nullable=False)
