import pandas as pd
import numpy as np
MODEL_FEATURES = [
    'Radius', 'Mass', 'Period', 'SemiMajorAxis',
    'EqTemp', 'Density', 'StarTemp', 'StarLum',
    'StarMet', 'Insolation'
]
def validate_input(data):
    for feature in MODEL_FEATURES:
        if feature not in data:
            return False, f"Missing required feature: {feature}"
    return True, None
def preprocess_input(data):
    df = pd.DataFrame([data])
df = df[MODEL_FEATURES]
return df
