"""Database configuration for the SurgiMap API."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")

# SQLite keeps the hackathon demo runnable without extra infrastructure.
# Set DATABASE_URL in .env to use PostgreSQL instead.
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BACKEND_DIR / 'surgimap.db'}")

engine_kwargs: dict[str, object] = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Provide one database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def initialize_database() -> None:
    """Initialize the existing schema and seed pharmacy records at startup."""
    from app.data import models  # Register ORM tables before create_all.
    from app.data.seed import seed_demo_pharmacies
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_demo_pharmacies(db)
    finally:
        db.close()
