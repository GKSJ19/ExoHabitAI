import joblib
import pandas as pd
import numpy as np

# Load model
model = joblib.load("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/models/exohabit_model.pkl")

# Load training feature columns
df = pd.read_csv("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/data/processed/reprocessed.csv")
X_cols = df.drop("habitable", axis=1).columns.tolist()

# Create empty input with SAME columns
input_data = pd.DataFrame(np.zeros((1, len(X_cols))), columns=X_cols)

# Fill realistic Earth-like values ONLY if column exists
def safe_set(col, value):
    if col in input_data.columns:
        input_data[col] = value

safe_set("planet_radius", 1)
safe_set("planet_mass", 1)
safe_set("orbital_period", 365)
safe_set("orbital_radius", 1)
safe_set("eccentricity", 0.02)
safe_set("equilibrium_temp", 288)
safe_set("planet_density", 5.5)
safe_set("orbital_stability", 0.9)

# Predict
prediction = model.predict(input_data)[0]
prob = model.predict_proba(input_data)[0][1]

print("\nPlanet Status:", "HABITABLE 🌍" if prediction == 1 else "NOT HABITABLE ❌")
print("Habitability Probability:", round(prob * 100, 2), "%")
