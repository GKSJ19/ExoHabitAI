import pandas as pd
import joblib
from pathlib import Path

project_root = Path(__file__).parent.parent
model_path = project_root / "models" / "final_model_scientific.pkl"
data_path = project_root / "data" / "processed" / "exoplanet_tess_processed.csv"
output_path = project_root / "data" / "processed" / "habitability_ranking_final.csv"
output_path.parent.mkdir(parents=True, exist_ok=True)

print("Loading data and model...")
df = pd.read_csv(data_path)
model = joblib.load(model_path)

# Prepare features
EXCLUDED = [
    'pl_name', 'habitable_candidate', 'star_system',
    'pl_insol', 'pl_eqt', 'pl_rade', 'pl_orbeccen', 'st_teff',
    'st_rad', 'st_mass', 'pl_density', 'tidal_heating_indicator',
    'flux_variation', 'escape_velocity_factor',
    'habitability_score_index', 'stellar_compatibility_index',
    'hz_conservative', 'hz_optimistic',
    'st_type_category', 'pl_type_category'
]

feature_cols = [col for col in df.columns if col not in EXCLUDED]
X = df[feature_cols].copy()

# Remove object columns
obj_cols = X.select_dtypes(include=['object']).columns
X = X.drop(columns=obj_cols)

# Convert bools to int
bool_cols = X.select_dtypes(include=['bool']).columns
X[bool_cols] = X[bool_cols].astype(int)

# Handle missing values
X = X.fillna(X.median())

print(f"Predicting for {len(X)} planets...")
probabilities = model.predict_proba(X)[:, 1]
predictions = model.predict(X)

# Create ranking
ranking = pd.DataFrame({
    'rank': 0,
    'planet_name': df['pl_name'].values,
    'star_system': df['pl_name'].str.replace(r'\s+[a-z]$', '', regex=True, case=False).values,
    'habitability_probability': probabilities,
    'habitability_score': probabilities * 100,
    'predicted_habitable': predictions,
    'actual_label': df['habitable_candidate'].values,
    'discovery_year': df['disc_year'].values if 'disc_year' in df.columns else 2024
})

ranking = ranking.sort_values('habitability_probability', ascending=False).reset_index(drop=True)
ranking['rank'] = ranking.index + 1

ranking.to_csv(output_path, index=False)
print(f" Saved {len(ranking)} ranked planets to {output_path}")
print(f"\nTop 5 planets:")
print(ranking.head(5)[['rank', 'planet_name', 'habitability_probability']])