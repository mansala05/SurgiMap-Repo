MASTER_CATALOG = {
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

    "appendix surgery kit": "Appendectomy Surgical Kit",
    "appendectomy kit": "Appendectomy Surgical Kit",
    "appendix kit": "Appendectomy Surgical Kit",
    "appendix removal kit": "Appendectomy Surgical Kit",
    "app surgery kit": "Appendectomy Surgical Kit",
    "appendicitis kit": "Appendectomy Surgical Kit",


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

    "suture pack": "Suture Pack",
    "sutures": "Suture Pack",
    "suture kit": "Suture Pack",
    "stitching kit": "Suture Pack",
    "stitch pack": "Suture Pack",
    "suture set": "Suture Pack",
    "wound closure kit": "Suture Pack",
    "absorbable sutures": "Suture Pack",
    "non absorbable sutures": "Suture Pack",

     "dressing kit": "Dressing Kit",
    "wound dressing kit": "Dressing Kit",
    "dressing pack": "Dressing Kit",
    "wound care kit": "Dressing Kit",
    "wound kit": "Dressing Kit",
    "bandage kit": "Dressing Kit",
    "wound dressing pack": "Dressing Kit",
    "sterile dressing kit": "Dressing Kit",
    
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


def normalize_item_name(local_item_name):
    key = local_item_name.strip().lower()

    if key in MASTER_CATALOG:
        return MASTER_CATALOG[key]

    return local_item_name