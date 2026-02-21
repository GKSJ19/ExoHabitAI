import joblib
import os
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "models",
    "Exohabit_habitibility_model.pkl"
)

#  MUST match training feature names
ALL_FEATURES = [
    "planet_radius",
    "planet_mass",
    "host_star_temperature",
    "star_radius"
]

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Model file not found")
    return joblib.load(MODEL_PATH)

def validate_input(data, required_features):
    errors = []
    for f in required_features:
        if f not in data:
            errors.append(f"Missing parameter: {f}")
        else:
            try:
                float(data[f])
            except:
                errors.append(f"Invalid value for parameter: {f}")
    return errors

def build_feature_df(record):
    row = {f: 0.0 for f in ALL_FEATURES}

    row["planet_radius"] = record["planet_radius"]
    row["planet_mass"] = record["planet_mass"]
    row["host_star_temperature"] = record["stellar_temperature"]
    row["star_radius"] = record["stellar_radius"]

    return pd.DataFrame([row])

def predict_habitability(model, record):
    df = build_feature_df(record)

    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0][1]

    return prediction, round(float(probability), 4)

def rank_exoplanets(model, records):
    results = []

    for record in records:
        df = build_feature_df(record)
        score = model.predict_proba(df)[0][1]

        result = record.copy()
        result["habitability_score"] = round(float(score), 4)
        results.append(result)

    # Sort descending
    results.sort(key=lambda x: x["habitability_score"], reverse=True)

    return results
