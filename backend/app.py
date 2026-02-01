from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load trained ML model (Pipeline)
model = joblib.load(
    r"C:\Users\Admin\Downloads\exoplanet_habitability_model.pkl"
)

@app.route("/", methods=["GET"])
def home():
    return "Exoplanet Habitability Prediction Backend is running!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON input
        input_data = request.get_json()

        # Convert input to DataFrame
        input_df = pd.DataFrame([input_data])

        # Predict habitability probability
        probability = model.predict_proba(input_df)[0][1]

        # Predict class (threshold = 0.5)
        prediction = 1 if probability >= 0.5 else 0

        return jsonify({
            "habitability_class": prediction,
            "habitability_score": round(probability, 4)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400

if __name__ == "__main__":
    app.run(debug=True)
