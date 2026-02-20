
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import os
from backend.utils import load_model




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
CORS(app)

# Load trained pipeline once
model = load_model()

# ==============================
# Prediction endpoint
# ==============================
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Main inputs from frontend
    radius = float(data['radius'])
    mass = float(data['mass'])
    temp = float(data['temperature'])
    distance = float(data['distance'])

    # ---- DERIVED SCIENTIFIC FEATURES ----
    eqt = 288 * (temp/5778)**0.25 / (distance**0.5)
    density = mass / (radius**3 + 1e-6)
    period = 365 * (distance**1.5)

    star_radius = 1.0
    star_mass = 1.0
    metallicity = 0.0
    luminosity = (temp/5778)**4

    # ---- BUILD FULL FEATURE LIST (TRAINING ORDER) ----
    features = [[
        radius, period, distance, eqt, temp,
        star_radius, star_mass, metallicity, 2020, 1,
        mass, density, luminosity,

        # normalized placeholders
        0.5,0.5,0.5,0.5,0.5,0.5,0.5,

        # engineered scores
        0.7,0.7,0.7,0.7,

        0.5,0.6,0.6,0.6
    ]]

    prediction = model.predict(features)[0]

    try:
        score = float(model.predict_proba(features)[0][1])
    except:
        score = float(prediction)

    status = "Habitable" if prediction==1 else "Not Habitable"

    return jsonify({
        "score": round(score,2),
        "status": status
    })

@app.route("/rank", methods=["GET"])
def rank_planets():
    try:
        path = os.path.join(BASE_DIR,"data","processed","habitability_ranked.csv")

        if not os.path.exists(path):
            return jsonify({"error":"Ranking file not found"}),404

        df = pd.read_csv(path)

        # ensure probability column exists
        if "habitability_probability" not in df.columns:
            return jsonify({"error":"Column missing"}),500

        top = df.sort_values(
            "habitability_probability",
            ascending=False
        ).head(10)

        result = top.to_dict(orient="records")

        return jsonify({
            "count":len(result),
            "top_habitable_planets":result
        })

    except Exception as e:
        return jsonify({"error":str(e)}),500

@app.route("/importance", methods=["GET"])
def importance():

    try:
        model = load_model()
        clf = model.named_steps["classifier"]

        importance = abs(clf.coef_[0]).tolist()

        return jsonify({
            "features": FEATURE_NAMES,
            "importance": importance
        })

    except Exception as e:
        return jsonify({"error":str(e)}),500

@app.route("/upload_rank", methods=["POST"])
def upload_rank():

    file = request.files["file"]
    df = pd.read_csv(file)

    probs = model.predict_proba(df[FEATURE_NAMES])[:,1]
    df["habitability_probability"] = probs

    df.sort_values("habitability_probability", ascending=False, inplace=True)

    save_path = os.path.join(BASE_DIR,"data","processed","uploaded_ranked.csv")
    df.to_csv(save_path, index=False)

    return jsonify({"status":"saved","path":save_path})



# ==============================
# Run server
# ==============================
if __name__ == "__main__":
    app.run()


