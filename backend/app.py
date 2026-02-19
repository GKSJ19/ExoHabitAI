from flask import Flask, request, jsonify
from utils import predict_habitability
import pandas as pd
import os

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({"message": "ExoHabitAI Backend Running"})


# -------------------------
# PREDICT API
# -------------------------

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    required = ["pl_eqt", "pl_rade", "pl_orbsmax"]

    if not data:
        return jsonify({"error": "No input provided"}), 400

    for r in required:
        if r not in data:
            return jsonify({"error": f"Missing field: {r}"}), 400

    result = predict_habitability(data)

    return jsonify(result)


# -------------------------
# RANK API
# -------------------------

@app.route("/rank", methods=["GET"])
def rank():

    path = os.path.join("data", "processed", "habitability_ranked.csv")

    if not os.path.exists(path):
        return jsonify({"error": "Ranking file not found"}), 404

    df = pd.read_csv(path)

    top5 = df.head(5).to_dict(orient="records")

    return jsonify({
        "top_ranked_planets": top5,
        "status": "success"
    })


if __name__ == "__main__":
    app.run(debug=True)
