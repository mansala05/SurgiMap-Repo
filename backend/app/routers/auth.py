"""Compatibility imports for the presentation routes."""
from app.presentation.routers.auth import (
    router,
    require_pharmacy_session,
    pharmacy_login,
    pharmacy_me,
    pharmacy_inventory,
)

from app.business.auth import (
    PHARMACY_EMAIL, PHARMACY_PASSWORD, PHARMACY_NAME, PHARMACY_ID,
    AUTH_SECRET, TOKEN_TTL_SECONDS, _encode, _decode, _create_token, _session_response,
)
