MASTER_CATALOG = {
    "c section kit": "Caesarean Surgical Kit",
    "cesarean kit": "Caesarean Surgical Kit",
    "caesarean surgery kit": "Caesarean Surgical Kit",

    "appendix surgery kit": "Appendectomy Surgical Kit",
    "appendectomy kit": "Appendectomy Surgical Kit",

    "general surgery pack": "General Surgery Kit",
    "surgery pack": "General Surgery Kit",

    "suture pack": "Suture Pack",
    "sutures": "Suture Pack",

    "dressing kit": "Dressing Kit",
    "wound dressing kit": "Dressing Kit"
}


def normalize_item_name(local_item_name):
    key = local_item_name.strip().lower()

    if key in MASTER_CATALOG:
        return MASTER_CATALOG[key]

    return local_item_name