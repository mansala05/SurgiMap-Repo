"""Compatibility imports; implementation lives in app.data.database."""

from app.data.database import (
    BACKEND_DIR,
    DATABASE_URL,
    engine,
    SessionLocal,
    Base,
    get_db,
)
