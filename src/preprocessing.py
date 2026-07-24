# preprocessing.py
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_PATH = os.path.join(BASE_DIR, "data", "exoplanet_data_cleaned.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "exoplanet_ml_ready.csv")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

FEATURES = [
    "pl_rade", "pl_bmasse", "pl_orbper", "pl_eqt",
    "pl_dens", "st_teff", "st_rad", "st_mass", "st_lum"
]

df = pd.read_csv(INPUT_PATH)

for col in FEATURES:
    if col in df.columns:
        df[f"{col}_original"] = df[col]

df["habitable"] = (
    (df["pl_eqt"] >= 200) & (df["pl_eqt"] <= 320) &
    (df["pl_rade"] >= 0.5) & (df["pl_rade"] <= 1.6)
).astype(int)

print(" Habitable label distribution:")
print(df["habitable"].value_counts())

numeric_features = [f for f in FEATURES if f in df.columns]
df[numeric_features] = df[numeric_features].fillna(df[numeric_features].median())

scaler = StandardScaler()
df_scaled = scaler.fit_transform(df[numeric_features])
df[numeric_features] = df_scaled

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
df.to_csv(OUTPUT_PATH, index=False)

os.makedirs(os.path.dirname(SCALER_PATH), exist_ok=True)
joblib.dump(scaler, SCALER_PATH)

print("✅ ML-ready dataset saved:", OUTPUT_PATH)
print("✅ Scaler saved:", SCALER_PATH)