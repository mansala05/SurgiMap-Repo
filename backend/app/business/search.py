"""Catalog search, ranking, and result construction."""
from app.business import contracts as schemas
from app.business.errors import ApplicationError
from app.business.stock import compute_status, distance_km
from app.business.master_catalog import (
    PRIMARY_KITS, STANDARD_NAMES, find_matching_standard_names,
    normalize_search_text, suggest_standard_names,
)


def catalog():
    return {"primary_kits": list(PRIMARY_KITS), "items": list(STANDARD_NAMES), "total": len(STANDARD_NAMES)}


def search_by_kit_name(repository, item_name=None, kit_name=None, q=None, user_latitude=None, user_longitude=None):
    raw_query = (item_name or kit_name or q or "").strip()
    if not raw_query:
        raise ApplicationError(status_code=400, detail="Search query cannot be empty")
    normalized_search_query = normalize_search_text(raw_query)
    if len(normalized_search_query) < 2:
        raise ApplicationError(
            status_code=400,
            detail="Search query must contain at least two letters or numbers",
        )
    if (user_latitude is None) != (user_longitude is None):
        raise ApplicationError(
            status_code=400,
            detail="user_latitude and user_longitude must be provided together",
        )

    matching_names = find_matching_standard_names(raw_query)
    rows = repository.search_stock(matching_names, normalized_search_query)

    results: list[schemas.StockResult] = []
    for row in rows:
        result_distance = None
        if (
            user_latitude is not None
            and user_longitude is not None
            and row.pharmacy.latitude is not None
            and row.pharmacy.longitude is not None
        ):
            result_distance = round(
                distance_km(
                    user_latitude,
                    user_longitude,
                    row.pharmacy.latitude,
                    row.pharmacy.longitude,
                ),
                1,
            )

        results.append(
            schemas.StockResult(
                pharmacy_id=row.pharmacy.id,
                pharmacy_name=row.pharmacy.name,
                address=row.pharmacy.address,
                phone=row.pharmacy.phone,
                whatsapp=row.pharmacy.whatsapp,
                latitude=row.pharmacy.latitude,
                longitude=row.pharmacy.longitude,
                distance_km=result_distance,
                kit_name=row.kit.standard_name,
                quantity=row.quantity,
                status=compute_status(row.quantity),
                last_updated=row.last_updated,
            )
        )

    match_rank = {name: index for index, name in enumerate(matching_names)}
    if user_latitude is not None and user_longitude is not None:
        results.sort(
            key=lambda result: (
                match_rank.get(result.kit_name, len(match_rank)),
                result.distance_km is None,
                result.distance_km or 0,
                -result.last_updated.timestamp(),
                result.pharmacy_name,
            )
        )
    else:
        results.sort(
            key=lambda result: (
                match_rank.get(result.kit_name, len(match_rank)),
                -result.quantity,
                -result.last_updated.timestamp(),
                result.pharmacy_name,
            )
        )

    repository.log_search(raw_query, len(results))

    return results


def search_suggestions(repository, q):
    return suggest_standard_names(q, repository.available_names())
