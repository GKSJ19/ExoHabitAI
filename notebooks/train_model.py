import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score


# ============================
# 1. Load Raw Preprocessed File
# ============================

data = pd.read_csv("data/processed/exohabit_ml.csv")


print("Initial shape:", data.shape)


# ============================
# 2. Keep Only Useful Columns
# ============================



print("After cleaning:", data.shape)


# ============================
# 3. Create Habitability Score
# ============================

data["habitability_score"] = (
    1 / (abs(data["pl_eqt"] - 288) + 1) +
    1 / (abs(data["pl_rade"] - 1) + 1) +
    1 / (abs(data["pl_orbsmax"] - 1) + 1)
)


# ============================
# 4. Create Binary Target
# ============================

median = data["habitability_score"].median()

data["habitable"] = np.where(
    data["habitability_score"] > median, 1, 0
)


# ============================
# 5. Save Clean ML Dataset
# ============================

data.to_csv("data/processed/exohabit_ml.csv", index=False)

print("ML dataset saved")


# ============================
# 6. Prepare X and y
# ============================

X = data.drop(["habitability_score", "habitable"], axis=1)
y = data["habitable"]


# ============================
# 7. Train-Test Split
# ============================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


# ============================
# 8. Baseline Model
# ============================

baseline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=1000))
])

baseline.fit(X_train, y_train)

print("Baseline trained")


# ============================
# 9. Random Forest
# ============================

rf = Pipeline([
    ("model", RandomForestClassifier(random_state=42))
])

rf.fit(X_train, y_train)


# ============================
# 10. Evaluation
# ============================

pred = rf.predict(X_test)
prob = rf.predict_proba(X_test)[:,1]

print("\nClassification Report\n")
print(classification_report(y_test, pred))

print("Confusion Matrix\n")
print(confusion_matrix(y_test, pred))

print("ROC AUC:", roc_auc_score(y_test, prob))


# ============================
# 11. Save Model
# ============================

joblib.dump(rf, "models/random_forest.pkl")

print("Model saved")


# ============================
# 12. Ranking
# ============================

full_prob = rf.predict_proba(X)[:,1]

data["final_score"] = full_prob

ranked = data.sort_values(
    by="final_score",
    ascending=False
)

ranked.to_csv(
    "data/processed/habitability_ranked.csv",
    index=False
)

print("Ranking saved")
