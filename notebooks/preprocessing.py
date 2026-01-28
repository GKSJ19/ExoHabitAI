import pandas as pd
from sklearn.preprocessing import StandardScaler

INPUT_PATH = "data/exoplanet_data_cleaned.csv"
OUTPUT_PATH = "data/exoplanet_ml_ready.csv"

FEATURES = [
    "pl_rade",
    "pl_bmasse",
    "pl_orbper",
    "pl_eqt",
    "pl_dens",
    "st_teff",
    "st_rad",
    "st_mass",
    "st_lum"
]

print(" Loading cleaned dataset...")
df = pd.read_csv(INPUT_PATH)
print(" Dataset loaded:", df.shape)

FEATURES = [f for f in FEATURES if f in df.columns]
print(" Selected features:", FEATURES)

df = df[FEATURES]

print(" Filling missing values with median...")
df = df.fillna(df.median())

print(" Scaling features...")
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df)

pd.DataFrame(df_scaled, columns=FEATURES).to_csv(
    OUTPUT_PATH, index=False
)

print(" ML-ready dataset saved to:", OUTPUT_PATH)
print(" COMPLETED successfully!")



