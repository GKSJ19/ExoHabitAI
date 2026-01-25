# -*- coding: utf-8 -*-
print("🔥 Debug: model.py started")

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

INPUT_PATH = "data/exoplanet_ml_ready.csv"
MODEL_PATH = "models/habitability_model.pkl"

# Debug: current directory and data folder files
print("Current working directory:", os.getcwd())
print("Files in data folder:", os.listdir("data"))

print("📂 Loading ML-ready dataset...")
df = pd.read_csv(INPUT_PATH)
print("✅ Dataset loaded:", df.shape)

# Automatically take the last column as target
TARGET = df.columns[-1]
print(f"🎯 Using '{TARGET}' as target column")

X = df.drop(TARGET, axis=1)
y = df[TARGET]

print("📊 Splitting data into train and test sets...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("🧠 Training Random Forest Regressor...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print("📈 Evaluating model...")
y_pred = model.predict(X_test)
print("Mean Squared Error (MSE):", mean_squared_error(y_test, y_pred))
print("R2 Score:", r2_score(y_test, y_pred))

# Ensure models folder exists
os.makedirs("models", exist_ok=True)
print(f"💾 Saving trained model to {MODEL_PATH}...")
joblib.dump(model, MODEL_PATH)

print("🎉 Module 3 COMPLETED successfully!")
