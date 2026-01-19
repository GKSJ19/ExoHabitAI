"""
Configuration file for exoplanet preprocessing pipeline.
Contains all constants, thresholds, and feature definitions.
"""

# ============================================
# FILE PATHS
# ============================================
RAW_DATA_PATH = "data/raw/exoplanet_tess_data.csv"
PROCESSED_DATA_PATH = "data/processed/exoplanet_tess_processed.csv"
REPORT_PATH = "data/processed/preprocessing_report.txt"

# ============================================
# FEATURE SELECTION
# ============================================
REQUIRED_FEATURES = [
    "pl_name",          # Planet name (identifier)
    "pl_orbper",        # Orbital period (days)
    "pl_orbsmax",       # Semi-major axis (AU)
    "pl_rade",          # Planet radius (Earth radii)
    "pl_bmasse",        # Planet mass (Earth masses)
    "pl_orbeccen",      # Orbital eccentricity
    "pl_insol",         # Insolation flux
    "pl_eqt",           # Equilibrium temperature (K)
    "st_teff",          # Stellar temperature (K)
    "st_rad",           # Stellar radius (Solar radii)
    "st_mass",          # Stellar mass (Solar masses)
    "st_met",           # Stellar metallicity [Fe/H]
    "st_logg",          # Stellar surface gravity
    "disc_year"         # Discovery year
]

# Critical features that cannot be missing
CRITICAL_FEATURES = ["pl_rade", "pl_insol", "pl_eqt", "st_teff"]

# Features that can be imputed
IMPUTABLE_FEATURES = ["pl_orbeccen", "st_met", "st_logg", "st_rad", "st_mass"]

# ============================================
# DATA VALIDATION THRESHOLDS
# ============================================
VALIDATION_RULES = {
    "pl_rade": {"min": 0.1, "max": 30.0},           # 0.1-30 Earth radii
    "pl_bmasse": {"min": 0.01, "max": 13000.0},     # Up to ~13 Jupiter masses
    "pl_orbper": {"min": 0.1, "max": 100000.0},     # 0.1 days to ~274 years
    "pl_orbsmax": {"min": 0.001, "max": 1000.0},    # 0.001-1000 AU
    "pl_orbeccen": {"min": 0.0, "max": 1.0},        # Eccentricity range
    "pl_insol": {"min": 0.001, "max": 100000.0},    # Wide insolation range
    "pl_eqt": {"min": 50, "max": 3000},             # 50-3000 K
    "st_teff": {"min": 2000, "max": 10000},         # Main sequence stars
    "st_rad": {"min": 0.1, "max": 100.0},           # 0.1-100 Solar radii
    "st_mass": {"min": 0.08, "max": 10.0},          # 0.08-10 Solar masses
    "st_logg": {"min": 0.0, "max": 6.0},            # Surface gravity range
}

# ============================================
# HABITABILITY CRITERIA
# ============================================
# Conservative Habitable Zone
CONSERVATIVE_HZ = {
    "pl_insol": (0.53, 0.9),           # Narrow insolation flux
    "pl_rade": (0.8, 1.5),              # Rocky planets only
    "pl_eqt": (250, 310),               # Near-Earth temperature
    "pl_orbeccen_max": 0.2,             # Very circular orbit
    "st_teff": (2600, 6500)             # Main sequence stars
}

# Standard Habitable Zone (recommended for ML)
STANDARD_HZ = {
    "pl_insol": (0.36, 1.11),           # Conservative to optimistic HZ
    "pl_rade": (0.5, 2.5),              # Include super-Earths
    "pl_eqt": (180, 320),               # Wider temperature range
    "pl_orbeccen_max": 0.3,             # Moderate eccentricity
    "st_teff": (2600, 6500)             # Main sequence stars
}

# Optimistic Habitable Zone
OPTIMISTIC_HZ = {
    "pl_insol": (0.25, 1.67),           # Extended HZ boundaries
    "pl_rade": (0.5, 2.5),              # Super-Earths
    "pl_eqt": (150, 350),               # Very wide temperature
    "pl_orbeccen_max": 0.5,             # Higher eccentricity allowed
    "st_teff": (2600, 6500)             # Main sequence stars
}

# ============================================
# MASS-RADIUS RELATIONSHIPS
# ============================================
# Used for estimating missing mass values
MASS_RADIUS_COEFFICIENTS = {
    "rocky": {"threshold": 1.5, "exponent": 3.7},       # Rocky planets
    "neptune": {"threshold": 4.0, "exponent": 2.06},    # Neptune-like
    "jupiter": {"threshold": 30.0, "base_mass": 317, "base_radius": 11.2, "exponent": 1.3}
}

# ============================================
# PLANET CLASSIFICATION
# ============================================
PLANET_TYPES = {
    "rocky": {"min": 0.0, "max": 1.5},              # Rocky planets
    "super_earth": {"min": 1.5, "max": 2.5},        # Super-Earths
    "neptune": {"min": 2.5, "max": 6.0},            # Neptune-like
    "jupiter": {"min": 6.0, "max": 30.0}            # Jupiter-like
}

# ============================================
# FEATURE ENGINEERING
# ============================================
# Derived features to create
DERIVED_FEATURES = [
    "pl_density",                    # Planet density
    "escape_velocity_factor",        # Atmosphere retention capability
    "tidal_heating_indicator",       # Tidal heating potential
    "flux_variation",                # Flux variation due to eccentricity
    "stellar_compatibility_index",   # Host star suitability
    "habitability_score_index"       # Overall habitability score
]

# ============================================
# ENCODING SETTINGS
# ============================================
# Stellar type classification (for one-hot encoding if needed)
STELLAR_TYPES = {
    "M": {"teff_min": 2400, "teff_max": 3700},      # Red dwarf
    "K": {"teff_min": 3700, "teff_max": 5200},      # Orange dwarf
    "G": {"teff_min": 5200, "teff_max": 6000},      # Yellow dwarf (Sun-like)
    "F": {"teff_min": 6000, "teff_max": 7500},      # Yellow-white dwarf
}

# ============================================
# PREPROCESSING PARAMETERS
# ============================================
# Random state for reproducibility
RANDOM_STATE = 42

# Outlier detection percentiles
OUTLIER_LOWER_PERCENTILE = 1
OUTLIER_UPPER_PERCENTILE = 99

# Missing value threshold (% allowed)
MAX_MISSING_THRESHOLD = 0.5  # Drop rows if >50% values missing

# ============================================
# LOGGING & REPORTING
# ============================================
VERBOSE = True  # Print detailed progress
GENERATE_REPORT = True  # Generate preprocessing report

# ============================================
# PHYSICAL CONSTANTS
# ============================================
EARTH_RADIUS = 6371  # km
EARTH_MASS = 5.972e24  # kg
EARTH_DENSITY = 5.51  # g/cm³
EARTH_EQ_TEMP = 255  # K (without atmosphere)
EARTH_SURFACE_TEMP = 288  # K (with atmosphere)
SOLAR_LUMINOSITY = 3.828e26  # W
AU_TO_KM = 1.496e8  # km