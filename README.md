# 🩺 CancerVision

![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-Deep%20Learning-FF6F00?logo=tensorflow&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![AI](https://img.shields.io/badge/Artificial%20Intelligence-red)
![Medical](https://img.shields.io/badge/Medical%20Image%20Analysis-success)

### AI-Based Multi-Cancer Detection & Subtype Classification System

CancerVision is an AI-powered medical image analysis platform designed to detect multiple types of cancer and classify their subtypes using Deep Learning. The system analyzes medical images from different organs and automatically routes them to specialized AI models for accurate prediction.

The platform combines automated organ identification, multi-model inference, explainable AI (Grad-CAM), AI-assisted clinical recommendations, and downloadable PDF reports into a single unified application.

> **This project was developed as a Final Year B.Tech project focused on AI-driven medical image analysis and explainable deep learning for multi-cancer detection.**

---

## 📌 Features

- 🧠 Automatic organ detection using a Gatekeeper Model
- 🫁 Lung Cancer Detection & Subtype Classification
- 🧠 Brain Tumor Detection & Classification
- 🎗 Breast Cancer Detection
- 🩹 Skin Cancer Detection & Classification
- 📊 Confidence score for every prediction
- 🔥 Grad-CAM visual explainability
- 🤖 AI-generated and rule-based clinical recommendations
- 📄 Downloadable PDF diagnostic reports
- ⚡ Asynchronous background processing using Celery
- 📋 Inference logging for future analysis
- 🔒 Secure Flask backend with validation and CSRF protection

---

## 📂 Supported Organs

| Organ | Imaging Modality | Prediction |
|--------|------------------|------------|
| Lung | CT Scan, Chest X-ray | Cancer Detection + Subtype |
| Brain | MRI | Tumor Detection + Subtype |
| Breast | Mammography | Cancer Detection |
| Skin | Dermoscopy | Cancer Detection + Subtype |

---

## 🧬 Supported Cancer Types

### Lung

- Adenocarcinoma
- Large Cell Carcinoma
- Squamous Cell Carcinoma
- Normal

### Brain

- Glioma
- Meningioma
- Pituitary Tumor
- Normal

### Breast

- Cancer
- Normal

### Skin

- Basal Cell Carcinoma
- Melanoma
- Normal

---

## 🏗️ System Architecture

```text
                    Medical Image
                          │
                          ▼
               Unified Preprocessing
                          │
                          ▼
                Gatekeeper AI Model
                          │
      ┌──────────┬──────────┬──────────┬──────────┐
      ▼          ▼          ▼          ▼
   Lung AI    Brain AI   Breast AI   Skin AI
      │          │          │          │
      └──────────┴──────────┴──────────┘
                    │
                    ▼
         Cancer Detection & Classification
                    │
                    ▼
           Confidence Score Generation
                    │
                    ▼
              Grad-CAM Explanation
                    │
                    ▼
      Clinical Recommendation Engine
                    │
                    ▼
          PDF Report Generation
```

---

## 🔄 Workflow

1. Upload one or more medical images.
2. Enter basic patient information.
3. Images are automatically preprocessed.
4. Gatekeeper model identifies the organ.
5. Appropriate AI model performs inference.
6. Cancer detection is performed.
7. Subtype classification (where applicable).
8. Confidence score is calculated.
9. Grad-CAM visualization is generated.
10. Clinical recommendations are produced.
11. A structured PDF report is generated.
12. Results are displayed to the user.

---

## 🧩 Key Components

### Gatekeeper Model

The Gatekeeper model automatically identifies the organ from the uploaded medical image and routes it to the corresponding specialized AI model.

This eliminates manual organ selection and enables a fully automated prediction pipeline.

---

### Specialized Deep Learning Models

Each organ uses an independently trained deep learning model optimized for its imaging characteristics.

Models included:

- Lung Model
- Brain Model
- Breast Primary Model
- Breast Fallback Model
- Skin Model

---

### Explainable AI

CancerVision integrates **Grad-CAM** to highlight the regions of an image that contribute most to the model's prediction, improving interpretability and transparency.

---

### Clinical Recommendation Engine

The recommendation engine combines:

- Rule-based recommendations
- AI-generated recommendations

to provide structured post-prediction clinical guidance.

---

### PDF Report Generation

Each prediction generates a downloadable PDF report containing:

- Patient Information
- Prediction Result
- Cancer Type
- Confidence Score
- Model Used
- Grad-CAM Visualization
- Clinical Recommendations

---

### Asynchronous Processing

Long-running inference tasks are executed in the background using:

- Celery
- Redis

This keeps the application responsive during prediction.

---

## 💻 Technology Stack

### Backend

- Python
- Flask
- Celery
- Redis

### Deep Learning

- TensorFlow
- Keras
- MobileNet
- Custom CNN Models

### Computer Vision

- OpenCV
- Pillow
- NumPy
- Grad-CAM

### Frontend

- HTML
- CSS
- JavaScript

### Report Generation

- ReportLab

---

## 📁 Project Structure

```text
CancerVision/
│
├── app.py
├── ai_server.py
├── celery_worker.py
├── tasks.py
├── mycode.py
├── gradcam.py
├── recommendation_engine.py
├── recommendation_data.py
├── report_generator.py
├── inference_logger.py
├── config.py
├── requirements.txt
├── README.md
├── .gitignore
├── .gitattributes
│
├── archive_training/
├── models/
│   ├── Brain/
│   ├── Breast/
│   ├── Lung/
│   ├── Skin/
│   └── Gatekeeper/
│
├── static/
└── templates/
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/Suvansh-DevHub/CancerVision-AI-Multi-Cancer-Detection.git
```

### Move into the project directory

```bash
cd CancerVision-AI-Multi-Cancer-Detection
```

### Create a virtual environment

```bash
python -m venv venv
```

### Activate the virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Start Redis

```bash
redis-server
```

### Start Celery Worker

```bash
celery -A tasks worker --loglevel=info
```

### Run the Flask application

```bash
python app.py
```

---

## 🌐 Deployment

**Current Status:** Not deployed.

The application is currently intended for local execution because deep learning inference requires significant computational resources.

---

## 🔮 Future Improvements

- Docker Deployment
- Docker Compose
- Cloud Deployment (AWS)
- REST API
- Mobile Application
- DICOM File Support
- Electronic Health Record (EHR) Integration
- Multi-user Authentication
- Model Quantization
- ONNX Deployment
- GPU Acceleration
- Additional Cancer Types
- Real-time Monitoring Dashboard

---

## ⚠️ Disclaimer

CancerVision is intended solely for research and educational purposes.

The predictions generated by the system are AI-assisted estimates and **must not** be considered a substitute for professional medical diagnosis, treatment, or clinical decision-making.

---

## 👨‍💻 Author

**Sujal Rastogi**

B.Tech (Computer Science & Engineering)

AI • Deep Learning • Medical Image Analysis • Computer Vision
