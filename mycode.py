import os
import warnings
import numpy as np
from tensorflow.keras.models import load_model  # type: ignore
from PIL import Image

# =======================
# 🔥 MODEL VERSIONING
# =======================
MODEL_VERSIONS = {
    "lung_model_main": "Lung v1.0 (Primary)",
    "lung_model_fallback": "Lung v1.0 (Fallback)",
    "brain_model": "Brain v1.0",
    "skin_model": "Skin v1.0",
    "breast_model": "Breast v1.0",
    "gatekeeper": "Gatekeeper v1.0"
}

# =======================
# 🔥 GLOBAL CONFIDENCE
# =======================
CONF_THRESHOLD = 0.7

# =======================
# MODEL PATHS
# =======================
BASE_MODEL_DIR = "models"

GATEKEEPER_PATH = os.path.join(BASE_MODEL_DIR, "Gatekeeper", "gatekeeper_model.keras")

LUNG_MODEL_PATH = os.path.join(BASE_MODEL_DIR, "Lung", "lung_model.keras")
XRAY_FALLBACK_PATH = os.path.join(BASE_MODEL_DIR, "Lung", "xray_fallback.h5")

BRAIN_MODEL_PATH = os.path.join(BASE_MODEL_DIR, "Brain", "brain_model.h5")
SKIN_MODEL_PATH = os.path.join(BASE_MODEL_DIR, "Skin", "skin_model.h5")

BREAST_MAIN_PATH = os.path.join(BASE_MODEL_DIR, "Breast", "breast_main.keras")
BREAST_FALLBACK_PATH = os.path.join(BASE_MODEL_DIR, "Breast", "breast_fallback.keras")

# =======================
# SAFE MODEL LOADER
# =======================
def _try_load(path):
    if not os.path.exists(path):
        warnings.warn(f"⚠️ Model not found: {path}")
        return None
    try:
        model = load_model(path)
        print(f"✅ Loaded: {path}")
        return model
    except Exception as e:
        warnings.warn(f"⚠️ Failed to load {path}: {e}")
        return None

# =======================
# LOAD MODELS
# =======================
_gatekeeper = _try_load(GATEKEEPER_PATH)

_lung_model = _try_load(LUNG_MODEL_PATH)
_xray_fallback = _try_load(XRAY_FALLBACK_PATH)

_brain_model = _try_load(BRAIN_MODEL_PATH)
_skin_model = _try_load(SKIN_MODEL_PATH)

_breast_main = _try_load(BREAST_MAIN_PATH)
_breast_fallback = _try_load(BREAST_FALLBACK_PATH)

# =======================
# LABEL MAPS
# =======================
GATEKEEPER_LABELS = ["brain", "breast", "lung", "skin"]

LUNG_LABELS = ["adeno", "large", "normal", "squamous"]
BRAIN_LABELS = ["glioma", "meningioma", "normal", "pituitary"]
SKIN_LABELS = ["basal", "melanoma", "normal"]

# =======================
# PREPROCESSING
# =======================
def _prepare_image(path, target=(224, 224)):
    try:
        img = Image.open(path).convert("RGB").resize(target)
    except Exception:
        raise ValueError("Invalid or corrupted image file")

    arr = np.asarray(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

def _prepare_xray(path, target=(64, 64)):
    img = Image.open(path).convert("RGB").resize(target)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

# =======================
# GATEKEEPER
# =======================
def _predict_gatekeeper(img_path):
    if _gatekeeper is None:
        raise RuntimeError("❌ Gatekeeper model missing")

    x = _prepare_image(img_path)
    pred = _gatekeeper.predict(x)

    idx = int(np.argmax(pred))
    confidence = float(np.max(pred))

    return GATEKEEPER_LABELS[idx], confidence

# =======================
# 🔥 SINGLE PREDICTION HELPER
# =======================
def single_prediction(filepath, selected_organs=None):

    print("🔥 ENTERED single_prediction")

    if not selected_organs or len(selected_organs) != 1:
        print("⚡ Gatekeeper running")
        organ, gate_conf = _predict_gatekeeper(filepath)
    else:
        print("⚡ Manual organ:", selected_organs)
        organ = selected_organs[0]
        gate_conf = None

    label = "Error"
    subtype = None
    confidence = 0.0
    model_used = ""

    labels = []
    probabilities = []

    if organ == "lung" and _lung_model:
        print("🫁 LUNG MODEL RUNNING")

        x = _prepare_image(filepath)
        pred = _lung_model.predict(x)
        probs = pred.flatten()

        idx = int(np.argmax(probs))
        confidence = float(probs[idx])
        subtype = LUNG_LABELS[idx]

        # 🔥 ADDED
        labels = LUNG_LABELS
        probabilities = (probs * 100).tolist()

        if confidence >= CONF_THRESHOLD:
            label = "No Cancer" if "normal" in subtype else "Cancer Suspect"
            model_used = "lung_model_main"

        else:
            if _xray_fallback:
                x = _prepare_xray(filepath)
                pred = _xray_fallback.predict(x)
                val = float(pred.flatten()[0])

                label = "Cancer Suspect" if val >= 0.5 else "No Cancer"
                confidence = val
                subtype = None
                model_used = "lung_model_fallback"

                labels = ["Normal", "Cancer"]
                probabilities = [(1 - val) * 100, val * 100]

            else:
                label = "No Cancer" if "normal" in subtype else "Cancer Suspect"
                model_used = "lung_model_main"

                # 🔥 ADD THIS (fallback ke fallback 😏)
                labels = LUNG_LABELS
                probabilities = (probs * 100).tolist()

    elif organ == "brain" and _brain_model:
        print("🧠 BRAIN MODEL RUNNING")

        x = _prepare_image(filepath)
        pred = _brain_model.predict(x)
        probs = pred.flatten()

        idx = int(np.argmax(probs))
        confidence = float(probs[idx])
        subtype = BRAIN_LABELS[idx]

        # 🔥 ADDED
        labels = BRAIN_LABELS
        probabilities = (probs * 100).tolist()

        if confidence >= CONF_THRESHOLD:
            label = "No Cancer" if "normal" in subtype else "Cancer Suspect"
        else:
            label = "Uncertain - Further Analysis Required"    

        model_used = "brain_model"

    elif organ == "skin" and _skin_model:
        print("🧴 SKIN MODEL RUNNING")

        x = _prepare_image(filepath)
        pred = _skin_model.predict(x)
        probs = pred.flatten()

        idx = int(np.argmax(probs))
        confidence = float(probs[idx])
        subtype = SKIN_LABELS[idx]

        # 🔥 ADDED
        labels = SKIN_LABELS
        probabilities = (probs * 100).tolist()

        if confidence >= CONF_THRESHOLD:
            label = "No Cancer" if "normal" in subtype else "Cancer Suspect"

        model_used = "skin_model"

    elif organ == "breast":
        print("🎗️ BREAST MODEL RUNNING")

        model = _breast_main if _breast_main else _breast_fallback

        if model is None:
            raise RuntimeError("❌ Breast model missing")

        x = _prepare_image(filepath)
        pred = model.predict(x)

        val = float(pred.flatten()[0])
        confidence = val

        # 🔥 ADDED
        labels = ["Normal", "Cancer"]
        probabilities = [(1 - val) * 100, val * 100]

        if confidence >= CONF_THRESHOLD:
            label = "Cancer Suspect" if val >= 0.5 else "No Cancer"

        subtype = None
        model_used = "breast_model"

    else:
        raise RuntimeError("❌ No valid model found")

    return {
        "organ": organ,
        "gatekeeper_confidence": round(gate_conf, 4) if gate_conf is not None else None,
        "label": label,
        "subtype": subtype,
        "confidence": round(confidence, 4),
        "model_used": model_used,
        "model_version": MODEL_VERSIONS.get(model_used, "unknown"),

        # 🔥 NEW
        "labels": labels,
        "probabilities": probabilities
    }

# =======================
# 🔥 MAIN FUNCTION (BATCH SUPPORT)
# =======================
def processImage(input_data, selected_organs=None):

    if isinstance(input_data, list):
        results = []
        for path in input_data:
            results.append(single_prediction(path, selected_organs))
        return results[0]

    else:
        return single_prediction(input_data, selected_organs)