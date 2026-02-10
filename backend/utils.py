import pandas as pd
import numpy as np

REQUIRED_FEATURES = [
    "Planet radius",
    "Planet mass",
    "Orbital period",
    "Semi-major axis",
    "Planet density",
    "Host star temperature",
    "Star luminosity",
    "Star metallicity",
    "Star type"
]

def compute_derived_features(df):
    # Habitability score (same logic as training)
    df["habitability_score"] = (
        (1 / np.abs(df["Host star temperature"] - 288)) +
        (1 / np.abs(df["Planet radius"] - 1)) +
        (1 / df["Semi-major axis"])
    )

    # Orbital stability
    df["orbital_stability"] = df["Orbital period"] / df["Semi-major axis"]

    # Clean infinities / NaNs
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(df.median(numeric_only=True), inplace=True)

    return df


def validate_input(data):
    if not data:
        return False, "No input data provided"

    missing = [f for f in REQUIRED_FEATURES if f not in data]
    if missing:
        return False, f"Missing parameters: {missing}"

    try:
        df = pd.DataFrame([data])

        # Ensure correct dtypes
        numeric_cols = [
            "Planet radius", "Planet mass", "Orbital period",
            "Semi-major axis", "Planet density",
            "Host star temperature", "Star luminosity", "Star metallicity"
        ]

        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors="coerce")

        # Star type must be string
        df["Star type"] = df["Star type"].astype(str)

        df = compute_derived_features(df)

    except Exception as e:
        return False, str(e)

    return True, df


def rank_exoplanets(planets, model):
    ranked = []

    for planet in planets:
        valid, df = validate_input(planet)
        if valid:
            prob = model.predict_proba(df)[0][1]
            planet_out = planet.copy()
            planet_out["habitability_score"] = round(float(prob), 4)
            ranked.append(planet_out)

    ranked.sort(key=lambda x: x["habitability_score"], reverse=True)
    return ranked
