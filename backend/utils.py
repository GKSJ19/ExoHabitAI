"""
ExoHabitAI Backend Utilities
Helper functions for input validation, preprocessing, and feature management
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Any


def get_feature_names() -> List[str]:
    """
    Returns the expected feature names for the model
    These match the features from X_train_final.csv used in MLDP4
    
    Returns:
        List of 38 feature names in correct order
    """
    return [
        'pl_dens',      # Planet Density
        'pl_bmasse',    # Planet Mass
        'pl_ratdor',    # Planet-Star Distance Ratio
        'st_logg',      # Stellar Surface Gravity
        'st_dens',      # Stellar Density
        'pl_rvamp',     # Radial Velocity Amplitude
        'st_lum',       # Stellar Luminosity
        'sy_bmag',      # System B Magnitude
        'pl_ratror',    # Planet-Star Radius Ratio
        'pl_orbincl',   # Orbital Inclination
        'st_met',       # Stellar Metallicity
        'st_mass',      # Stellar Mass
        'pl_trandep',   # Transit Depth
        'st_rad',       # Stellar Radius
        'pl_orbper',    # Orbital Period
        'dec',          # Declination
        'pl_imppar',    # Impact Parameter
        'glat',         # Galactic Latitude
        'pl_trandur',   # Transit Duration
        'pl_tranmid',   # Transit Midpoint
        'sy_pmra',      # Proper Motion RA
        'sy_w4mag',     # WISE W4 Magnitude
        'st_age',       # Stellar Age
        'sy_pm',        # Proper Motion
        'rowid',        # Row ID
        'pl_orbsmax',   # Semi-Major Axis
        'sy_pmdec',     # Proper Motion Dec
        'glon',         # Galactic Longitude
        'ra',           # Right Ascension
        'elon',         # Ecliptic Longitude
        'rv_flag',      # RV Flag
        'st_teff',      # Stellar Temperature
        'pl_nnotes',    # Number of Notes
        'sy_plx',       # Parallax
        'pl_ntranspec', # Number of Transit Spectra
        'pl_orblper',   # Longitude of Periastron
        'tran_flag',    # Transit Flag
        'pl_insol.1',   # Insolation Flux
        'pl_orbeccen.1' # Orbital Eccentricity
    ]


def validate_input_features(data: Dict[str, Any], expected_features: List[str]) -> Dict[str, Any]:
    """
    Validates that input data contains all required features
    
    Args:
        data: Dictionary of input features
        expected_features: List of expected feature names
    
    Returns:
        Dictionary with 'valid' boolean and 'errors' list
    """
    errors = []
    missing_features = []
    invalid_types = []
    
    # Check for missing features
    for feature in expected_features:
        if feature not in data:
            missing_features.append(feature)
    
    # Check for invalid data types
    for feature, value in data.items():
        if feature in expected_features:
            try:
                float(value)  # Attempt conversion to float
            except (ValueError, TypeError):
                invalid_types.append({
                    "feature": feature,
                    "value": value,
                    "message": "Must be numeric"
                })
    
    if missing_features:
        errors.append({
            "type": "missing_features",
            "count": len(missing_features),
            "features": missing_features[:10]  # Limit to first 10 for readability
        })
    
    if invalid_types:
        errors.append({
            "type": "invalid_types",
            "count": len(invalid_types),
            "details": invalid_types[:10]
        })
    
    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "feature_count": len(data),
        "expected_count": len(expected_features)
    }


def preprocess_input(data: Dict[str, Any], expected_features: List[str]) -> pd.DataFrame:
    """
    Converts input dictionary to properly formatted DataFrame for model prediction
    
    Args:
        data: Dictionary of exoplanet features
        expected_features: List of feature names in correct order
    
    Returns:
        pandas DataFrame with features in correct order
    """
    # Extract values in the correct order
    feature_values = []
    for feature in expected_features:
        value = data.get(feature, 0.0)  # Default to 0 if missing (though validation should catch this)
        try:
            feature_values.append(float(value))
        except (ValueError, TypeError):
            feature_values.append(0.0)
    
    # Create DataFrame with proper column names
    input_df = pd.DataFrame([feature_values], columns=expected_features)
    
    return input_df


def validate_numeric_range(value: float, feature_name: str, min_val: float = None, max_val: float = None) -> bool:
    """
    Validates that a numeric value is within acceptable range
    
    Args:
        value: The value to validate
        feature_name: Name of the feature (for error messages)
        min_val: Minimum acceptable value
        max_val: Maximum acceptable value
    
    Returns:
        Boolean indicating if value is valid
    """
    if min_val is not None and value < min_val:
        return False
    if max_val is not None and value > max_val:
        return False
    return True


def generate_example_input() -> Dict[str, float]:
    """
    Generates an example input payload for API testing
    Based on the first row of X_train_final.csv
    
    Returns:
        Dictionary with sample exoplanet features
    """
    features = get_feature_names()
    sample_values = [
        -0.0479123235603631, 1.9605210979486356, -0.2377153667854853,
        -0.3338401106267973, -0.014134493077225, 0.7662883685938816,
        0.2962708708810992, 0.5589383179631265, 0.0663162126307991,
        -0.1797876623662277, 1.4038614217536152, 0.9303239988613824,
        -0.0119911003527919, 0.9484923508057548, -0.0230479712726176,
        0.6336760149478631, 0.0472226166416694, 0.1460314110179414,
        -0.1718501628939176, -0.5775514899492832, -0.0152668455026976,
        0.2692162812500556, -0.1512528293251527, -0.2281500377696284,
        0.6221396985957474, -0.352608826602341, 0.0598509644369646,
        -0.5759519906344511, 0.6287115997623113, 0.6796302483648,
        1.323209841632241, 0.7791822470736846, 0.119858632909846,
        -0.2986127438364163, -0.1117744925714188, -0.1962730692204141,
        0.508367343094277, -0.2163941348824767, 0.5842608780254737
    ]
    
    return dict(zip(features, sample_values))


def format_prediction_response(probability: float, threshold: float, planet_id: str = None) -> Dict[str, Any]:
    """
    Formats prediction results into standardized response structure
    
    Args:
        probability: Model prediction probability
        threshold: Classification threshold
        planet_id: Optional planet identifier
    
    Returns:
        Formatted response dictionary
    """
    prediction = 1 if probability >= threshold else 0
    
    return {
        "prediction_result": "Habitable" if prediction == 1 else "Non-Habitable",
        "confidence_score": float(np.round(probability, 4)),
        "threshold_used": threshold,
        "planet_id": planet_id or "Unknown",
        "binary_prediction": prediction
    }


def calculate_confidence_level(probability: float) -> str:
    """
    Converts probability score to human-readable confidence level
    
    Args:
        probability: Prediction probability (0-1)
    
    Returns:
        Confidence level string
    """
    if probability >= 0.9:
        return "Very High"
    elif probability >= 0.7:
        return "High"
    elif probability >= 0.5:
        return "Moderate"
    elif probability >= 0.3:
        return "Low"
    else:
        return "Very Low"


def sanitize_input(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sanitizes input data to prevent injection attacks
    
    Args:
        data: Raw input dictionary
    
    Returns:
        Sanitized dictionary with only numeric values
    """
    sanitized = {}
    for key, value in data.items():
        if isinstance(key, str) and len(key) <= 50:  # Reasonable key length
            try:
                sanitized[key] = float(value)
            except (ValueError, TypeError):
                continue
    return sanitized


def get_feature_descriptions() -> Dict[str, str]:
    """
    Returns human-readable descriptions for each feature
    Useful for API documentation and frontend tooltips
    
    Returns:
        Dictionary mapping feature names to descriptions
    """
    return {
        'pl_dens': 'Planet Density (g/cm³)',
        'pl_bmasse': 'Planet Mass (Earth masses)',
        'pl_ratdor': 'Planet-Star Distance Ratio',
        'st_logg': 'Stellar Surface Gravity (log10(cm/s²))',
        'st_dens': 'Stellar Density (g/cm³)',
        'pl_rvamp': 'Radial Velocity Semi-Amplitude (m/s)',
        'st_lum': 'Stellar Luminosity (Solar units)',
        'sy_bmag': 'System B-band Magnitude',
        'pl_ratror': 'Planet-to-Star Radius Ratio',
        'pl_orbincl': 'Orbital Inclination (degrees)',
        'st_met': 'Stellar Metallicity [Fe/H]',
        'st_mass': 'Stellar Mass (Solar masses)',
        'pl_trandep': 'Transit Depth (percentage)',
        'st_rad': 'Stellar Radius (Solar radii)',
        'pl_orbper': 'Orbital Period (days)',
        'dec': 'Declination (degrees)',
        'pl_imppar': 'Impact Parameter',
        'glat': 'Galactic Latitude (degrees)',
        'pl_trandur': 'Transit Duration (hours)',
        'pl_tranmid': 'Transit Midpoint (JD)',
        'sy_pmra': 'Proper Motion in RA (mas/yr)',
        'sy_w4mag': 'WISE W4-band Magnitude',
        'st_age': 'Stellar Age (Gyr)',
        'sy_pm': 'Total Proper Motion (mas/yr)',
        'rowid': 'Database Row Identifier',
        'pl_orbsmax': 'Semi-Major Axis (AU)',
        'sy_pmdec': 'Proper Motion in Dec (mas/yr)',
        'glon': 'Galactic Longitude (degrees)',
        'ra': 'Right Ascension (degrees)',
        'elon': 'Ecliptic Longitude (degrees)',
        'rv_flag': 'Radial Velocity Detection Flag',
        'st_teff': 'Stellar Effective Temperature (K)',
        'pl_nnotes': 'Number of Measurement Notes',
        'sy_plx': 'Parallax (mas)',
        'pl_ntranspec': 'Number of Transit Spectra',
        'pl_orblper': 'Longitude of Periastron (degrees)',
        'tran_flag': 'Transit Detection Flag',
        'pl_insol.1': 'Insolation Flux (Earth units)',
        'pl_orbeccen.1': 'Orbital Eccentricity'
    }
