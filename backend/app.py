from flask import Flask, request, jsonify
import joblib
from utils import validate_input, rank_exoplanets
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
    data = request.get_json()

    valid, df = validate_input(data)
    if not valid:
        return jsonify({"status": "error", "message": df}), 400

    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0][1]

    return jsonify({
        "status": "success",
        "prediction": "Habitable" if prediction == 1 else "Not Habitable",
        "confidence_score": round(float(probability), 4)
    })


@app.route("/rank", methods=["POST"])
def rank():
    data = request.get_json()

    if "planets" not in data:
        return jsonify({"status": "error", "message": "Missing planets list"}), 400

    ranked = rank_exoplanets(data["planets"], model)
    return jsonify({"status": "success", "ranked_exoplanets": ranked})


if __name__ == "__main__":
    app.run(debug=True)
