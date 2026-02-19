from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.utils import predict_habitability
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


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
        
        # Convert 0/1 to Habitable/Not Habitable
        habitability_label = "Habitable" if result["prediction"] == 1 else "Not Habitable"

        return jsonify({
            "status": "success",
            "prediction": {
                "habitability": habitability_label,
                "score": result["probability"]
            }
        })

    except ValueError as e:
        print(f"Validation Error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": "Internal server error: " + str(e)
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
