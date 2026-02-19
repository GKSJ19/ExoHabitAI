from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from backend.utils import preprocess_input, validate_input

app = Flask(__name__)
CORS(app)

# Use relative path (IMPORTANT for deployment)
MODEL_PATH = r"D:\Downloads\random_forest(1).pkl"

# Load model once
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")
else:
    model = None
    print("❌ Model file not found")

@app.route("/")
def home():
    return jsonify({
        "message": "ExoHabitAI Prediction API is Running",
        "status": "active"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)   # ADD THIS

        X = preprocess_input(data)
        print("Processed input:", X)    # ADD THIS

        prediction = int(model.predict(X)[0])
        probability = float(model.predict_proba(X)[0][1])

        return jsonify({
            "habitability_label": "Potentially Habitable" if prediction == 1 else "Non-Habitable",
            "confidence_score": probability,
            "status": "success"
        })

    except Exception as e:
        print("ERROR:", str(e))   # ADD THIS
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

