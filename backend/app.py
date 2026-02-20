from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import joblib
import numpy as np
import pandas as pd


from utils import validate_input, format_prediction

app = Flask(__name__)
CORS(app)

# ===============================
# LOAD TRAINED MODEL
# ===============================
MODEL_PATH = "models/xgboost.pkl"
model = joblib.load(MODEL_PATH)


# ===============================
# HOME ROUTE
# ===============================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "ExoHabitAI Backend API is running",
        "status": "success"
    })


# ===============================
# PREDICT ENDPOINT
# ===============================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "JSON body is required"
            }), 400

        valid, result = validate_input(data)

        if not valid:
            return jsonify({
                "status": "error",
                "message": result
            }), 400

        features = result

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]

        response = format_prediction(prediction, probability)

        return jsonify({
            "status": "success",
            "result": response
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ===============================
# RANK ENDPOINT
# ===============================
"""@app.route("/rank", methods=["POST"])
def rank():
    try:
        data = request.get_json()

        if not isinstance(data, list):
            return jsonify({
                "status": "error",
                "message": "Input must be a list of exoplanets"
            }), 400

        records = []
        names = []

        for planet in data:
            valid, result = validate_input(planet)
            if not valid:
                return jsonify({
                    "status": "error",
                    "message": result
                }), 400

            records.append(result.flatten())
            names.append(planet.get("name", "Unknown"))

        X = np.array(records)
        scores = model.predict_proba(X)[:, 1]

        ranked = sorted(
            zip(names, scores),
            key=lambda x: x[1],
            reverse=True
        )

        output = [
            {
                "rank": i + 1,
                "planet_name": name,
                "habitability_score": round(float(score), 4)
            }
            for i, (name, score) in enumerate(ranked)
        ]

        return jsonify({
            "status": "success",
            "ranked_exoplanets": output
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500"""
@app.route("/rank", methods=["POST"])
def rank():
    try:
        data = request.get_json()

        if not data or not isinstance(data, list):
            return jsonify({
                "status": "error",
                "message": "Input must be a list of exoplanet objects"
            }), 400

        ranked_list = []

        for idx, planet in enumerate(data):
            valid, features = validate_input(planet)

            if not valid:
                return jsonify({
                    "status": "error",
                    "message": f"Error in planet {idx + 1}: {features}"
                }), 400

            prediction = model.predict(features)[0]
            probability = model.predict_proba(features)[0][1]

            label = "Habitable" if prediction == 1 else "Non-Habitable"

            ranked_list.append({
                "planet_name": planet.get("name", f"Planet_{idx + 1}"),
                "prediction": label,
                "habitability_score": round(float(probability), 4)
            })

        # Sort by habitability score (descending)
        ranked_list = sorted(
            ranked_list,
            key=lambda x: x["habitability_score"],
            reverse=True
        )

        # Assign ranks
        for i, planet in enumerate(ranked_list):
            planet["rank"] = i + 1

        return jsonify({
            "status": "success",
            "ranked_exoplanets": ranked_list
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# ===============================
# METRICS ENDPOINT (Real CSV values)
# ===============================
"""@app.route("/metrics", methods=["GET"])
def get_metrics():
    try:
        # Load CSV with predictions
        df = pd.read_csv("pre-processedd.csv")  # <-- adjust path if needed

        total = len(df)
        habitable = (df["Predicted_Habitability"] == 1).sum()
        non_habitable = total - habitable
        avg_score = df["Habitability_Probability"].mean()

        # Optionally, get best model from CSV metadata or just hardcode
        best_model = "XGBoost"  # You can change this dynamically if needed

        return jsonify({
            "total_exoplanets": int(total),
            "habitable_planets": int(habitable),
            "non_habitable_planets": int(non_habitable),
            "average_habitability_score": round(float(avg_score), 3),
            "best_model": best_model
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
"""
@app.route("/metrics", methods=["GET"])
def get_metrics():
    try:
        print("Loading CSV...")
        df = pd.read_csv("data/processed/exohabit_ml_output.csv")
        print(f"CSV loaded. Total rows: {len(df)}")

        total = len(df)
        habitable = (df["Predicted_Habitability"] == 1).sum()
        non_habitable = total - habitable
        avg_score = df["Habitability_Probability"].mean()
        best_model = "XGBoost"

        print("Metrics calculated successfully.")

        return jsonify({
            "total_exoplanets": int(total),
            "habitable_planets": int(habitable),
            "non_habitable_planets": int(non_habitable),
            "average_habitability_score": round(float(avg_score), 3),
            "best_model": best_model
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@app.route("/download/preprocessed", methods=["GET"])
def download_preprocessed():
    try:
        path = "pre-processedd.csv"  # Path to your preprocessed CSV
        return send_file(
            path,
            mimetype="text/csv",
            download_name="preprocessed_exoplanets.csv",
            as_attachment=True
        )
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route("/download/predicted", methods=["GET"])
def download_predicted():
    try:
        path = "data/processed/exohabit_ml_output.csv"  # Path to ML output CSV
        return send_file(
            path,
            mimetype="text/csv",
            download_name="predicted_habitability.csv",
            as_attachment=True
        )
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# ===============================
# RUN SERVER
# ===============================

if __name__ == "__main__":
    app.run(debug=True)

