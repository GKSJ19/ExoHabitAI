from flask import Flask, request, jsonify
import joblib
from utils import validate_input, rank_exoplanets
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Load trained model once at startup

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "best_exohabit_model.pkl")

model = joblib.load(MODEL_PATH)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "ExoHabitAI Backend API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():
    """
    Predicts habitability of a single exoplanet
    """
    data = request.get_json()

    valid, result = validate_input(data)
    if not valid:
        return jsonify({
            "status": "error",
            "message": result
        }), 400

    prediction = model.predict(result)[0]
    probability = model.predict_proba(result)[0][1]

    return jsonify({
        "status": "success",
        "prediction": "Habitable" if prediction == 1 else "Not Habitable",
        "confidence_score": round(float(probability), 4)
    })


@app.route("/rank", methods=["POST"])
def rank():
    """
    Ranks multiple exoplanets based on habitability score
    """
    data = request.get_json()

    if not data or "planets" not in data:
        return jsonify({
            "status": "error",
            "message": "Request must contain a 'planets' list"
        }), 400

    ranked_planets = rank_exoplanets(data["planets"], model)

    return jsonify({
        "status": "success",
        "ranked_exoplanets": ranked_planets
    })


if __name__ == "__main__":
    app.run(debug=True)
