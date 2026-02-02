# =============================
# IMPORTS
# =============================
from flask import Flask, request, jsonify
import joblib
import numpy as np
import threading  # For running Flask in notebook

# =============================
# HELPER FUNCTIONS (utils.py content)
# =============================
def preprocess_input(data):
    """
    Preprocess input JSON data into a NumPy array for the model.
    Expects keys: 'radius', 'mass', 'temperature', 'orbital_period'
    """
    features = ['radius', 'mass', 'temperature', 'orbital_period']
    try:
        arr = np.array([data[f] for f in features]).reshape(1, -1)
        return arr
    except KeyError as e:
        return f"Missing key: {e}"

# =============================
# FLASK APP (app.py content)
# =============================
app = Flask(__name__)

# Load the trained model
model = joblib.load("final_model.pkl")  # Make sure final_model.pkl is in the same folder

# Home route
@app.route("/")
def home():
    return "ExoHabitAI Backend is running"

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON data
        data = request.get_json(force=True)
        # Preprocess input
        processed_data = preprocess_input(data)
        if isinstance(processed_data, str):
            return jsonify({"status": "error", "message": processed_data})
        # Predict using the model
        prediction = model.predict(processed_data)[0]
        # Example habitability score
        habitability_score = float(prediction) * 0.86
        return jsonify({
            "status": "success",
            "prediction": int(prediction),
            "habitability_score": habitability_score
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# =============================
# RUN FLASK APP IN NOTEBOOK
# =============================
def run_app():
    app.run(port=5000, debug=False, use_reloader=False)

# Start Flask in a separate thread
threading.Thread(target=run_app).start()

# =============================
# SAMPLE TEST CALL (optional)
# =============================
import requests
import time

# Wait a few seconds for Flask to start
time.sleep(2)

# Sample input JSON
sample_input = {
    "radius": 1.2,
    "mass": 0.9,
    "temperature": 288,
    "orbital_period": 365
}

# Make a POST request
try:
    response = requests.post("http://127.0.0.1:5000/predict", json=sample_input)
    print("Sample Test Response:", response.json())
except Exception as e:
    print("Error making test request:", e)