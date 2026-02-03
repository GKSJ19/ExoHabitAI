from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os
from utils import preprocess_input
app = Flask(__name__)
# ---------------- PATHS ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "../models/habitability_model.pkl")
RANKED_DATA_PATH = os.path.join(BASE_DIR, "../data/habitability_ranked.csv")
# ---------------- LOAD MODEL ----------------
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    print("Model loading failed:", e)
    model = None
# ---------------- HOME ROUTE ----------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "ExoHabitAI Backend is Running",
        "status": "active"
    })
# ---------------- PREDICT ROUTE ----------------
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400
    required_fields = ["Radius", "Mass", "EqTemp", "Insolation"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    try:
        features = preprocess_input(data)
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]
        return jsonify({
            "prediction": "Habitable" if prediction == 1 else "Non-Habitable",
            "confidence_score": round(float(probability), 4),
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ---------------- RANK ROUTE ----------------
@app.route("/rank", methods=["GET"])
def rank():
    if not os.path.exists(RANKED_DATA_PATH):
        return jsonify({"error": "Ranked data file not found"}), 404
    try:
        df = pd.read_csv(RANKED_DATA_PATH)
        top_10 = df.head(10).to_dict(orient="records")

        return jsonify({
            "count": len(top_10),
            "ranking": top_10,
            "status": "success"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ---------------- RUN APP ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
