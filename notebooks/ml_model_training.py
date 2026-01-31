import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_curve, auc


from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)#to evaluate models

import joblib

# ---------------- Load Dataset ----------------

from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "processed" / "preprocessed.csv"

df = pd.read_csv(DATA_PATH)


# ---------------- Define Target Variable ----------------
df["habitability_label"] = np.where(
    (df["Equilibrium temperature"] > -1) &
    (df["Equilibrium temperature"] < 1),
    1,
    0
)

# ---------------- Features & Target ----------------
X = df.drop(columns=[
    "habitability_label",
    "Planet name",
    "Host Name",
    "Equilibrium temperature"
])

y = df["habitability_label"]

# ---------------- Column Separation ----------------
categorical_cols = ["Star type"]
numerical_cols = X.columns.difference(categorical_cols)

# ---------------- Preprocessing Pipeline ----------------
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ]
)

# ---------------- Models ----------------
log_reg = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", LogisticRegression(max_iter=1000))
    ]
)

rf_model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", RandomForestClassifier(random_state=42))
    ]
)

xgb_model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", XGBClassifier(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=6,
            random_state=42,
            eval_metric="logloss"
        ))
    ]
)

# ---------------- Train-Test Split ----------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ---------------- Train Baseline Models ----------------
log_reg.fit(X_train, y_train)
rf_model.fit(X_train, y_train)
xgb_model.fit(X_train, y_train)

# ---------------- Evaluation Function ----------------
def evaluate(model, name):
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    print(f"\n{name} Results")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Precision:", precision_score(y_test, y_pred))
    print("Recall:", recall_score(y_test, y_pred))
    print("F1 Score:", f1_score(y_test, y_pred))
    print("ROC-AUC:", roc_auc_score(y_test, y_prob))
    print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    return f1_score(y_test, y_pred)


#---------------- ROC Curve Plotting ----------------
def plot_roc_curve(model, model_name):
    y_prob = model.predict_proba(X_test)[:, 1]

    fpr, tpr, _ = roc_curve(y_test, y_prob)
    roc_auc = auc(fpr, tpr)

    plt.figure(figsize=(6, 5))
    plt.plot(fpr, tpr, label=f"{model_name} (AUC = {roc_auc:.3f})")
    plt.plot([0, 1], [0, 1], linestyle="--")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve")
    plt.legend()
    plt.tight_layout()
    plt.show()


# ---------------- Evaluate Base Models ----------------
f1_log = evaluate(log_reg, "Logistic Regression")
f1_rf = evaluate(rf_model, "Random Forest")
f1_xgb = evaluate(xgb_model, "XGBoost")

# ---------------- Hyperparameter Tuning (Random Forest) ----------------
param_grid = {
    "model__n_estimators": [100, 200],
    "model__max_depth": [None, 10, 20],
    "model__min_samples_split": [2, 5]
}

rf_grid = GridSearchCV(
    rf_model,
    param_grid=param_grid,
    cv=3,
    scoring="f1",
    n_jobs=-1
)

rf_grid.fit(X_train, y_train)

best_rf_model = rf_grid.best_estimator_

print("\nBest Random Forest Parameters:")
print(rf_grid.best_params_)

f1_rf_tuned = evaluate(best_rf_model, "Tuned Random Forest")

# ---------------- Final Model Selection ----------------
models = [
    ("Logistic Regression", log_reg, f1_log),
    ("Random Forest", rf_model, f1_rf),
    ("Tuned Random Forest", best_rf_model, f1_rf_tuned),
    ("XGBoost", xgb_model, f1_xgb)
]

best_model_name, best_model, best_f1 = max(models, key=lambda x: x[2])

print(f"\nBest Model Selected: {best_model_name} (F1 = {best_f1:.4f})")

plot_roc_curve(best_model, best_model_name)


# ---------------- Save Best Model ----------------
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)

MODEL_PATH = MODEL_DIR / "best_exohabit_model.pkl"
joblib.dump(best_model, MODEL_PATH)



# ---------------- Habitability Ranking ----------------
df["habitability_probability"] = best_model.predict_proba(X)[:, 1]
df_ranked = df.sort_values(
    by="habitability_probability",
    ascending=False
)
PROCESSED_DIR = BASE_DIR / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH = PROCESSED_DIR / "habitability_ranked.csv"
df_ranked.to_csv(OUTPUT_PATH, index=False)


print("Habitability ranking saved as habitability_ranked.csv")

# ---------------- Feature Importance (Interpretability) ----------------
feature_names = (
    best_model.named_steps["preprocessor"]
    .get_feature_names_out()
)

model_step = best_model.named_steps["model"]

# Handle different model types safely
if hasattr(model_step, "feature_importances_"):
    importances = model_step.feature_importances_

elif hasattr(model_step, "coef_"):
    importances = np.abs(model_step.coef_[0])

else:
    print("Feature importance not available for this model.")
    importances = None

# Plot only if importances exist
if importances is not None:
    importance_df = pd.DataFrame({
        "Feature": feature_names,
        "Importance": importances
    }).sort_values(by="Importance", ascending=False)

    print("\nTop 10 Important Features:")
    print(importance_df.head(10))

    plt.figure(figsize=(8, 5))
    plt.barh(
        importance_df["Feature"][:10][::-1],
        importance_df["Importance"][:10][::-1]
    )
    plt.xlabel("Importance Score")
    plt.title("Top 10 Feature Importances")
    plt.tight_layout()
    plt.show()


print("\nBest model saved as best_exohabit_model.pkl")