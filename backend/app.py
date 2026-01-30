
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import os
from utils import load_model



# ==============================
# Feature list (MUST match training order)
# ==============================
FEATURE_NAMES = [
    'pl_rade',
    'pl_orbper',
    'pl_orbsmax',
    'pl_eqt',
    'st_teff',
    'st_rad',
    'st_mass',
    'st_met',
    'disc_year',
    'default_flag',
    'pl_bmasse',
    'pl_density',
    'st_luminosity',
    'pl_eqt_norm',
    'pl_rade_norm',
    'pl_orbsmax_norm',
    'st_luminosity_norm',
    'st_teff_norm',
    'st_rad_norm',
    'st_lum_norm',
    'temp_star_score',
    'size_star_score',
    'radiation_score',
    'stellar_compatibility_index',
    'pl_orbper_norm',
    'period_stability_score',
    'distance_stability_score',
    'orbital_stability_factor'
]
# Get project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Path to habitability ranked CSV
RANKED_FILE_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "habitability_ranked.csv"
)

print("Starting Flask app...")

# ==============================
# Flask app
# ==============================
app = Flask(__name__)

# Load trained pipeline once
model = load_model()

# ==============================
# Prediction endpoint
# ==============================
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        input_row = []

        # Build full feature vector (28 features)
        for feature in FEATURE_NAMES:
            input_row.append(data.get(feature, 0))

        features = np.array([input_row])

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]

        return jsonify({
            "habitable": int(prediction),
            "confidence": round(float(probability), 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/rank", methods=["GET"])
def rank_planets():
    try:
        # Check if ranked CSV exists
        if not os.path.exists(RANKED_FILE_PATH):
            return jsonify({"error": "Habitability ranked file not found"}), 404

        # Read CSV
        df = pd.read_csv(RANKED_FILE_PATH)

        # Take top 10 most habitable planets
        top_planets = df.head(10).copy()
        top_planets["rank"] = range(1, len(top_planets) + 1)


        # Convert to JSON
        result = top_planets[["rank", "habitability_probability"]].to_dict(orient="records")


        return jsonify({
            "count": len(result),
            "top_habitable_planets": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ==============================
# Run server
# ==============================
if __name__ == "__main__":
    app.run(debug=True)

