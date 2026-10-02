"""Inventory normalization, validation, and transactional synchronization."""
import hmac
import os
from datetime import datetime
from app.business import contracts as schemas
from app.business.errors import ApplicationError
from app.business.stock import compute_status
from app.business.master_catalog import normalize_item_name

SYNC_API_KEY = os.getenv("SURGIMAP_SYNC_API_KEY", "surgimap-local-demo-key")


def require_sync_key(
    x_sync_key: str | None = None,
) -> None:
    if x_sync_key is None or not hmac.compare_digest(x_sync_key, SYNC_API_KEY):
        raise ApplicationError(
            status_code=401,
            detail="Invalid or missing sync API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )


def sync_inventory(repository, items: list[schemas.InventorySyncItem]):
    created = 0
    updated = 0
    sync_received_at = datetime.now()

    normalized_items: list[tuple[schemas.InventorySyncItem, str]] = []
    seen_items: set[tuple[int, str]] = set()
    for item in items:
        standard_name = normalize_item_name(item.local_item_name)
        item_key = (item.pharmacy_id, standard_name)
        if item_key in seen_items:
            raise ApplicationError(
                status_code=400,
                detail=(
                    "Duplicate inventory item in sync batch: "
                    f"pharmacy_id={item.pharmacy_id}, kit={standard_name}"
                ),
            )
        seen_items.add(item_key)
        normalized_items.append((item, standard_name))

    try:
        for item, standard_name in normalized_items:
            if not repository.pharmacy_exists(item.pharmacy_id):
                raise ApplicationError(
                    status_code=400,
                    detail=f"Unknown pharmacy_id: {item.pharmacy_id}. Seed pharmacies first.",
                )
            kit = repository.get_or_create_kit(standard_name)
            is_created = repository.upsert_stock(
                item.pharmacy_id, kit.id, item.quantity,
                compute_status(item.quantity), sync_received_at,
            )
            if is_created:
                created += 1
            else:
                updated += 1

        repository.commit()
    except ApplicationError:
        repository.rollback()
        raise
    except Exception as exc:
        repository.rollback()
        raise ApplicationError(status_code=500, detail="Inventory sync failed") from exc

    return {
        "message": "Sync complete",
        "created": created,
        "updated": updated,
        "total": len(items),
        "synced_at": sync_received_at.isoformat(),
    }
