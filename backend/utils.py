import numpy as np
import pandas as pd
from typing import Dict, Tuple, List

EXPECTED_FEATURES = [
    'pl_orbper',
    'pl_orbsmax',
    'pl_bmasse',
    'st_met',
    'st_logg',
    'disc_year',
    'st_type_category_F',
    'st_type_category_G',
    'st_type_category_K',
    'st_type_category_M',
    'st_type_category_Other',
    'pl_type_category_jupiter',
    'pl_type_category_neptune',
    'pl_type_category_rocky',
    'pl_type_category_super_earth'
]

VALIDATION_RANGES = {
    'pl_orbper': (0.1, 100000.0),      # Orbital period (days)
    'pl_orbsmax': (0.001, 1000.0),     # Semi-major axis (AU)
    'pl_bmasse': (0.01, 13000.0),      # Planet mass (Earth masses)
    'st_met': (-3.0, 1.0),             # Stellar metallicity [Fe/H]
    'st_logg': (0.0, 6.0),             # Stellar surface gravity
    'disc_year': (1990, 2030)          # Discovery year
}

VALID_STELLAR_TYPES = ['F', 'G', 'K', 'M', 'Other']
VALID_PLANET_TYPES = ['jupiter', 'neptune', 'rocky', 'super_earth']

def validate_input(data: Dict) -> Tuple[bool, str]:
    required_numerical = ['pl_orbper', 'pl_orbsmax', 'pl_bmasse', 
                          'st_met', 'st_logg', 'disc_year']
    
    for feature in required_numerical:
        if feature not in data:
            return False, f"Missing required parameter: {feature}"
        
        try:
            value = float(data[feature])
        except (ValueError, TypeError):
            return False, f"Parameter '{feature}' must be numeric, got: {data[feature]}"
        
        if feature in VALIDATION_RANGES:
            min_val, max_val = VALIDATION_RANGES[feature]
            if not (min_val <= value <= max_val):
                return False, f"Parameter '{feature}' must be between {min_val} and {max_val}, got: {value}"
    
    if 'st_type' not in data:
        return False, "Missing required parameter: st_type"
    
    if data['st_type'] not in VALID_STELLAR_TYPES:
        return False, f"Invalid st_type. Must be one of: {VALID_STELLAR_TYPES}"
    
    if 'pl_type' not in data:
        return False, "Missing required parameter: pl_type"
    
    if data['pl_type'] not in VALID_PLANET_TYPES:
        return False, f"Invalid pl_type. Must be one of: {VALID_PLANET_TYPES}"
    
    return True, "Valid"

def prepare_features(data: Dict) -> pd.DataFrame:
    features = {feat: 0.0 for feat in EXPECTED_FEATURES}
    
    features['pl_orbper'] = float(data['pl_orbper'])
    features['pl_orbsmax'] = float(data['pl_orbsmax'])
    features['pl_bmasse'] = float(data['pl_bmasse'])
    features['st_met'] = float(data['st_met'])
    features['st_logg'] = float(data['st_logg'])
    features['disc_year'] = float(data['disc_year'])
    
    st_type = data['st_type']
    features[f'st_type_category_{st_type}'] = 1.0
    
    pl_type = data['pl_type']
    features[f'pl_type_category_{pl_type}'] = 1.0
    
    df = pd.DataFrame([features])
    return df

def format_prediction_response(planet_name: str, probability: float, 
                               prediction: int) -> Dict:
    probability = float(probability)
    prediction = int(prediction)
    
    if probability >= 0.7:
        category = "High Priority"
        description = "Strong habitability candidate - recommend immediate spectroscopic follow-up"
    elif probability >= 0.4:
        category = "Medium Priority"
        description = "Moderate habitability potential - consider for future observations"
    elif probability >= 0.2:
        category = "Low Priority"
        description = "Low habitability likelihood - deprioritize for follow-up"
    else:
        category = "Not Habitable"
        description = "Very low habitability probability - not recommended for follow-up"
    
    return {
        "planet_name": planet_name,
        "habitability_prediction": {
            "is_habitable": prediction == 1,
            "probability": round(probability, 4),
            "score": round(probability * 100, 2),
            "category": category,
            "description": description
        },
        "confidence": {
            "level": "High" if abs(probability - 0.5) > 0.3 else "Medium" if abs(probability - 0.5) > 0.15 else "Low",
            "explanation": f"Model is {abs(probability - 0.5) * 200:.1f}% confident in this prediction"
        },
        "recommendation": {
            "observe": probability >= 0.4,
            "priority_rank": "Top 10%" if probability >= 0.8 else "Top 25%" if probability >= 0.6 else "Top 50%" if probability >= 0.4 else "Low"
        }
    }

def load_ranking_data(csv_path: str = "outputs/habitability_ranking_final.csv") -> pd.DataFrame:
    try:
        df = pd.read_csv(csv_path)
        return df
    except FileNotFoundError:
        return pd.DataFrame()

def get_example_inputs() -> List[Dict]:
    return [
        {
            "planet_name": "Example Exoplanet 1",
            "pl_orbper": 365.25,
            "pl_orbsmax": 1.0,
            "pl_bmasse": 1.0,
            "st_met": 0.0,
            "st_logg": 4.44,
            "disc_year": 2024,
            "st_type": "G",
            "pl_type": "rocky"
        },
        {
            "planet_name": "Hot Jupiter",
            "pl_orbper": 3.5,
            "pl_orbsmax": 0.05,
            "pl_bmasse": 300.0,
            "st_met": -0.2,
            "st_logg": 4.5,
            "disc_year": 2023,
            "st_type": "K",
            "pl_type": "jupiter"
        },
        {
            "planet_name": "Cold Super-Earth",
            "pl_orbper": 730.0,
            "pl_orbsmax": 1.5,
            "pl_bmasse": 5.0,
            "st_met": 0.1,
            "st_logg": 4.3,
            "disc_year": 2025,
            "st_type": "G",
            "pl_type": "super_earth"
        }
    ]