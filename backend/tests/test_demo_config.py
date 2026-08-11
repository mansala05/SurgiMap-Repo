from datetime import datetime

import pytest

from scripts.demo_config import TOTAL_PHARMACIES, demo_updated_at


def test_demo_timestamps_are_distinct_and_include_one_older_pharmacy():
    now = datetime(2026, 8, 11, 12, 0, 0)
    timestamps = [
        demo_updated_at(pharmacy_id, item_index=3, now=now)
        for pharmacy_id in range(1, TOTAL_PHARMACIES + 1)
    ]

    assert len(set(timestamps)) == TOTAL_PHARMACIES
    assert max((now - timestamp).total_seconds() for timestamp in timestamps) > 3600
    assert sum((now - timestamp).total_seconds() > 3600 for timestamp in timestamps) == 1


def test_demo_timestamp_rejects_unknown_pharmacy():
    with pytest.raises(ValueError):
        demo_updated_at(0)
