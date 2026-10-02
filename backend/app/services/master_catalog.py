"""Compatibility imports; implementation lives in app.business.master_catalog."""

from app.business.master_catalog import (
    MASTER_CATALOG,
    PRIMARY_KITS,
    CATALOG_CODES,
    normalize_search_text,
    NORMALIZED_ALIASES,
    NORMALIZED_CODES,
    STANDARD_NAMES,
    SEARCH_TERMS,
    normalize_item_name,
    _term_score,
    rank_catalog_matches,
    find_matching_standard_names,
    suggest_standard_names,
)
