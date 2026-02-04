from flask import Flask, request, jsonify
import joblib
import os
from utils import validate_input, preprocess_input
app = Flask(__name__)
MODEL_PATH = r"D:\Downloads\random_forest(1).pkl"
# Load model at startup
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully")
    else:
    model = None
    print("Model file not found")
@app.route("/")
def home():
    return jsonify({
        "message": "Exoplanet Habitability Prediction API is running",
        "status": "active"
    })
@app.route("/predict", methods=["POST"])
def predict():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    data = request.get_json()
    valid, error = validate_input(data)

    if not valid:
        return jsonify({"error": error}), 400

    X = preprocess_input(data)

    prediction = int(model.predict(X)[0])
    probability = float(model.predict_proba(X)[0][1])

    return jsonify({
        "habitability_class": prediction,
        "habitability_label": "Potentially Habitable" if prediction == 1 else "Non-Habitable",
        "confidence_score": round(probability, 4),
        "status": "success"
    })

@app.route("/rank", methods=["POST"])
def rank():
    planets = request.get_json()

    ranked = []
    for planet in planets:
        valid, error = validate_input(planet)
        if not valid:
            return jsonify({"error": error}), 400

        X = preprocess_input(planet)
        score = float(model.predict_proba(X)[0][1])
        planet["habitability_score"] = score
        ranked.append(planet)

    ranked = sorted(ranked, key=lambda x: x["habitability_score"], reverse=True)

    return jsonify({
        "status": "success",
        "ranked_exoplanets": ranked
    })

if __name__ == "__main__":
    app.run(debug=True)
