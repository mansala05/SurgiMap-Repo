"""Compatibility imports for the presentation routes."""
from app.business.stock import compute_status, distance_km
from app.presentation.routers.search import (
    router,
    catalog,
    search_by_kit_name,
    search_suggestions,
)
