import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "Exohabit_habitibility_model.pkl")

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Model file not found in models directory")
    model = joblib.load(MODEL_PATH)
    return model

def validate_input(data):
    required_fields = ["planet_radius", "planet_mass"]

    for field in required_fields:
        if field not in data:
            return False, f"{field} is missing"

    return True, "Valid input"

import pandas as pd

def get_feature_importance(model, feature_names):
    """
    Returns feature importance as a sorted list
    """
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    else:
        raise ValueError("Model does not support feature importance")

    feature_importance_df = pd.DataFrame({
        "feature": feature_names,
        "importance": importances
    })

    feature_importance_df = feature_importance_df.sort_values(
        by="importance", ascending=False
    )

    return feature_importance_df

def validate_input(data, required_features):
    """
    Validates input JSON for prediction
    """
    errors = []

    # Check missing fields
    for feature in required_features:
        if feature not in data:
            errors.append(f"Missing parameter: {feature}")

    # Check invalid values
    for feature in required_features:
        if feature in data:
            try:
                float(data[feature])
            except (ValueError, TypeError):
                errors.append(f"Invalid value for parameter: {feature}")

    return errors

import numpy as np

def predict_habitability(model, input_features):
    features = np.array(input_features).reshape(1, -1)

    prediction = model.predict(features)[0]

    if hasattr(model, "predict_proba"):
        probability = model.predict_proba(features)[0][1]
    else:
        probability = float(prediction)

    return prediction, round(probability, 3)


def rank_exoplanets(model, dataframe):
    scores = model.predict_proba(dataframe)[:, 1]
    dataframe["habitability_score"] = scores
    ranked_df = dataframe.sort_values(
        by="habitability_score",
        ascending=False
    )

    return ranked_df
