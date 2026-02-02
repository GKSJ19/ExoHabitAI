"""#STEP 3: Create app.py
# Step 1: Import required libraries
from flask import Flask, request, jsonify
import joblib
import numpy as np
from utils import validate_input, rank_exoplanets


# Step 2: Initialize Flask app
app = Flask(__name__)


# Step 3: Load trained ML model
model = joblib.load("final_model.pkl")


# Step 4: Home route (testing)
@app.route("/")
def home():
    return "ExoHabitAI Backend is running"


# Step 5: Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    valid, message = validate_input(data)
    if not valid:
        return jsonify({
            "status": "error",
            "message": message
        }), 400

    # ✅ FIXED FEATURE ORDER (IMPORTANT)
    features = np.array([[
        data["radius"],
        data["mass"],
        data["temperature"],
        data["orbital_period"]
    ]])

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    return jsonify({
        "status": "success",
        "prediction": int(prediction),
        "habitability_score": round(float(probability), 3)
    })



# Step 6: Ranking API
@app.route("/rank", methods=["POST"])
def rank():
    data = request.get_json()
    ranked = rank_exoplanets(data, model)

    return jsonify({
        "status": "success",
        "ranked_exoplanets": ranked
    })


# Step 7: Run Flask app
if __name__ == "__main__":
    app.run(debug=True)"""

"""from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load pipeline (model + preprocessing)
model = joblib.load("final_model.pkl")

@app.route("/")
def home():
    return "ExoHabitAI Backend is running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Convert JSON to DataFrame
    input_df = pd.DataFrame([data])

    # Predict
    prediction = int(model.predict(input_df)[0])
    probability = float(model.predict_proba(input_df)[0][1])

    return jsonify({
        "status": "success",
        "prediction": prediction,
        "habitability_score": probability
    })

if __name__ == "__main__":
    app.run(debug=True)"""



from flask import Flask, request, jsonify
import joblib
from utils import validate_input, prepare_input
app = Flask(__name__)

# Load pipeline
model = joblib.load("final_model.pkl")

@app.route("/")
def home():
    return "ExoHabitAI Backend Running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    """# Map JSON → dataset columns
    input_df = pd.DataFrame([{
        "pl_rade": data["radius"],
        "pl_bmasse": data["mass"],
        "pl_eqt": data["temperature"],
        "pl_orbper": data["orbital_period"]
    }])

    prediction = int(model.predict(input_df)[0])
    probability = float(model.predict_proba(input_df)[0][1])

    return jsonify({
        "status": "success",
        "prediction": prediction,
        "habitability_score": probability
    })"""
    is_valid, message = validate_input(data)
    if not is_valid:
        return jsonify({
            "status": "error",
            "message": message
        }), 400

    input_df = prepare_input(data)

    prediction = int(model.predict(input_df)[0])
    probability = float(model.predict_proba(input_df)[0][1])

    return jsonify({
        "status": "success",
        "prediction": prediction,
        "habitability_score": probability
    })

if __name__ == "__main__":
    app.run(debug=True)


