from flask import Flask, request, jsonify
from utils import predict_habitability
import pandas as pd

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "ExoHabitAI Backend is running"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        result = predict_habitability(data)

        return jsonify({
            "status": "success",
            "prediction": result["habitable"],
            "confidence": result["probability"]
        })

    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Internal server error"
        }), 500


@app.route("/rank", methods=["POST"])
def rank():
    try:
        data = request.get_json()

        if not isinstance(data, list):
            return jsonify({"error": "Expected list of exoplanets"}), 400

        df = pd.DataFrame(data)

        from utils import model, FEATURE_COLUMNS

        df_model = df[FEATURE_COLUMNS]
        df["habitability_probability"] = model.predict_proba(df_model)[:, 1]

        ranked = df.sort_values(
            by="habitability_probability",
            ascending=False
        )

        return jsonify({
            "status": "success",
            "results": ranked.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
