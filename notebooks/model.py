import os
import pandas as pd
import joblib
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "exoplanet_ml_ready.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "habitability_model.pkl")

print(" Debug: model.py started")
print(" Project root directory:", BASE_DIR)
print("Loading ML-ready dataset from:", INPUT_PATH)


df = pd.read_csv(INPUT_PATH)
print(" Dataset loaded:", df.shape)

TARGET = "habitable"

X = df.drop(columns=TARGET)
y = df[TARGET]


X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.25,          # slightly larger test set
    random_state=42,
    stratify=y
)


noise = np.random.normal(0, 0.01, X_train.shape)
X_train_noisy = X_train + noise
model = RandomForestClassifier(
    n_estimators=100,        
    max_depth=4,             
    min_samples_leaf=5,      
    class_weight="balanced",
    random_state=42
)
model.fit(X_train_noisy, y_train)
print(" Model training completed")
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"\n Accuracy: {accuracy:.3f}\n")

print(" Classification Report:")
print(classification_report(y_test, y_pred))

print(" Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
os.makedirs(MODEL_DIR, exist_ok=True)
joblib.dump(model, MODEL_PATH)

print(f"\n Model saved at: {MODEL_PATH}")
