import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INPUT_PATH = os.path.join(BASE_DIR, "data", "exoplanet_ml_ready.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "habitability_model.pkl")

print(" Project root directory:", BASE_DIR)
print(" Looking for dataset at:", INPUT_PATH)
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
data = pd.concat([X, y], axis=1).dropna()
X = data.drop(TARGET, axis=1)
y = data[TARGET]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
clf = RandomForestClassifier(n_estimators=200, max_depth=5, class_weight="balanced", random_state=42)
clf.fit(X_train, y_train)
print(" Model training completed")
y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {acc:.3f}")
print(classification_report(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
os.makedirs(MODEL_DIR, exist_ok=True)
joblib.dump(clf, MODEL_PATH)
print(f" Model saved at: {MODEL_PATH}")
