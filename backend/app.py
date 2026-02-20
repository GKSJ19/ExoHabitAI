from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)
MODEL_PATH = "models/random_forest.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("Model file not found. Please check models/random_forest.pkl")

model = joblib.load(MODEL_PATH)
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Backend is running",
        "message": "ExoHabitAI Flask API"
    })
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if data is None:
        return jsonify({
            "status": "error",
            "message": "No JSON data provided"
        }), 400

    try:
        features = [
            data["pl_rade"],
            data["pl_masse"],
            data["pl_orber"],
            data["pl_orbsmax"],
            data["pl_eqt"],
            data["pl_dens"],
            data["st_teff"],
            data["st_lum"],
            data["st_met"]
        ]

        features_array = np.array(features).reshape(1, -1)

        prediction = model.predict(features_array)[0]

        if hasattr(model, "predict_proba"):
            probability = model.predict_proba(features_array)[0][1]
        else:
            probability = 0.0

        result = "Potentially Habitable" if prediction == 1 else "Not Habitable"

        return jsonify({
            "status": "success",
            "prediction": result,
            "confidence_score": round(float(probability), 4)
        })

    except KeyError as e:
        return jsonify({
            "status": "error",
            "message": f"Missing parameter: {str(e)}"
        }), 400

if __name__ == "__main__":
    app.run()

    



