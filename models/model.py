import os
import pandas as pd
import joblib
import numpy as np

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
from imblearn.over_sampling import SMOTE   
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "exoplanet_ml_ready.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "habitability_model.pkl")

print(" Debug: model.py started")
print(" Project root directory:", BASE_DIR)
print(" Loading dataset from:", INPUT_PATH)

df = pd.read_csv(INPUT_PATH)
print(" Dataset loaded:", df.shape)

TARGET = "habitable"

X = df.drop(columns=TARGET)
y = df[TARGET]

print("\n Class distribution before balancing:")
print(y.value_counts())


X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.25,
    random_state=42,
    stratify=y
)
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

print("\n Class distribution after SMOTE:")
print(pd.Series(y_train_resampled).value_counts())
noise = np.random.normal(0, 0.01, X_train_resampled.shape)
X_train_noisy = X_train_resampled + noise

model = RandomForestClassifier(
    n_estimators=150,
    max_depth=6,
    min_samples_leaf=3,
    class_weight="balanced",
    random_state=42
)

model.fit(X_train_noisy, y_train_resampled)
print("\n Model training completed")
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]
accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_proba)
print(f"\n Accuracy: {accuracy:.4f}")
print(f" ROC-AUC Score: {roc_auc:.4f}")
print("\n Classification Report:")
print(classification_report(y_test, y_pred))
print("\n Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
cv_scores = cross_val_score(model, X, y, cv=5)
print("\n Cross Validation Accuracy:", cv_scores.mean())
os.makedirs(MODEL_DIR, exist_ok=True)
joblib.dump(model, MODEL_PATH)

print(f"\n Model saved at: {MODEL_PATH}")
