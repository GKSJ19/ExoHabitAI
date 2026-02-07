import pandas as pd
import numpy as np
import os

# Load raw dataset
df = pd.read_csv("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/data/raw/exoplanet(2).csv")

print("Initial Shape:", df.shape)

# Convert Mass to Earth masses
df["planet_mass"] = df.apply(
    lambda x: x["mass_multiplier"] * 317.8 if x["mass_wrt"] == "Jupiter" else x["mass_multiplier"],
    axis=1
)

# Convert Radius to Earth radii
df["planet_radius"] = df.apply(
    lambda x: x["radius_multiplier"] * 11.2 if x["radius_wrt"] == "Jupiter" else x["radius_multiplier"],
    axis=1
)

# Keep useful columns
df = df[[
    "planet_mass",
    "planet_radius",
    "orbital_radius",
    "orbital_period",
    "eccentricity",
    "stellar_magnitude",
    "planet_type"
]]

# Fill missing numeric values
for col in df.select_dtypes(include=np.number).columns:
    df[col] = df[col].fillna(df[col].median())

# Encode planet type
df = pd.get_dummies(df, columns=["planet_type"], drop_first=True)

# ---------------- FEATURE ENGINEERING ---------------- #

# Approx equilibrium temperature (K)
df["equilibrium_temp"] = 278 / np.sqrt(df["orbital_radius"])

# Density
df["planet_density"] = df["planet_mass"] / (df["planet_radius"] ** 3)

# Orbital stability
df["orbital_stability"] = 1 / df["orbital_period"]

# ---------------- TARGET ---------------- #

df["habitable"] = (
    (df["planet_radius"] < 2) &
    (df["equilibrium_temp"].between(200, 350)) &
    (df["orbital_radius"].between(0.5, 2))
).astype(int)

print("\nHabitability Distribution:")
print(df["habitable"].value_counts())

if df["habitable"].nunique() < 2:
    raise Exception("Only single class — adjust thresholds.")

# ---------------- Scaling ---------------- #

from sklearn.preprocessing import StandardScaler

features = df.drop("habitable", axis=1)
target = df["habitable"]

scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

df_final = pd.DataFrame(features_scaled, columns=features.columns)
df_final["habitable"] = target.values

# Save
os.makedirs("data/preprocessed", exist_ok=True)
df.to_csv("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/data/processed/reprocessed.csv", index=False)

print("\nSaved → data/preprocessed/preprocessed.csv")
print("Final Shape:", df.shape)
