import pandas as pd
import numpy as np

# Force load file (ignore bad lines)
df = pd.read_csv(
    "data/processed/preprocessed.csv",
    sep=",",
    engine="python",
    on_bad_lines="skip"
)

print("Loaded shape:", df.shape)

# Keep only numeric columns
df = df.select_dtypes(include=[np.number])

print("Numeric only:", df.shape)

# Keep first 3 useful columns
df = df.iloc[:, :3]

df.columns = ["pl_eqt", "pl_rade", "pl_orbsmax"]

# Drop missing values
df = df.dropna()

# Create habitability score
df["habitability_score"] = (
    1/(abs(df["pl_eqt"]-288)+1) +
    1/(abs(df["pl_rade"]-1)+1) +
    1/(abs(df["pl_orbsmax"]-1)+1)
)

# Binary label
median = df["habitability_score"].median()

df["habitable"] = np.where(
    df["habitability_score"] > median, 1, 0
)

# Save clean ML file
df.to_csv("data/processed/exohabit_ml.csv", index=False)

print("SUCCESS: exohabit_ml.csv created")
