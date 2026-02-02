"""#STEP 1: Install Required Libraries (ONE TIME ONLY):Open Terminal / VS Code Terminal
# #pip install flask joblib numpy pandas

#STEP 2: Create utils.py
import numpy as np

# Step 1: Input validation
def validate_input(data):
    if data is None:
        return False, "No input data received"

    for key, value in data.items():
        if value is None:
            return False, f"Missing value for {key}"
        if not isinstance(value, (int, float)):
            return False, f"Invalid data type for {key}"

    return True, "Input is valid"


# Step 2: Ranking exoplanets
def rank_exoplanets(exoplanets, model):
    results = []

    for planet in exoplanets:
        features = np.array([list(planet.values())])
        score = model.predict_proba(features)[0][1]

        planet_data = planet.copy()
        planet_data["habitability_score"] = round(float(score), 3)
        results.append(planet_data)

    results.sort(key=lambda x: x["habitability_score"], reverse=True)
    return results"""

import pandas as pd

def validate_input(data):
    """
    Validate incoming JSON data
    """
    required_fields = ["radius", "mass", "temperature", "orbital_period"]

    for field in required_fields:
        if field not in data:
            return False, f"Missing field: {field}"

    return True, "Valid input"


def prepare_input(data):
    """
    Convert JSON input into model-ready DataFrame
    """
    input_df = pd.DataFrame([{
        "pl_rade": data["radius"],
        "pl_bmasse": data["mass"],
        "pl_eqt": data["temperature"],
        "pl_orbper": data["orbital_period"]
    }])

    return input_df


