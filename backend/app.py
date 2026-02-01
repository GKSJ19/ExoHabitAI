from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os
from utils import preprocess_input

app = Flask(__name__)

MODEL_PATH = '../models/random_forest.pkl' # Or xgboost.pkl
RANKED_DATA_PATH = '../data/processed/habitability_ranked.csv'

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")
else:
    print(f"Error: Model not found at {MODEL_PATH}")
    model = None

@app.route('/')
def home():
    return jsonify({"message": "ExoHabitAI Prediction API is Running", "status": "active"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        required_fields = ['Radius', 'Mass', 'EqTemp', 'Insolation']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        processed_features = preprocess_input(data)

        if model:
            prediction = model.predict(processed_features)[0]
            confidence = model.predict_proba(processed_features)[0][1] # Prob of Class 1
            
            result = {
                "input_planet": data.get('Name', 'Unknown'),
                "prediction": "Potentially Habitable" if prediction == 1 else "Non-Habitable",
                "confidence_score": float(f"{confidence:.4f}"),
                "habitable_flag": int(prediction)
            }
            return jsonify(result)
        else:
            return jsonify({"error": "Model not loaded"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/rank', methods=['GET'])
def rank():
    try:
        if os.path.exists(RANKED_DATA_PATH):
            df = pd.read_csv(RANKED_DATA_PATH)
            
            top_10 = df.head(10).to_dict(orient='records')
            return jsonify({"count": len(top_10), "ranking": top_10})
        else:
            return jsonify({"error": "Ranked data file not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)