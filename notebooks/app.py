from flask import Flask, request, jsonify
from utils import load_model
from utils import predict_habitability, rank_exoplanets

app = Flask(__name__)

# 🔹 Load ML model automatically when app starts
model = load_model()

# -------------------------
# Basic Routes
# -------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Flask backend is running",
        "model_loaded": True
    })

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "API is healthy"
    })

# -------------------------
# Example JSON Route
# -------------------------

@app.route("/echo", methods=["POST"])
def echo():
    """
    Example route to test JSON request & response
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    return jsonify({
        "received_data": data,
        "message": "JSON received successfully"
    })

# -------------------------
# Run App
# -------------------------

if __name__ == "__main__":
    app.run(debug=True)
from utils import get_feature_importance
@app.route("/feature-importance", methods=["GET"])
def feature_importance():
    # Feature names must be SAME as training
    feature_names = [
        "planet_radius",
        "planet_mass",
        "orbital_period",
        "semi_major_axis",
        "equilibrium_temperature",
        "planet_density",
        "host_star_temperature",
        "star_luminosity",
        "star_metallicity"
    ]

    importance_df = get_feature_importance(model, feature_names)

    return jsonify({
        "top_features": importance_df.to_dict(orient="records")
    })


from utils import validate_input
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON input provided"}), 400

    required_features = [
        "planet_radius",
        "planet_mass",
        "orbital_period",
        "semi_major_axis",
        "equilibrium_temperature",
        "planet_density",
        "host_star_temperature",
        "star_luminosity",
        "star_metallicity"
    ]

    errors = validate_input(data, required_features)

    if errors:
        return jsonify({
            "status": "error",
            "errors": errors
        }), 400

    prediction, probability = (model, data)
    predict_habitability
    return jsonify({
        "status": "success",
        "habitability_prediction": int(prediction),
        "habitability_score": round(float(probability), 4)
    })@app.route("/rank", methods=["POST"])
def rank():
    data = request.get_json()

    if not data or not isinstance(data, list):
        return jsonify({
            "error": "Input must be a list of exoplanet records"
        }), 400

    required_features = [
        "planet_radius",
        "planet_mass",
        "orbital_period",
        "semi_major_axis",
        "equilibrium_temperature",
        "planet_density",
        "host_star_temperature",
        "star_luminosity",
        "star_metallicity"
    ]

    all_errors = {}

    for idx, record in enumerate(data):
        errors = validate_input(record, required_features)
        if errors:
            all_errors[f"record_{idx}"] = errors

    if all_errors:
        return jsonify({
            "status": "error",
            "errors": all_errors
        }), 400

    ranked_results = rank_exoplanets(model, data)

    return jsonify({
        "status": "success",
        "ranked_exoplanets": ranked_results
    })

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No JSON input provided"
        }), 400

    required_features = [
        "planet_radius",
        "planet_mass",
        "orbital_period",
        "semi_major_axis",
        "equilibrium_temperature",
        "planet_density",
        "host_star_temperature",
        "star_luminosity",
        "star_metallicity"
    ]

    errors = validate_input(data, required_features)

    if errors:
        return jsonify({
            "status": "error",
            "message": "Input validation failed",
            "errors": errors
        }), 400

    prediction, probability = predict_habitability(model, data)

    return jsonify({
        "status": "success",
        "message": "Prediction completed successfully",
        "result": {
            "habitability_prediction": int(prediction),
            "confidence_score": round(float(probability), 4)
        }
    })

@app.route("/rank", methods=["POST"])
def rank():
    data = request.get_json()

    if not data or not isinstance(data, list):
        return jsonify({
            "status": "error",
            "message": "Input must be a list of exoplanet records"
        }), 400

    required_features = [
        "planet_radius",
        "planet_mass",
        "orbital_period",
        "semi_major_axis",
        "equilibrium_temperature",
        "planet_density",
        "host_star_temperature",
        "star_luminosity",
        "star_metallicity"
    ]

    all_errors = {}

    for idx, record in enumerate(data):
        errors = validate_input(record, required_features)
        if errors:
            all_errors[f"record_{idx}"] = errors

    if all_errors:
        return jsonify({
            "status": "error",
            "message": "Input validation failed",
            "errors": all_errors
        }), 400

    ranked_results = rank_exoplanets(model, data)

    return jsonify({
        "status": "success",
        "message": "Exoplanets ranked successfully",
        "results": ranked_results
    })

