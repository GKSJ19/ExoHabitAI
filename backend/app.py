from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from utils import validate_input

# Initialize Flask app
app = Flask(__name__)

# 🔴 IMPORTANT: Enable CORS
CORS(app)

# Load trained Random Forest model
model = joblib.load("../models/random_forest.pkl")

# EXACT 21 FEATURES USED DURING TRAINING (ORDER MATTERS)
FEATURES = [
    "pl_rade", "pl_masse", "pl_orbper", "pl_orbsmax",
    "pl_eqt", "pl_insol", "pl_dens",
    "st_teff", "st_mass", "st_rad", "st_lum",
    "st_logg", "st_met", "st_age",
    "sy_dist", "sy_vmag", "sy_kmag",
    "pl_trandep", "pl_trandur",
    "pl_ratror", "pl_imppar"
]

# -------------------------------
# HOME ROUTE (TEST BACKEND)
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "ExoHabitAI Backend is running successfully"
    })


# -------------------------------
# PREDICT ROUTE
# -------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Validate input
        is_valid, error = validate_input(data, FEATURES)
        if not is_valid:
            return jsonify({
                "status": "error",
                "message": error
            }), 400

        # Build feature vector in training order
        feature_vector = [data[f] for f in FEATURES]
        X = np.array([feature_vector])

        # Model prediction
        prediction = model.predict(X)[0]
        probability = model.predict_proba(X)[0][1]

        return jsonify({
            "status": "success",
            "prediction": int(prediction),
            "habitability_score": round(float(probability), 3)
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
