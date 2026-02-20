from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import (
    load_model,
    validate_input,
    predict_habitability,
    rank_exoplanets
)

app = Flask(__name__)
CORS(app)  # REQUIRED for frontend connection

# -------------------------
# Load model on startup
# -------------------------
model = load_model()

# Feature list (must match training)
FEATURES = [
    "planet_radius",
    "planet_mass"
     "stellar_temperature",
    "stellar_radius"
]

# -------------------------
# Health Check
# -------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Flask backend is running"
    })


# -------------------------
# Predict Endpoint (MANDATORY)
# -------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON input provided"
        }), 400

    errors = validate_input(data, FEATURES)
    if errors:
        return jsonify({
            "status": "error",
            "errors": errors
        }), 400

    prediction, probability = predict_habitability(
        model, data, FEATURES
    )

    return jsonify({
        "status": "success",
        "habitability_prediction": prediction,
        "habitability_score": probability
    })


# -------------------------
# Rank Endpoint (MANDATORY)
# -------------------------
@app.route("/rank", methods=["POST"])
def rank():
    records = request.get_json()

    if not isinstance(records, list):
        return jsonify({
            "status": "error",
            "message": "Input must be a list of exoplanet records"
        }), 400

    all_errors = {}
    for idx, record in enumerate(records):
        errors = validate_input(record, FEATURES)
        if errors:
            all_errors[f"record_{idx}"] = errors

    if all_errors:
        return jsonify({
            "status": "error",
            "errors": all_errors
        }), 400

    ranked_results = rank_exoplanets(
        model, records, FEATURES
    )

    return jsonify({
        "status": "success",
        "ranked_exoplanets": ranked_results
    })


# -------------------------
# Run Server
# -------------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
