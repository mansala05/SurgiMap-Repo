"""Small, dependency-free authentication flow for the demo pharmacy portal."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

PHARMACY_EMAIL = os.getenv("SURGIMAP_PHARMACY_EMAIL", "pharmacy@surgimap.lk").strip().lower()
PHARMACY_PASSWORD = os.getenv("SURGIMAP_PHARMACY_PASSWORD", "pharmacy123")
PHARMACY_NAME = os.getenv("SURGIMAP_PHARMACY_NAME", "City Med Pharmacy")
PHARMACY_ID = int(os.getenv("SURGIMAP_PHARMACY_ID", "1"))
AUTH_SECRET = os.getenv("SURGIMAP_AUTH_SECRET", "surgimap-local-demo-auth-secret")
TOKEN_TTL_SECONDS = 8 * 60 * 60


def _encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("ascii").rstrip("=")


def _decode(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def _create_token() -> str:
    payload = {
        "email": PHARMACY_EMAIL,
        "exp": int(time.time()) + TOKEN_TTL_SECONDS,
        "pharmacy_id": PHARMACY_ID,
        "pharmacy_name": PHARMACY_NAME,
        "role": "pharmacy",
    }
    encoded_payload = _encode(
        json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    )
    signature = hmac.new(
        AUTH_SECRET.encode("utf-8"),
        encoded_payload.encode("ascii"),
        hashlib.sha256,
    ).digest()
    return f"{encoded_payload}.{_encode(signature)}"


def require_pharmacy_session(
    authorization: Annotated[str | None, Header()] = None,
) -> dict[str, object]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Pharmacy sign-in required")

    token = authorization.removeprefix("Bearer ").strip()
    try:
        encoded_payload, supplied_signature = token.split(".", maxsplit=1)
        expected_signature = _encode(
            hmac.new(
                AUTH_SECRET.encode("utf-8"),
                encoded_payload.encode("ascii"),
                hashlib.sha256,
            ).digest()
        )
        if not hmac.compare_digest(supplied_signature, expected_signature):
            raise ValueError("invalid signature")
        payload = json.loads(_decode(encoded_payload))
        if payload.get("role") != "pharmacy" or int(payload.get("exp", 0)) <= int(time.time()):
            raise ValueError("expired or invalid role")
    except (ValueError, TypeError, KeyError, json.JSONDecodeError):
        raise HTTPException(status_code=401, detail="Invalid or expired pharmacy session") from None

    return payload


def _session_response(token: str) -> schemas.PharmacySessionResponse:
    return schemas.PharmacySessionResponse(
        access_token=token,
        expires_in=TOKEN_TTL_SECONDS,
        pharmacy_id=PHARMACY_ID,
        pharmacy_name=PHARMACY_NAME,
        email=PHARMACY_EMAIL,
    )


@router.post("/pharmacy/login", response_model=schemas.PharmacySessionResponse)
def pharmacy_login(credentials: schemas.PharmacyLoginRequest):
    email_matches = hmac.compare_digest(credentials.email.strip().lower(), PHARMACY_EMAIL)
    password_matches = hmac.compare_digest(credentials.password, PHARMACY_PASSWORD)
    if not email_matches or not password_matches:
        raise HTTPException(status_code=401, detail="Incorrect pharmacy email or password")
    return _session_response(_create_token())


@router.get("/pharmacy/me", response_model=schemas.PharmacyProfileResponse)
def pharmacy_me(session: dict[str, object] = Depends(require_pharmacy_session)):
    return schemas.PharmacyProfileResponse(
        pharmacy_id=int(session["pharmacy_id"]),
        pharmacy_name=str(session["pharmacy_name"]),
        email=str(session["email"]),
    )


@router.get(
    "/pharmacy/inventory",
    response_model=list[schemas.PharmacyInventoryItem],
)
def pharmacy_inventory(
    session: dict[str, object] = Depends(require_pharmacy_session),
    db: Session = Depends(get_db),
):
    """Return the signed-in pharmacy's inventory from the central sync store."""
    pharmacy_id = int(session["pharmacy_id"])
    rows = (
        db.query(models.Stock)
        .join(models.SurgicalKit)
        .filter(models.Stock.pharmacy_id == pharmacy_id)
        .order_by(models.SurgicalKit.standard_name)
        .all()
    )
    return [
        schemas.PharmacyInventoryItem(
            kit_name=row.kit.standard_name,
            quantity=row.quantity,
            status=row.status,
            last_updated=row.last_updated,
        )
        for row in rows
    ]
