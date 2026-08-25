# recommendation_engine.py

from recommendation_data import RECOMMENDATIONS


# =========================
# CONFIDENCE LEVEL
# =========================
def get_conf_level(conf):
    try:
        conf = float(conf)
    except:
        return "low"

    if conf > 0.9:
        return "high"
    elif conf > 0.7:
        return "medium"
    else:
        return "low"


# =========================
# MAIN FUNCTION
# =========================
def generate_recommendation(result):
    """
    result: dict from mycode.py
    """

    if not isinstance(result, dict):
        return ["Clinical consultation recommended."]

    organ = result.get("organ")
    subtype = result.get("subtype")
    label = result.get("label")
    confidence = result.get("confidence", 0.0)

    level = get_conf_level(confidence)

    try:
        rec = None

        # -------------------------
        # BREAST (SPECIAL CASE)
        # -------------------------
        if organ == "breast":
            key = "cancer" if label == "Cancer Suspect" else "normal"
            rec = RECOMMENDATIONS["breast"][key][level]

        # -------------------------
        # NORMAL CASE
        # -------------------------
        elif label == "No Cancer":
            rec = RECOMMENDATIONS[organ]["normal"][level]

        # -------------------------
        # SUBTYPE CASE
        # -------------------------
        elif subtype:
            rec = RECOMMENDATIONS[organ][subtype][level]

    except Exception:
        rec = None

    # -------------------------
    # FINAL RETURN (LIST ENSURE)
    # -------------------------
    if isinstance(rec, list):
        return rec
    elif rec:
        return [rec]

    # -------------------------
    # FALLBACK
    # -------------------------
    return ["Clinical consultation recommended."]