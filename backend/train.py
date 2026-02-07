import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Load preprocessed data
df = pd.read_csv("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/data/processed/reprocessed.csv")

print("Loaded Shape:", df.shape)

# Split X & y
X = df.drop("habitable", axis=1)
y = df["habitable"]

print("\nClass Distribution:")
print(y.value_counts())

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Model
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Metrics
print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# Save model
os.makedirs("models", exist_ok=True)

joblib.dump(model, "C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/models/exohabit_model.pkl")

print("\nModel saved → models/exohabit_model.pkl")
