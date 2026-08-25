from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import time
import re

import mycode
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

from inference_logger import log_inference
from recommendation_engine import generate_recommendation
from report_generator import generate_pdf
from gradcam import generate_gradcam
from tasks import run_analysis
from celery.result import AsyncResult
from celery_worker import celery

# 🔥 NEW IMPORTS (SECURITY)
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect

# ✅ NEW IMPORT
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, SECRET_KEY

app = Flask(__name__, static_folder='static')




# ✅ UPDATED SECRET KEY
app.secret_key = SECRET_KEY

# 🔥 SECURITY CONFIG
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB limit

# 🔥 RATE LIMITER
limiter = Limiter(get_remote_address, app=app)

# 🔥 CSRF
csrf = CSRFProtect(app)

# 🔥 HASHED USER STORE
USERS = {
    "admin@example.com": generate_password_hash("1234")
}

# ------------------------------
# Upload folder setup
# ------------------------------
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ✅ ADD THIS LINE HERE
os.makedirs("reports", exist_ok=True)

# ------------------------------
# 🔥 FILE VALIDATION
# ------------------------------
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ------------------------------
# 🔥 EMAIL VALIDATION
# ------------------------------
def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email)

# ------------------------------
# Helper: Unique filename
# ------------------------------
def make_unique_filename(filename):
    base = secure_filename(filename)
    name, ext = os.path.splitext(base)
    ts = int(time.time() * 1000)
    return f"{name}_{ts}{ext}"

# ------------------------------
# 🔥 SIMPLE CACHE
# ------------------------------
cache = {}


# ------------------------------
# Helper: Safe GradCAM Model Picker
# ------------------------------
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

# ------------------------------
# 🔥 FILE SIZE ERROR HANDLER
# ------------------------------
@app.errorhandler(413)
def file_too_large(e):
    return jsonify({"error": "File too large (max 5MB allowed)"}), 413

# ------------------------------
# 🔥 API ROUTE
# ------------------------------
@app.route('/predict', methods=['POST'])
@limiter.limit("50 per minute")
def predict_api():
    try:
        first = request.form.get('firstName')
        last = request.form.get('lastName')
        

        if first and last:
            patient_name = f"{first} {last}"
        else:
            patient_name = session.get('patientName')

        patient_email = request.form.get('email') or session.get('email')    
        patient_age = request.form.get('age')
        patient_gender = request.form.get('gender')
        scan_type = request.form.get('scanType')
        source = request.form.get("source")
        ground_truth = request.form.get("ground_truth")
        blood_pressure = request.form.get("blood_pressure")
        blood_sugar = request.form.get("blood_sugar")
        haemoglobin = request.form.get("haemoglobin")

        # 🔥 EMAIL CHECK
        if patient_email and not is_valid_email(patient_email):
            return jsonify({"error": "Invalid email"}), 400

        ctype_values = request.form.get("ctype_values", "")

        if ctype_values:
            selected_organs = [x.strip() for x in ctype_values.split(",") if x.strip()]
        else:
            selected_organs = []

        files = request.files.getlist('files')

        filepaths = []
        for file in files:
            if file and file.filename:

                if not allowed_file(file.filename):
                    return jsonify({"error": "Invalid file type"}), 400

                filename = make_unique_filename(file.filename)
                path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(path)
                filepaths.append(path)

        if not filepaths:
            return jsonify({"error": "No files uploaded"}), 400

        input_data = filepaths if len(filepaths) > 1 else filepaths[0]

        # 🔥 START BACKGROUND TASK
        task = run_analysis.delay(
    input_data,
    selected_organs,
    patient_name,
    patient_email,
    patient_age,
    patient_gender,
    scan_type,
    source,
    ground_truth,
    blood_pressure,
    blood_sugar,
    haemoglobin
)

        return jsonify({
    "job_id": task.id,
    "status": "started"
})

    except Exception as e:
        return jsonify({
            "error": "Processing failed",
            "details": str(e)
        }), 500
    

# ------------------------------
# 🔥 PROGRESS ROUTE (ADD HERE)
# ------------------------------
@app.route("/progress/<job_id>")
def get_progress(job_id):

    task = AsyncResult(job_id, app=celery)

    if task.state == 'PENDING':
        return jsonify({"progress": 0, "status": "Starting..."})

    elif task.state == 'PROGRESS':
        return jsonify({
            "progress": task.info.get("progress", 0),
            "status": task.info.get("status", "Processing...")
        })

    elif task.state == 'SUCCESS':
        return jsonify({
            "progress": 100,
            "status": "Completed",
            "result": task.result or {}
        })

    else:
        return jsonify({
            "progress": -1,
            "status": str(task.info)
        })

# ------------------------------
# ACCEPT TERMS
# ------------------------------
@app.route('/accept-terms', methods=['POST'])
def accept_terms():
    session['accepted_terms'] = True
    return '', 200

# ------------------------------
# ROUTES
# ------------------------------
@app.route('/')
def home():
    return render_template('termswelcomepage.html')

@app.route('/terms')
def terms():
    return render_template('termsmain.html')

@app.route('/consent', methods=['GET', 'POST'])
def consent():
    if request.method == 'POST':
        name = request.form.get('patientName')
        email = request.form.get('email')

        # 🔥 SAVE IN SESSION
        session['patientName'] = name
        session['email'] = email
        print("Consent Received:", name, email)

        return redirect(url_for('index'))

    return render_template('DataUsageAndConsentMainPage.html')

# ------------------------------
# MAIN APP
# ------------------------------
@app.route('/app', methods=['GET', 'POST'])
@limiter.limit("50 per minute")
def index():

    if request.method == 'POST':

        first = request.form.get('firstName')
        last = request.form.get('lastName')

        # 🔥 NAME FIX (form ya session dono handle karega)
        if first and last:
          patient_name = f"{first} {last}"
        else:
          patient_name = session.get('patientName')

        # 🔥 EMAIL FIX (form + consent page)
        patient_email = request.form.get('email') or session.get('email')
        patient_age = request.form.get('age')
        patient_gender = request.form.get('gender')
        scan_type = request.form.get('scanType')

        # 🔥 EMAIL CHECK
        if patient_email and not is_valid_email(patient_email):
            return jsonify({"error": "Invalid email"}), 400

        ctype_values = request.form.get("ctype_values", "")

        if ctype_values:
           selected_organs = [x.strip() for x in ctype_values.split(",") if x.strip()]
        else:
            selected_organs = []

        files = request.files.getlist('files')

        filepaths = []
        filenames = []

        for file in files:
            if file and file.filename:

                if not allowed_file(file.filename):
                    return jsonify({"error": "Invalid file type"}), 400

                filename = make_unique_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)

                filepaths.append(filepath)
                filenames.append(filename)

        if not filepaths:
            file = request.files.get('file')
            if file and file.filename:

                if not allowed_file(file.filename):
                    return jsonify({"error": "Invalid file type"}), 400

                filename = make_unique_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)

                filepaths = [filepath]
                filenames = [filename]

        if filepaths:
            try:
                input_data = filepaths if len(filepaths) > 1 else filepaths[0]

                return '', 204
            
            except Exception as e:
                return jsonify({
                    "error": "Processing failed",
                    "details": str(e)
                }), 500

    prediction = session.get('prediction')
    image_path = session.get('image_path')

    return render_template('index.html', prediction=prediction, image_path=image_path)


from flask_wtf.csrf import CSRFProtect, CSRFError

@csrf.exempt   # 🔥🔥🔥 ADD THIS LINE
@app.route('/save-result', methods=['POST'])
def save_result():
    data = request.json
    session['prediction'] = data

    # 🔥 IMPORTANT: image filename bhi save kar

    # 🔥 ALWAYS SET IMAGE PATH (fallback safe)
    if data:
         session['image_path'] = data.get("filename") or "default.png"

    session.modified = True
    
    return '', 200



import requests

@csrf.exempt
@app.route('/ai-recommend', methods=['POST'])
def ai_recommend():
    try:
        data = request.json

        response = requests.post(
            "http://127.0.0.1:5001/ai-recommend",
            json=data,
            timeout=10
        )

        return jsonify(response.json())

    except Exception as e:
        print("🔥 AI SERVER ERROR:", e)
        return jsonify({
    "ai_recommendation": [
        "⚠️ AI service temporarily unavailable due to usage limits. Please try again later."
    ]
}), 200

# ------------------------------
# CONTACT
# ------------------------------
@app.route('/contact', methods=['GET', 'POST'])
def contact():

    if request.method == 'POST':
        first_name = request.form.get('firstName')
        email = request.form.get('email')
        message = request.form.get('message')

        attachment = request.files.get('attachment')

        print("📩 Contact Form Submitted:")
        print("Name:", first_name)
        print("Email:", email)
        print("Message:", message)

        if attachment and attachment.filename:
            fname = make_unique_filename(attachment.filename)
            attachment.save(os.path.join(app.config['UPLOAD_FOLDER'], fname))
            print("Attachment saved:", fname)

        return render_template('contact.html', success=True)

    return render_template('contact.html')

# ------------------------------
# LOGIN
# ------------------------------
@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        print("Login Attempt:", email)

        if email in USERS and check_password_hash(USERS[email], password):
            return redirect(url_for('index'))

        return render_template('login.html', error="Invalid credentials")

    return render_template('login.html')

# ------------------------------
# OTHER ROUTES
# ------------------------------
@app.route('/insights')
def insights():
    prediction = session.get('prediction')
    image_path = session.get('image_path')

    if not prediction:
        return redirect(url_for('index'))

    return render_template('insights.html', prediction=prediction, image_path=image_path)

from flask import send_file   # 🔥 ye upar imports me bhi add kar

@app.route('/download-report')
def download_report():

    data = session.get('prediction')

    if not data:
        return "No report data found", 400

    pdf_path = generate_pdf(data)

    return send_file(
        pdf_path,
        as_attachment=True,
        download_name="CancerVision_Report.pdf"
    )


@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/privacymain')
def privacymain():
    return render_template('privacymain.html')

@app.route('/contactpageprivacy')
def contactpageprivacy():
    return render_template('contactpageprivacy.html')

@app.route('/termswelcomepage')
def termswelcomepage():
    return render_template('termswelcomepage.html')

@app.route('/DataUsageAndConsentMainPage')
def DataUsageAndConsentMainPage():
    return render_template('DataUsageAndConsentMainPage.html')

# ------------------------------
# START
# ------------------------------
if __name__ == '__main__':
    print("✅ CancerVision AI System Starting...")
    app.run(debug=True)