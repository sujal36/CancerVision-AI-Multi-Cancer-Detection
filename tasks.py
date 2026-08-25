from celery_worker import celery
import mycode
from recommendation_engine import generate_recommendation
import os
import time

# 🔥 GradCAM
from gradcam import generate_gradcam


# 🔥🔥🔥 ADD THIS FUNCTION (IMPORTANT FIX)
def get_model_for_gradcam(result):
    model_used = result.get("model_used", "")

    if "lung" in model_used and mycode._lung_model:
        return mycode._lung_model
    elif "brain" in model_used and mycode._brain_model:
        return mycode._brain_model
    elif "skin" in model_used and mycode._skin_model:
        return mycode._skin_model
    elif "breast" in model_used and mycode._breast_main:
        return mycode._breast_main

    return None


@celery.task(bind=True)
def run_analysis(self, input_data, selected_organs,
                 patient_name, patient_email,
                 patient_age, patient_gender,
                 scan_type,
                 source,
                 ground_truth,
                 blood_pressure,
                 blood_sugar,
                 haemoglobin):

    print("🔥 TASK STARTED")
    start_time = time.time()

    self.update_state(state='PROGRESS', meta={
        'progress': 10,
        'status': 'Loading image...'
    })

    print("🔥 BEFORE MODEL")

    result = mycode.processImage(input_data, selected_organs)

    print("🔥 AFTER MODEL")

    self.update_state(state='PROGRESS', meta={
        'progress': 70,
        'status': 'Generating insights...'
    })

    # 🔥 Recommendation
    result["recommendation"] = generate_recommendation(result)

    # 🔥 filename fix
    if isinstance(input_data, str):
        file_path = input_data
        result["filename"] = os.path.basename(input_data)
    elif isinstance(input_data, list) and len(input_data) > 0:
        file_path = input_data[0]
        result["filename"] = os.path.basename(input_data[0])
    else:
        file_path = None
        result["filename"] = None


    # =========================
    # 🔥 FILE META DATA (ADD HERE)
    # =========================

    # 🔹 File Type (extension)
    if result.get("filename"):
        ext = os.path.splitext(result["filename"])[1].replace(".", "").upper()
        result["file_type"] = ext if ext else "N/A"
    else:
        result["file_type"] = "N/A"

    # 🔹 File Size
    try:
        if file_path and os.path.exists(file_path):
            size_bytes = os.path.getsize(file_path)

            if size_bytes < 1024:
                size = f"{size_bytes} B"
            elif size_bytes < 1024 * 1024:
                size = f"{round(size_bytes/1024, 2)} KB"
            else:
                size = f"{round(size_bytes/(1024*1024), 2)} MB"

            result["file_size"] = size
        else:
            result["file_size"] = "N/A"
    except:
        result["file_size"] = "N/A"

    # 🔥 Source Mapping
    mapping = {
    "training": "Training Set",
    "validation": "Validation Set",
    "test": "Test Set",
    "unknown": "Unknown"
}

    result["source"] = mapping.get((source or "").lower(), "User Upload")

    # 🔹 Ground Truth
    result["ground_truth"] = (ground_truth or "").capitalize() or "Unknown"
                         

    # 🔥 PATIENT DATA
    result["patient_name"] = patient_name
    result["patient_email"] = patient_email
    result["patient_age"] = patient_age
    result["patient_gender"] = patient_gender
    result["scan_type"] = scan_type

    result["blood_pressure"] = blood_pressure
    result["blood_sugar"] = blood_sugar
    result["haemoglobin"] = haemoglobin


    # =========================
    # 🔥 AUTO SCAN TYPE DETECTION
    # =========================

    organ = (result.get("organ") or "").lower()
    model_used = result.get("model_used")

    # 🔥 ORGAN FORMATTING
    organ_map = {
    "lung": "Lung",
    "brain": "Brain",
    "skin": "Skin",
    "breast": "Breast"
}

    result["organ"] = organ_map.get(organ, "Unknown")

    # =========================
    # 🔥 GATEKEEPER USAGE DETECTION
    # =========================

    if result.get("gatekeeper_confidence") is not None:
       result["gatekeeper_used"] = f"Gatekeeper v1.0 ({round(result['gatekeeper_confidence']*100,2)}%)"
    else:
       result["gatekeeper_used"] = "Manual Selection"

   

    auto_scan = "Not Available"



    if organ == "lung":
        if model_used == "lung_model_main":
           auto_scan = "CT Scan"
        elif model_used == "lung_model_fallback":
            auto_scan = "X-ray (Low Confidence)"
        else:
           auto_scan = "Not Available"

    elif organ == "brain":
        auto_scan = "MRI"

    elif organ == "breast":
        auto_scan = "Mammography"

    elif organ == "skin":
        auto_scan = "Dermoscopy"

    scan_input = result.get("scan_type")

    if not scan_input or scan_input in ["None", "null", ""]:
       result["scan_type"] = auto_scan


    if result.get("model_used") == "lung_model_fallback":
       result["input_size"] = "64 × 64"
    else:
       result["input_size"] = "224 × 224"   

    # 🔥 RISK CALCULATION
    if result.get("confidence") is not None:
        if result["confidence"] > 0.9:
            result["risk"] = "High Risk"
        elif result["confidence"] > 0.7:
            result["risk"] = "Moderate Risk"
        else:
            result["risk"] = "Low Risk"
    else:
        result["risk"] = "Unknown"

    # 🔥 GRADCAM HEATMAP
    try:
        if file_path:
            model = get_model_for_gradcam(result)

            if model:
                heatmap_name = f"gradcam_{int(time.time()*1000)}.jpg"
                heatmap_path = os.path.join("static", heatmap_name)

                result["heatmap"] = "/" + generate_gradcam(
                    file_path,
                    model,
                    save_path=heatmap_path
                )
            else:
                result["heatmap"] = None
        else:
            result["heatmap"] = None

    except Exception as e:
        print("🔥 Heatmap Error:", e)
        result["heatmap"] = None

    print("🔥 TASK END")

    # 🔥 PROCESSING TIME CALCULATION
    end_time = time.time()
    processing_time = round(end_time - start_time, 2)
    result["processing_time"] = f"{processing_time} sec"

    self.update_state(state='PROGRESS', meta={
        'progress': 100,
        'status': 'Completed'
    })

    return result