from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__, static_folder="../frontend")
CORS(app)

# Use relative paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../models/exohabit_model.pkl")
DATA_PATH = os.path.join(BASE_DIR, "../data/processed/reprocessed.csv")

# Load model and data
model = joblib.load(MODEL_PATH)
df = pd.read_csv(DATA_PATH)

FEATURES = df.drop("habitable", axis=1).columns.tolist()

@app.route("/")
def home():
    return send_from_directory("../frontend", "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory("../frontend", path)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Create input dataframe with zeros
        input_df = pd.DataFrame(np.zeros((1, len(FEATURES))), columns=FEATURES)

        # Fill in provided values
        for k in data:
            if k in input_df.columns:
                input_df[k] = data[k]

        # Make prediction
        pred = model.predict(input_df)[0]
        prob = model.predict_proba(input_df)[0][1]

        # Return response matching frontend expectations
        return jsonify({
            "status": "Habitable" if pred == 1 else "Not Habitable",
            "score": float(prob)  # Changed from "probability" to "score"
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "Error",
            "score": 0.0
        }), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)