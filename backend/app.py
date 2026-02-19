from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from utils import validate_input

# ------------------ APP SETUP ------------------
app = Flask(__name__)

# Allow frontend (Render domain)
# For now we allow all origins so it always works
CORS(app, resources={r"/*": {"origins": "*"}})

# ------------------ LOAD MODEL ------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "random_forest.pkl")

model = None

def get_model():
    global model
    if model is None:
        model = joblib.load("../models/random_forest.pkl")
    return model
# ------------------ FEATURES ------------------
FEATURES = [
    "pl_rade","pl_masse","pl_orbper","pl_orbsmax",
    "pl_eqt","pl_insol","pl_dens",
    "st_teff","st_mass","st_rad","st_lum",
    "st_logg","st_met","st_age",
    "sy_dist","sy_vmag","sy_kmag",
    "pl_trandep","pl_trandur",
    "pl_ratror","pl_imppar"
]

# ------------------ HOME ROUTE ------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "message": "ExoHabitAI backend is live 🚀"
    })

# ------------------ PREDICT ROUTE ------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Validate input
        valid, error = validate_input(data, FEATURES)
        if not valid:
            return jsonify({
                "status": "error",
                "message": error
            }), 400

        # Create feature vector
        feature_vector = [float(data[f]) for f in FEATURES]
        X = np.array([feature_vector])

        # Prediction
        prediction = int(model.predict(X)[0])
        probability = float(model.predict_proba(X)[0][1])

        # Convert to readable text
        result_text = "Habitable" if prediction == 1 else "Not Habitable"

        return jsonify({
            "status": "success",
            "prediction": result_text,
            "habitability_score": round(probability, 3)
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ------------------ RENDER SERVER (IMPORTANT) ------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)








