import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "xgboost.pkl")

model = joblib.load(MODEL_PATH)

THRESHOLD = 0.25
FEATURE_COLUMNS = model.get_booster().feature_names


def prepare_input(data: dict):
    df = pd.DataFrame([data])

    # ✅ AUTO-FILL missing features with 0
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = 0

    # Ensure exact column order
    df = df[FEATURE_COLUMNS]
    return df


def predict_habitability(data: dict):
    X = prepare_input(data)

    prob = model.predict_proba(X)[0, 1]
    prediction = int(prob >= THRESHOLD)

    return {
        "habitable": prediction,
        "probability": round(float(prob), 4)
    }
