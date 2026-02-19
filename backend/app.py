from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from backend.utils import validate_input

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# Load model
model = joblib.load("../models/random_forest.pkl")

FEATURES = [
"pl_rade","pl_masse","pl_orbper","pl_orbsmax",
"pl_eqt","pl_insol","pl_dens",
"st_teff","st_mass","st_rad","st_lum",
"st_logg","st_met","st_age",
"sy_dist","sy_vmag","sy_kmag",
"pl_trandep","pl_trandur",
"pl_ratror","pl_imppar"
]

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message":"Backend running"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        valid, error = validate_input(data, FEATURES)
        if not valid:
            return jsonify({"status":"error","message":error}),400

        feature_vector = [float(data[f]) for f in FEATURES]
        X = np.array([feature_vector])

        prediction_raw = int(model.predict(X)[0])
        probability = float(model.predict_proba(X)[0][1])

        # Convert numeric prediction to label
        if prediction_raw == 1:
            label = "Habitable"
        else:
            label = "Not Habitable"

        return jsonify({
            "prediction": label,
            "habitability_score": round(probability, 3)
        })


    except Exception as e:
        return jsonify({"status":"error","message":str(e)}),500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)












