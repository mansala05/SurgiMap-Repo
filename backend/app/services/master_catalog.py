"""Manual surgical-kit catalog and user-search matching helpers."""

from __future__ import annotations

from collections.abc import Iterable
from difflib import SequenceMatcher
import re


MASTER_CATALOG = {
    # Caesarean Kit variations
    "c section kit": "Caesarean Surgical Kit",
    "c-section kit": "Caesarean Surgical Kit",
    "csection kit": "Caesarean Surgical Kit",
    "cesarean kit": "Caesarean Surgical Kit",
    "caesarean surgery kit": "Caesarean Surgical Kit",
    "caesarean kit": "Caesarean Surgical Kit",
    "caesarian kit": "Caesarean Surgical Kit",
    "cesarian kit": "Caesarean Surgical Kit",
    "c/s kit": "Caesarean Surgical Kit",
    "lscs kit": "Caesarean Surgical Kit",
    "lower segment caesarean kit": "Caesarean Surgical Kit",

    # Appendectomy Kit variations
    "appendix surgery kit": "Appendectomy Surgical Kit",
    "appendectomy kit": "Appendectomy Surgical Kit",
    "appendix kit": "Appendectomy Surgical Kit",
    "appendix removal kit": "Appendectomy Surgical Kit",
    "app surgery kit": "Appendectomy Surgical Kit",
    "appendicitis kit": "Appendectomy Surgical Kit",

    # General Surgery Kit variations
    "general surgery pack": "General Surgery Kit",
    "surgery pack": "General Surgery Kit",
    "general surgery kit": "General Surgery Kit",
    "gen surgery kit": "General Surgery Kit",
    "gen surg kit": "General Surgery Kit",
    "surgical kit": "General Surgery Kit",
    "basic surgery kit": "General Surgery Kit",
    "standard surgery kit": "General Surgery Kit",
    "operation kit": "General Surgery Kit",
    "op kit": "General Surgery Kit",

    # Suture Pack variations
    "suture pack": "Suture Pack",
    "sutures": "Suture Pack",
    "suture kit": "Suture Pack",
    "stitching kit": "Suture Pack",
    "stitch pack": "Suture Pack",
    "suture set": "Suture Pack",
    "wound closure kit": "Suture Pack",
    "absorbable sutures": "Suture Pack",
    "non absorbable sutures": "Suture Pack",

    # Dressing Kit variations
    "dressing kit": "Dressing Kit",
    "wound dressing kit": "Dressing Kit",
    "dressing pack": "Dressing Kit",
    "wound care kit": "Dressing Kit",
    "wound kit": "Dressing Kit",
    "bandage kit": "Dressing Kit",
    "wound dressing pack": "Dressing Kit",
    "sterile dressing kit": "Dressing Kit",

    # Future catalog items
    "laparoscopy kit": "Laparoscopy Kit",
    "laparoscopic surgery kit": "Laparoscopy Kit",
    "lap surgery kit": "Laparoscopy Kit",
    "laparoscopic kit": "Laparoscopy Kit",
    "keyhole surgery kit": "Laparoscopy Kit",
    "catheter kit": "Catheter Kit",
    "urinary catheter kit": "Catheter Kit",
    "foley catheter kit": "Catheter Kit",
    "catheterization kit": "Catheter Kit",
    "cath kit": "Catheter Kit",
    "iv kit": "IV Administration Kit",
    "iv set": "IV Administration Kit",
    "intravenous kit": "IV Administration Kit",
    "drip set": "IV Administration Kit",
    "iv administration kit": "IV Administration Kit",
    "iv cannula kit": "IV Administration Kit",
    "biopsy kit": "Biopsy Kit",
    "tissue biopsy kit": "Biopsy Kit",
    "biopsy set": "Biopsy Kit",
    "core biopsy kit": "Biopsy Kit",
}

CATALOG_CODES = {
    "csk": "Caesarean Surgical Kit",
    "lscs": "Caesarean Surgical Kit",
    "ask": "Appendectomy Surgical Kit",
    "gsk": "General Surgery Kit",
    "stp": "Suture Pack",
    "drk": "Dressing Kit",
    "lpk": "Laparoscopy Kit",
    "ctk": "Catheter Kit",
    "ivk": "IV Administration Kit",
    "bpk": "Biopsy Kit",
}


def normalize_search_text(value: str) -> str:
    """Normalize punctuation, case, and repeated whitespace for matching."""
    normalized = value.casefold().replace("&", " and ")
    normalized = re.sub(r"[^a-z0-9]+", " ", normalized)
    return " ".join(normalized.split())


NORMALIZED_ALIASES = {
    normalize_search_text(alias): standard_name
    for alias, standard_name in MASTER_CATALOG.items()
}
NORMALIZED_CODES = {
    normalize_search_text(code): standard_name
    for code, standard_name in CATALOG_CODES.items()
}
STANDARD_NAMES = tuple(sorted(set(MASTER_CATALOG.values()) | set(CATALOG_CODES.values())))

SEARCH_TERMS: dict[str, set[str]] = {name: {normalize_search_text(name)} for name in STANDARD_NAMES}
for alias, standard_name in NORMALIZED_ALIASES.items():
    SEARCH_TERMS[standard_name].add(alias)
for code, standard_name in NORMALIZED_CODES.items():
    SEARCH_TERMS[standard_name].add(code)


def normalize_item_name(local_item_name: str) -> str:
    """Map a local pharmacy label to its canonical name during inventory sync."""
    key = normalize_search_text(local_item_name)
    return NORMALIZED_ALIASES.get(key, NORMALIZED_CODES.get(key, local_item_name.strip()))


def _term_score(query: str, term: str, *, suggestion: bool = False) -> float:
    if query == term:
        return 100.0
    if len(query) >= 2 and term.startswith(query):
        return 88.0 - min(len(term) - len(query), 20) / 10
    if len(query) >= 3 and query in term:
        return 80.0 - min(len(term) - len(query), 20) / 10
    if len(term) >= 3 and term in query:
        return 74.0

    similarity = SequenceMatcher(None, query, term).ratio()
    threshold = 0.42 if suggestion else 0.68
    return similarity * 70 if similarity >= threshold else 0.0


def rank_catalog_matches(
    query: str,
    *,
    allowed_names: Iterable[str] | None = None,
    suggestions: bool = False,
) -> list[str]:
    """Return canonical names ranked by exact, partial, then fuzzy relevance."""
    normalized_query = normalize_search_text(query)
    if not normalized_query:
        return []

    allowed = set(allowed_names) if allowed_names is not None else set(STANDARD_NAMES)
    scored: list[tuple[float, str]] = []
    for standard_name, terms in SEARCH_TERMS.items():
        if standard_name not in allowed:
            continue
        score = max(
            _term_score(normalized_query, term, suggestion=suggestions)
            for term in terms
        )
        if score > 0:
            scored.append((score, standard_name))

    scored.sort(key=lambda item: (-item[0], item[1]))
    return [standard_name for _, standard_name in scored]


def find_matching_standard_names(query: str) -> list[str]:
    """Resolve a patient search to one canonical kit.

    Suggestions may intentionally contain several kits, but stock results must
    represent one requested kit. Returning every fuzzy match produced repeated
    pharmacy cards whenever the same pharmacy stocked several similar kits.
    """
    normalized_query = normalize_search_text(query)
    exact_name = NORMALIZED_ALIASES.get(
        normalized_query,
        NORMALIZED_CODES.get(normalized_query),
    )
    if exact_name is not None:
        return [exact_name]

    exact_standard_name = next(
        (
            standard_name
            for standard_name in STANDARD_NAMES
            if normalize_search_text(standard_name) == normalized_query
        ),
        None,
    )
    if exact_standard_name is not None:
        return [exact_standard_name]

    return rank_catalog_matches(query)[:1]


def suggest_standard_names(
    query: str,
    available_names: Iterable[str],
    limit: int = 3,
) -> list[str]:
    return rank_catalog_matches(
        query,
        allowed_names=available_names,
        suggestions=True,
    )[:limit]
