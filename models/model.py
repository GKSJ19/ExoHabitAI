import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "exoplanet_ml_ready.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "habitability_model.pkl")

print(" Debug: model.py started")
print(" Project root directory:", BASE_DIR)
print(" Loading ML-ready dataset from:", INPUT_PATH)


df = pd.read_csv(INPUT_PATH)
print(" Dataset loaded:", df.shape)

TARGET = "habitable"

X = df.drop(columns=TARGET)
y = df[TARGET]


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=5,
    class_weight="balanced",
    random_state=42
)

model.fit(X_train, y_train)
print(" Model training completed")


y_pred = model.predict(X_test)
print(f" Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(classification_report(y_test, y_pred))
print(" Confusion Matrix:\n", confusion_matrix(y_test, y_pred))


os.makedirs(MODEL_DIR, exist_ok=True)
joblib.dump(model, MODEL_PATH)
print(f" Model saved at: {MODEL_PATH}")
