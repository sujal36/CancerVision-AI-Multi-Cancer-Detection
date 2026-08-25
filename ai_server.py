from dotenv import load_dotenv
import os

load_dotenv()
ERROR_MSG = "⚠️ AI service temporarily unavailable due to usage limits. Please try again later."

from flask import Flask, request, jsonify
from google import genai

app = Flask(__name__)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# 🔥 ADD THIS LINE JUST BELOW
last_call = 0

@app.route('/ai-recommend', methods=['POST'])
def ai_recommend():
    global last_call

    try:
        import time

        # 🔥 RATE LIMIT PROTECTION
        if time.time() - last_call < 10:
            return jsonify({
                "status": "error", 
                "ai_recommendation": [ERROR_MSG]
            }), 200

        last_call = time.time()

        data = request.json or {}
        organ = data.get("organ")
        subtype = data.get("subtype")
        confidence = data.get("confidence")

        condition = subtype if subtype else "abnormality"

        prompt = f"""
        Give 3 short medical recommendations:

        Organ: {organ}
        Condition: {condition}
        Confidence: {confidence}
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = (response.text or "").split("\n")

        cleaned = [
            t.strip("-• 1234567890. ")
            for t in text if t.strip()
        ]

        intro = None
        points = []

        # 🔥 intro + points separate
        for line in cleaned:
            if "recommendation" in line.lower():
                intro = line
            else:
                points.append(line)

        # 🔥 REMOVE empty / weird lines
        points = [p for p in points if len(p) > 10]

        # 🔥 FORCE 3 POINTS
        fallback = [
            "Further clinical evaluation is recommended.",
            "Consult a specialist for confirmation.",
            "Follow-up imaging may be required."
        ]

        for f in fallback:
            if len(points) < 3 and f not in points:
                points.append(f)

        points = points[:3]

        # 🔥 FINAL OUTPUT
        ai_output = []

        if intro:
            ai_output.append(intro)

        ai_output.extend(points)

        return jsonify({
            "status": "success",
            "ai_recommendation": ai_output
            })

    except Exception as e:
        print("🔥 GEMINI ERROR:", e)

        return jsonify({
             "status": "error",
            "ai_recommendation": [ERROR_MSG]
        }), 200


if __name__ == "__main__":
    app.run(port=5001)