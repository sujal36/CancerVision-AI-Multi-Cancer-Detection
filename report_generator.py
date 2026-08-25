from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image  # type: ignore
from reportlab.lib.styles import getSampleStyleSheet  # type: ignore
from reportlab.lib.pagesizes import A4  # type: ignore
from reportlab.lib.units import inch  # type: ignore
import os
import uuid

# =========================
# PDF GENERATOR
# =========================
def generate_pdf(report_data, save_path=None):

    # 🔥 unique file name
    if save_path is None:
        save_path = f"reports/report_{uuid.uuid4().hex}.pdf"

    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    doc = SimpleDocTemplate(save_path, pagesize=A4)
    styles = getSampleStyleSheet()

    elements = []

    # -------------------------
    # TITLE
    # -------------------------
    elements.append(Paragraph("<b>CancerVision AI Report</b>", styles['Title']))
    elements.append(Spacer(1, 20))

    # -------------------------
    # 🔥 PATIENT INFO (ADDED)
    # -------------------------
    elements.append(Paragraph(f"<b>Patient Name:</b> {report_data.get('patient_name','')}", styles['Normal']))
    elements.append(Paragraph(f"<b>Email:</b> {report_data.get('patient_email','')}", styles['Normal']))
    elements.append(Spacer(1, 10))

    # -------------------------
    # BASIC INFO
    # -------------------------
    elements.append(Paragraph(f"<b>Report ID:</b> {report_data.get('request_id','')}", styles['Normal']))
    elements.append(Paragraph(f"<b>Filename:</b> {report_data.get('filename','')}", styles['Normal']))
    elements.append(Paragraph(f"<b>Organ:</b> {report_data.get('organ','')}", styles['Normal']))
    elements.append(Paragraph(f"<b>Gatekeeper Confidence:</b> {report_data.get('gatekeeper_confidence','')}", styles['Normal']))
    elements.append(Spacer(1, 10))

    # -------------------------
    # PREDICTION
    # -------------------------
    elements.append(Paragraph("<b>Prediction:</b>", styles['Heading2']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph(f"<b>Label:</b> {report_data.get('label','')}", styles['Normal']))

    if report_data.get("subtype"):
        elements.append(Paragraph(f"<b>Subtype:</b> {report_data.get('subtype')}", styles['Normal']))

    # 🔥 convert to %
    conf = report_data.get("confidence", 0)
    try:
        conf = f"{round(float(conf)*100, 2)}%"
    except:
        conf = str(conf)

    elements.append(Paragraph(f"<b>Confidence:</b> {conf}", styles['Normal']))
    elements.append(Paragraph(f"<b>Model Used:</b> {report_data.get('model_used','')}", styles['Normal']))

    elements.append(Spacer(1, 15))

    # -------------------------
    # RECOMMENDATION
    # -------------------------
    elements.append(Paragraph("<b>Recommendation:</b>", styles['Heading2']))
    elements.append(Spacer(1, 10))

    recs = report_data.get("recommendation", [])

    for rec in recs:
        if isinstance(rec, dict):
          text = f"• <b>{rec.get('heading','')}</b><br/>{rec.get('text','')}"
        else:
           text = str(rec)

        elements.append(Paragraph(text, styles['Normal']))
        elements.append(Spacer(1, 8))

    elements.append(Spacer(1, 20))


    heatmap_path = report_data.get("heatmap")

    if heatmap_path:
       real_path = heatmap_path.lstrip("/")  # 🔥 important fix

       if os.path.exists(real_path):
           elements.append(Paragraph("<b>AI Heatmap:</b>", styles['Heading2']))
           elements.append(Spacer(1, 10))

           elements.append(Image(real_path, width=4*inch, height=4*inch))
           elements.append(Spacer(1, 20))

    # -------------------------
    # FOOTER
    # -------------------------
    elements.append(Paragraph(
        "Note: This AI-generated report is for assistance only and not a medical diagnosis.",
        styles['Italic']
    ))

    # BUILD
    doc.build(elements)

    return save_path