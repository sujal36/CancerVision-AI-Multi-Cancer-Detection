import csv
import os
import uuid
from datetime import datetime

# =======================
# LOG DIRECTORY SETUP
# =======================
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

LOG_PATH = os.path.join(LOG_DIR, "inference_log.csv")

# =======================
# HEADERS
# =======================
HEADERS = [
    "request_id",
    "timestamp",
    "filename",
    "organ",
    "gatekeeper_confidence",
    "user_modality",
    "detected_modality",
    "model_used",
    "label",
    "subtype",
    "confidence",
    "patient_name",
    "patient_email"
]

# =======================
# MAIN LOGGER FUNCTION
# =======================
def log_inference(filename, result_dict, user_modality=None):

    # 🔥 unique request ID
    request_id = str(uuid.uuid4())

    # 🧠 safety
    if not isinstance(result_dict, dict):
        result_dict = {}

    row = {
        "request_id": request_id,
        "timestamp": datetime.utcnow().isoformat(),
        "filename": filename,

        "organ": result_dict.get("organ", ""),
        "gatekeeper_confidence": result_dict.get("gatekeeper_confidence", ""),

        "user_modality": user_modality or "",
        "detected_modality": result_dict.get("detected_modality", ""),
        "model_used": result_dict.get("model_used", ""),
        "label": result_dict.get("label", ""),
        "subtype": result_dict.get("subtype", ""),
        "confidence": result_dict.get("confidence", ""),

        # 🔥 ADDED
        "patient_name": result_dict.get("patient_name", ""),
        "patient_email": result_dict.get("patient_email", "")
    }

    write_header = not os.path.isfile(LOG_PATH)

    try:
        with open(LOG_PATH, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=HEADERS)

            if write_header:
                writer.writeheader()

            writer.writerow(row)

    except Exception as e:
        print(f"⚠️ Logging failed: {e}")

    return request_id