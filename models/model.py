import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INPUT_PATH = os.path.join(BASE_DIR, "data", "exoplanet_ml_ready.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "habitability_model.pkl")

print(" Project root directory:", BASE_DIR)
print(" Looking for dataset at:", INPUT_PATH)
print(" Loading ML-ready dataset...")
df = pd.read_csv(INPUT_PATH, comment="#")

print(" Dataset loaded:", df.shape)
print(" Columns:", list(df.columns))
if df.shape[1] < 2:
    raise ValueError(" Dataset must have at least 2 columns (features + target)")
TARGET = df.columns[-1]
print(f" Target column selected: {TARGET}")

X = df.drop(TARGET, axis=1)
y = df[TARGET]
X = X.apply(pd.to_numeric, errors="coerce")
y = pd.to_numeric(y, errors="coerce")

# Drop missing values
data = pd.concat([X, y], axis=1).dropna()
X = data.drop(TARGET, axis=1)
y = d

