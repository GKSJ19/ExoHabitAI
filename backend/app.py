from flask import Flask, request, jsonify
import pandas as pd
from utils import load_model

app = Flask(__name__)


model = load_model()  # Make sure utils.py has a function to load your .pkl model

DATA_PATH = "data/processed/exoplanet_ml_ready.csv"


required_features = ["pl_rade", "pl_bmasse", "pl_eqt", "st_teff", "st_rad"]


@app.route("/")
def home():
    return jsonify({
        "message": "Exoplanet Habitability Prediction API is running 🚀",
        "status": "OK"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

    
        for feature in required_features:
            if feature not in data:
                return jsonify({"error": f"Missing feature: {feature}"}), 400

        features_df = pd.DataFrame([{f: data[f] for f in required_features}])

        prediction = int(model.predict(features_df)[0])
        confidence = float(model.predict_proba(features_df)[0][1])

        return jsonify({
            "prediction": prediction,
            "confidence_score": round(confidence, 3),
            "status": "Prediction successful"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/rank", methods=["GET"])
def rank():
    try:
        df = pd.read_csv(DATA_PATH)


        missing_cols = [col for col in required_features if col not in df.columns]
        if missing_cols:
            return jsonify({"error": f"Missing columns in dataset: {missing_cols}"}), 500

        
        X = df[required_features].copy()

        
        scores = model.predict_proba(X)[:, 1]
        df["habitability_score"] = scores

       
        df_sorted = df.sort_values(by="habitability_score", ascending=False)
        top_planets = df_sorted.head(10)

        return jsonify({
            "total_planets": len(df),
            "top_10_habitable_planets": top_planets.to_dict(orient="records"),
            "status": "Ranking successful"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    app.run(debug=True)  