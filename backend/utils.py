import joblib
import numpy as np
import os

# Load model path
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "random_forest.pkl"
)

# Load trained model
model = joblib.load(MODEL_PATH)


def predict_habitability(data):
    try:
        features = np.array([[ 
            float(data["pl_eqt"]),
            float(data["pl_rade"]),
            float(data["pl_orbsmax"])
        ]])

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]

        return {
            "prediction": int(prediction),
            "probability": float(probability),
            "status": "success"
        }

    except Exception as e:
        return {
            "error": str(e),
            "status": "failed"
        }
