import os
import pandas as pd
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "exoplanet_ml_ready.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "habitability_model.pkl")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "habitability_ranked.csv")

print("🔍 Loading dataset...")
df = pd.read_csv(DATA_PATH)
print("📊 Dataset shape:", df.shape)

FEATURES = [
    "pl_rade", "pl_bmasse", "pl_orbper", "pl_eqt",
    "pl_dens", "st_teff", "st_rad", "st_mass", "st_lum"
]
X = df[FEATURES]

print("🤖 Loading trained model...")
model = joblib.load(MODEL_PATH)

print("📈 Predicting habitability scores...")
df["habitability_score"] = model.predict_proba(X)[:, 1]

df["rank"] = df["habitability_score"].rank(
    method="dense",
    ascending=False
).astype(int)

df_sorted = df.sort_values(by="habitability_score", ascending=False)

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
df_sorted.to_csv(OUTPUT_PATH, index=False)

print("✅ Habitability ranking completed")
print("💾 Saved to:", OUTPUT_PATH)

print("\n🌍 Top 5 Most Habitable Exoplanets:")
print(df_sorted.head())
