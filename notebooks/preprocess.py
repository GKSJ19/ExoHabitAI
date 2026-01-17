import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

#--------Loading dataset-----------
df = pd.read_csv(
    "dataset.csv",
    sep=",",
    comment="#",
    engine="python",
    on_bad_lines="skip"
)
# print(df.shape)   #Here, columns->289

#------------checking missing values---------------
# print(df.isnull().sum())

#--------------Visualize missing values (Heatmap)------------
sns.heatmap(df.isnull(), cbar=False)
plt.show() # Black lines show the presence of values where as beige lines show missing values


#----------------------- Checking duplicates
# print(df.duplicated().sum())-> No duplicates found, hence output is 0

# Removing the unnecessary columns columns: 289->12
df = df[
    [
        "pl_name",
        "hostname",
        "pl_rade",
        "pl_bmasse",
        "pl_orbper",
        "pl_orbsmax",
        "pl_eqt",
        "pl_dens",
        "st_teff",
        "st_lum",
        "st_met",
        "st_spectype"
    ]
]
# print(df.shape)   #Now, columns->12



#---------------------Renaming columns----------------
df.columns = [
    "Planet name",
    "Host Name",
    "Planet radius",
    "Planet mass",
    "Orbital period",
    "Semi-major axis",
    "Equilibrium temperature",
    "Planet density",
    "Host star temperature",
    "Star luminosity",
    "Star metallicity",
    "Star type"
]
# print(df.head())

#-------------------Data Quality Assessment-----------------
# Remove completely empty rows
df = df.dropna(how="all")

#Fill numeric columns with median
numeric_cols = df.select_dtypes(include="number").columns
for col in numeric_cols:
    df[col] = df[col].fillna(df[col].median())


#Fill categorical columns with mode (star type)
df["Star type"] = df["Star type"].fillna(
    df["Star type"].mode()[0]
)

#Outlier Detection (Removing Physically Impossible Values)
df = df[df["Planet radius"] > 0]
df = df[df["Equilibrium temperature"] > 0]
df = df[df["Planet mass"] > 0]

#IQR
Q1 = df["Planet radius"].quantile(0.25)
Q3 = df["Planet radius"].quantile(0.75)
IQR = Q3 - Q1

df = df[
    (df["Planet radius"] >= Q1 - 1.5*IQR) &
    (df["Planet radius"] <= Q3 + 1.5*IQR)
]
# Unit Standardization: (Already in Earth units, so no changes needed)

#Categorical Encoding: One-hot encoding for star type
# Reduce star type to main spectral class (G, K, M, F, A, etc.)
df["Star type"] = df["Star type"].astype(str).str[0]

# One-hot encode the reduced star type
df = pd.get_dummies(
    df,
    columns=["Star type"],
    prefix="Star type",
    drop_first=True
)

# print(df.head())
# print(df.shape)

#--------------Feature Engineering:--------------
# 1.Habitability Score
df["habitability_score"] = (
    (1 / abs(df["Equilibrium temperature"] - 288)) +
    (1 / abs(df["Planet radius"] - 1)) +
    (1 / df["Semi-major axis"])
)

# Orbital Stability Factor
df["orbital_stability"] = df["Orbital period"] / df["Semi-major axis"]



#------- Feature Scaling: Standardization-----------
import numpy as np
from sklearn.preprocessing import StandardScaler

# Select ONLY continuous numeric columns (exclude bools)
numeric_cols = df.select_dtypes(include=["float64", "int64"]).columns

# Replace infinities (from feature engineering) with NaN
df[numeric_cols] = df[numeric_cols].replace([np.inf, -np.inf], np.nan)

# Fill NaNs using median (safe for scientific data)
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

# Apply standard scaling
scaler = StandardScaler()
df[numeric_cols] = scaler.fit_transform(df[numeric_cols])


#Saving the cleaned dataset
df.to_csv("preprocessed.csv", index=False)

