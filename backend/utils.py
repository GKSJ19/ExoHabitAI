import numpy as np
import pandas as pd

def build_input_dataframe(data, feature_columns):
    """
    Rebuilds the model input dataframe with correct feature structure
    """

    # Create empty dataframe
    input_df = pd.DataFrame(
        np.zeros((1, len(feature_columns))),
        columns=feature_columns
    )

    # Fill numeric features
    input_df["pl_rade"] = data["pl_rade"]
    input_df["pl_bmasse"] = data["pl_bmasse"]
    input_df["pl_orbper"] = data["pl_orbper"]
    input_df["pl_eqt"] = data["pl_eqt"]

    # Handle star type (one-hot)
    star_col = f"star_{data['st_spectype']}"
    if star_col in input_df.columns:
        input_df[star_col] = 1

    return input_df

def validate_input(data):
    """
    Validates incoming JSON request
    """
    required_fields = {
        "pl_rade": (int, float),
        "pl_bmasse": (int, float),
        "pl_orbper": (int, float),
        "pl_eqt": (int, float),
        "st_spectype": str
    }

    if not data:
        return False, "Request body must be JSON"

    for field, field_type in required_fields.items():
        if field not in data:
            return False, f"Missing required field: {field}"
        if not isinstance(data[field], field_type):
            return False, f"Invalid type for field: {field}"

    return True, None
