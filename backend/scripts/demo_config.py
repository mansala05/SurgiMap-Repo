"""Shared configuration for the simulated pharmacy inventory."""

from __future__ import annotations

from datetime import datetime, timedelta

TOTAL_PHARMACIES = 10

# Independent pharmacy systems rarely update at the same instant. These offsets
# keep the demo believable while leaving most inventory inside the one-hour
# freshness window and one deliberately older result for the warning state.
PHARMACY_FRESHNESS_OFFSETS_MINUTES = (2, 6, 11, 17, 24, 32, 41, 49, 54, 72)


def demo_updated_at(
    pharmacy_id: int,
    *,
    item_index: int = 0,
    now: datetime | None = None,
) -> datetime:
    """Return a deterministic, pharmacy-specific demo inventory timestamp."""
    if pharmacy_id < 1 or pharmacy_id > TOTAL_PHARMACIES:
        raise ValueError(f"pharmacy_id must be between 1 and {TOTAL_PHARMACIES}")

    base_offset = PHARMACY_FRESHNESS_OFFSETS_MINUTES[pharmacy_id - 1]
    item_jitter = (item_index * 3) % 5
    return (now or datetime.now()) - timedelta(minutes=base_offset + item_jitter)
