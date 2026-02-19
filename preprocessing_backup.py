import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.preprocessing import StandardScaler

print("Starting preprocessing...")

# Paths
INPUT_PATH = "data/raw/dataset_NASA.csv"
OUTPUT_PATH = "data/processed/preprocessed.csv"

# Load dataset
df = pd.read_csv(INPUT_PATH, low_memory=False)
print("Loaded shape:", df.shape)
plt.figure(figsize=(12,6))
sns.heatmap(df.isnull(), cbar=False)
plt.title("Missing Values Heatmap")
plt.show()

# ----------------------------
# Basic Cleaning
# ----------------------------

# Remove duplicates
df.drop_duplicates(inplace=True)

# Fill missing numeric values
num_cols = df.select_dtypes(include=np.number).columns
df[num_cols] = df[num_cols].fillna(df[num_cols].median())

# Fill missing categorical values
cat_cols = df.select_dtypes(include="object").columns
for col in cat_cols:
    df[col] = df[col].fillna("Unknown")

print("After cleaning:", df.shape)
# Unit Conversion

if "pl_radj" in df.columns:   # Jupiter radius → Earth
    df["pl_rade"] = df["pl_radj"] * 11.21

if "pl_bmassj" in df.columns: # Jupiter mass → Earth
    df["pl_bmasse"] = df["pl_bmassj"] * 317.8

if "pl_eqt" in df.columns:    # already Kelvin
    df["temp_K"] = df["pl_eqt"]

# ----------------------------
# Feature Engineering
# ----------------------------

# Habitability score (if columns exist)
if all(c in df.columns for c in ["pl_eqt", "pl_rade", "pl_orbsmax"]):

    df["habitability_score"] = (
        1 / (abs(df["pl_eqt"] - 288) + 1) +
        1 / (abs(df["pl_rade"] - 1) + 1) +
        1 / (abs(df["pl_orbsmax"] - 1) + 1)
    )

    print("Habitability score added.")
# Stellar Compatibility

if all(c in df.columns for c in ["st_teff", "st_rad"]):
    df["stellar_index"] = (
        1 / (abs(df["st_teff"] - 5778) + 1) +
        1 / (abs(df["st_rad"] - 1) + 1)
    )

# Orbital Stability

if all(c in df.columns for c in ["pl_orbper", "pl_orbsmax"]):
    df["orbital_stability"] = (
        1 / (df["pl_orbper"] + 1) +
        1 / (df["pl_orbsmax"] + 1)
    )

# IQR Outlier Removal

num_cols = df.select_dtypes(include=np.number).columns

for col in num_cols:
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1

    low = Q1 - 1.5 * IQR
    high = Q3 + 1.5 * IQR

    df = df[(df[col] >= low) & (df[col] <= high)]

# ----------------------------
# Encoding
# ----------------------------

df = pd.get_dummies(df, drop_first=True, sparse=True)

print("After encoding:", df.shape)

# ----------------------------
# Scaling (SAFE)
# ----------------------------

num_cols = df.select_dtypes(include=np.number).columns

if len(num_cols) > 0 and len(df) > 0:

    scaler = StandardScaler(with_mean=False)
    df[num_cols] = scaler.fit_transform(df[num_cols])

    print("Scaling applied.")

else:
    print("⚠️ Skipped scaling (no data).")

# ----------------------------
# Target Column
# ----------------------------

if "habitability_score" in df.columns:

    df["habitable"] = np.where(
        df["habitability_score"] > df["habitability_score"].median(),
        1,
        0
    )

    print("Target column added.")
keep_cols = [
    "pl_rade", "pl_bmasse", "pl_orbper", "pl_orbsmax",
    "pl_eqt", "pl_dens", "st_teff", "st_lum", "st_met", "st_spectype",
    "habitability_score", "stellar_index", "orbital_stability", "habitable"
]

df = df[[c for c in keep_cols if c in df.columns]]

# ----------------------------
# Save
# ----------------------------

df.to_csv(OUTPUT_PATH, index=False)

print("DONE!")
print("Saved to:", OUTPUT_PATH)
print("Final shape:", df.shape)
