import pandas as pd

REQUIRED_FEATURES = [
    "Planet radius",
    "Planet mass",
    "Orbital period",
    "Semi-major axis",
    "Planet density",
    "Host star temperature",
    "Star luminosity",
    "Star metallicity",
    "habitability_score",
    "orbital_stability",
    "Star type"
]

def validate_input(data):
    if not data:
        return False, "No input data provided"

    missing = [f for f in REQUIRED_FEATURES if f not in data]
    if missing:
        return False, f"Missing parameters: {missing}"

    try:
        # Create DataFrame with correct column names
        df = pd.DataFrame([data], columns=REQUIRED_FEATURES)
    except Exception as e:
        return False, str(e)

    return True, df



def rank_exoplanets(planets, model):
    """
    Ranks multiple exoplanets based on habitability score.
    """
    ranked_planets = []

    for planet in planets:
        valid, result = validate_input(planet)
        if valid:
            probability = model.predict_proba(result)[0][1]
            planet_copy = planet.copy()
            planet_copy["habitability_score"] = round(float(probability), 4)
            ranked_planets.append(planet_copy)

    ranked_planets.sort(
        key=lambda x: x["habitability_score"],
        reverse=True
    )

    return ranked_planets
