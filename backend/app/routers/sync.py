"""Compatibility imports for the presentation routes."""
from app.presentation.routers.sync import (
    router,
    require_sync_key,
    sync_inventory,
)

from app.business.sync import SYNC_API_KEY
