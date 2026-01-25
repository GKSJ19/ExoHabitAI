"""
ExoHabitAI ML Model Training Pipeline - FIXED VERSION
Phase-2: Supervised Binary Classification for Exoplanet Habitability Prediction

CRITICAL FIXES APPLIED:
- Removed data leakage from derived habitability indices
- Used only raw observables and physically-derived features
- Implemented proper feature selection to prevent target leakage
- Added cross-validation and overfitting checks

Author: Senior ML Research Team
Date: January 2026
Version: 2.0 (Production-Ready, Leakage-Free)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import joblib
import warnings
import json
from datetime import datetime
warnings.filterwarnings('ignore')

# ML Libraries
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    confusion_matrix, classification_report, roc_curve, auc
)

# Models
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# Set random state for reproducibility
RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

# File paths
DATA_PATH = "data/processed/exoplanet_tess_processed.csv"
MODEL_DIR = Path("models")
OUTPUT_DIR = Path("data/processed")

# Create directories
MODEL_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("="*80)
print("EXOHABITAI ML TRAINING PIPELINE - VERSION 2.0 (DATA LEAKAGE FIXED)")
print("="*80)

# ============================================================================
# STEP 1: LOAD AND PREPARE DATA (LEAKAGE-FREE)
# ============================================================================
print("\nSTEP 1: DATASET PREPARATION")

df = pd.read_csv(DATA_PATH)
print(f"Loaded dataset: {df.shape[0]:,} rows × {df.shape[1]} columns")

TARGET_COLUMN = 'habitable_candidate'

# Features to EXCLUDE (cause data leakage)
LEAKY_FEATURES = [
    'pl_name',
    'habitable_candidate',
    'hz_conservative',
    'hz_optimistic',
    'habitability_score_index',
    'stellar_compatibility_index'
]

# Features to INCLUDE (clean observables + physical derivations)
CLEAN_FEATURES = [
    # RAW PLANETARY OBSERVABLES
    'pl_orbper', 'pl_orbsmax', 'pl_rade', 'pl_bmasse', 'pl_orbeccen', 'pl_insol', 'pl_eqt',
    # RAW STELLAR OBSERVABLES
    'st_teff', 'st_rad', 'st_mass', 'st_met', 'st_logg',
    # METADATA
    'disc_year',
    # PHYSICALLY-DERIVED FEATURES
    'pl_density', 'escape_velocity_factor', 'tidal_heating_indicator', 'flux_variation',
    # CATEGORICAL ENCODINGS
    'st_type_category_F', 'st_type_category_G', 'st_type_category_K', 'st_type_category_M', 'st_type_category_Other',
    'pl_type_category_jupiter', 'pl_type_category_neptune', 'pl_type_category_rocky', 'pl_type_category_super_earth'
]

# Verify all features exist
missing_features = [f for f in CLEAN_FEATURES if f not in df.columns]
if missing_features:
    print(f"Warning: Missing features: {missing_features}")
    CLEAN_FEATURES = [f for f in CLEAN_FEATURES if f in df.columns]

# Create clean feature matrix
X = df[CLEAN_FEATURES].copy()
y = df[TARGET_COLUMN].copy()

print(f"Feature matrix: {X.shape[0]:,} rows × {X.shape[1]} features")
print(f"Target distribution - Non-Habitable: {(y == 0).sum():,} | Habitable: {(y == 1).sum():,}")

# Check for class imbalance
imbalance_ratio = (y == 0).sum() / max((y == 1).sum(), 1)
USE_CLASS_WEIGHTS = imbalance_ratio > 10

# Convert boolean columns to integers
bool_cols = X.select_dtypes(include=['bool']).columns.tolist()
if bool_cols:
    X[bool_cols] = X[bool_cols].astype(int)

# Handle missing values
missing_counts = X.isnull().sum()
total_missing = missing_counts.sum()

if total_missing > 0:
    if total_missing / (X.shape[0] * X.shape[1]) < 0.01:
        valid_idx = X.notna().all(axis=1)
        X = X[valid_idx].reset_index(drop=True)
        y = y[valid_idx].reset_index(drop=True)
        df = df[valid_idx].reset_index(drop=True)
        print(f"Dropped {(~valid_idx).sum():,} rows with missing values")
    else:
        imputer = SimpleImputer(strategy='median')
        X_imputed = imputer.fit_transform(X)
        X = pd.DataFrame(X_imputed, columns=X.columns)
        print(f"Imputed {total_missing:,} missing values")

print(f"Final dataset: {len(X):,} rows × {X.shape[1]} features")

# ============================================================================
# STEP 2: TRAIN-TEST SPLIT
# ============================================================================
print("\nSTEP 2: TRAIN-TEST SPLIT")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)

print(f"Training set: {X_train.shape[0]:,} samples | Testing set: {X_test.shape[0]:,} samples")

# ============================================================================
# STEP 3: BASELINE MODELS
# ============================================================================
print("\nSTEP 3: BASELINE MODEL EVALUATION")

def evaluate_model_robust(model, X_train, X_test, y_train, y_test, model_name, cv=5):
    """Enhanced evaluation with cross-validation and overfitting detection"""
    model.fit(X_train, y_train)
    
    cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='recall')
    cv_recall_mean = cv_scores.mean()
    cv_recall_std = cv_scores.std()
    
    y_train_pred = model.predict(X_train)
    train_recall = recall_score(y_train, y_train_pred, zero_division=0)
    
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None
    
    metrics = {
        'Model': model_name,
        'Accuracy': accuracy_score(y_test, y_pred),
        'Precision': precision_score(y_test, y_pred, zero_division=0),
        'Recall': recall_score(y_test, y_pred, zero_division=0),
        'F1-Score': f1_score(y_test, y_pred, zero_division=0),
        'ROC-AUC': roc_auc_score(y_test, y_pred_proba) if y_pred_proba is not None else None,
        'CV_Recall_Mean': cv_recall_mean,
        'CV_Recall_Std': cv_recall_std,
        'Train_Recall': train_recall,
        'Overfitting_Gap': train_recall - recall_score(y_test, y_pred, zero_division=0)
    }
    
    return metrics, y_pred, y_pred_proba, model

all_results = []

# Logistic Regression
lr_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', LogisticRegression(
        random_state=RANDOM_STATE, max_iter=1000,
        class_weight='balanced' if USE_CLASS_WEIGHTS else None
    ))
])
lr_metrics, lr_pred, lr_proba, lr_model = evaluate_model_robust(
    lr_pipeline, X_train, X_test, y_train, y_test, 'Logistic Regression'
)
all_results.append(lr_metrics)

# Decision Tree
dt_pipeline = Pipeline([
    ('classifier', DecisionTreeClassifier(
        max_depth=5, random_state=RANDOM_STATE,
        class_weight='balanced' if USE_CLASS_WEIGHTS else None
    ))
])
dt_metrics, dt_pred, dt_proba, dt_model = evaluate_model_robust(
    dt_pipeline, X_train, X_test, y_train, y_test, 'Decision Tree (shallow)'
)
all_results.append(dt_metrics)

# ============================================================================
# STEP 4: PRIMARY MODELS
# ============================================================================
print("\nSTEP 4: PRIMARY MODEL TRAINING")

# Random Forest
rf_pipeline = Pipeline([
    ('classifier', RandomForestClassifier(
        n_estimators=100, random_state=RANDOM_STATE,
        class_weight='balanced' if USE_CLASS_WEIGHTS else None, n_jobs=-1
    ))
])
rf_metrics, rf_pred, rf_proba, rf_model = evaluate_model_robust(
    rf_pipeline, X_train, X_test, y_train, y_test, 'Random Forest'
)
all_results.append(rf_metrics)

# XGBoost
scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum() if USE_CLASS_WEIGHTS else 1
xgb_pipeline = Pipeline([
    ('classifier', XGBClassifier(
        n_estimators=100, learning_rate=0.1, max_depth=6, random_state=RANDOM_STATE,
        scale_pos_weight=scale_pos_weight, eval_metric='logloss', use_label_encoder=False
    ))
])
xgb_metrics, xgb_pred, xgb_proba, xgb_model = evaluate_model_robust(
    xgb_pipeline, X_train, X_test, y_train, y_test, 'XGBoost'
)
all_results.append(xgb_metrics)

# ============================================================================
# STEP 5: MODEL COMPARISON
# ============================================================================
print("\nSTEP 5: MODEL COMPARISON (PRE-TUNING)")

results_df = pd.DataFrame(all_results)
print("\n" + results_df[['Model', 'Recall', 'F1-Score', 'ROC-AUC', 'Overfitting_Gap']].to_string(index=False))

# ============================================================================
# STEP 6: HYPERPARAMETER TUNING
# ============================================================================
print("\nSTEP 6: HYPERPARAMETER TUNING")

# Tune Random Forest
print("Tuning Random Forest...")
rf_param_grid = {
    'classifier__n_estimators': [100, 200, 300],
    'classifier__max_depth': [10, 20, 30, None],
    'classifier__min_samples_split': [2, 5, 10],
    'classifier__min_samples_leaf': [1, 2, 4],
    'classifier__max_features': ['sqrt', 'log2']
}
rf_search = RandomizedSearchCV(
    rf_pipeline, param_distributions=rf_param_grid, n_iter=20, cv=5, 
    scoring='recall', random_state=RANDOM_STATE, n_jobs=-1, verbose=0
)
rf_search.fit(X_train, y_train)
rf_tuned = rf_search.best_estimator_
rf_tuned_metrics, rf_tuned_pred, rf_tuned_proba, _ = evaluate_model_robust(
    rf_tuned, X_train, X_test, y_train, y_test, 'Random Forest (Tuned)'
)
all_results.append(rf_tuned_metrics)

# Tune XGBoost
print("Tuning XGBoost...")
xgb_param_grid = {
    'classifier__n_estimators': [100, 200, 300],
    'classifier__learning_rate': [0.01, 0.05, 0.1, 0.2],
    'classifier__max_depth': [3, 5, 7, 9],
    'classifier__min_child_weight': [1, 3, 5],
    'classifier__subsample': [0.7, 0.8, 0.9, 1.0],
    'classifier__colsample_bytree': [0.7, 0.8, 0.9, 1.0]
}
xgb_search = RandomizedSearchCV(
    xgb_pipeline, param_distributions=xgb_param_grid, n_iter=20, cv=5,
    scoring='recall', random_state=RANDOM_STATE, n_jobs=-1, verbose=0
)
xgb_search.fit(X_train, y_train)
xgb_tuned = xgb_search.best_estimator_
xgb_tuned_metrics, xgb_tuned_pred, xgb_tuned_proba, _ = evaluate_model_robust(
    xgb_tuned, X_train, X_test, y_train, y_test, 'XGBoost (Tuned)'
)
all_results.append(xgb_tuned_metrics)

# ============================================================================
# STEP 7: FINAL MODEL SELECTION
# ============================================================================
print("\nSTEP 7: FINAL MODEL SELECTION")

final_results_df = pd.DataFrame(all_results)
print("\n" + final_results_df[['Model', 'Recall', 'Precision', 'F1-Score', 'ROC-AUC', 'Overfitting_Gap']].to_string(index=False))

final_results_df['Selection_Score'] = (
    final_results_df['Recall'] * 0.5 +
    final_results_df['F1-Score'] * 0.3 +
    final_results_df['ROC-AUC'] * 0.2 -
    final_results_df['Overfitting_Gap'].clip(0, 0.2) * 0.5
)

best_idx = final_results_df['Selection_Score'].idxmax()
final_model_name = final_results_df.loc[best_idx, 'Model']

model_map = {
    'Logistic Regression': (lr_model, lr_pred, lr_proba),
    'Decision Tree (shallow)': (dt_model, dt_pred, dt_proba),
    'Random Forest': (rf_model, rf_pred, rf_proba),
    'XGBoost': (xgb_model, xgb_pred, xgb_proba),
    'Random Forest (Tuned)': (rf_tuned, rf_tuned_pred, rf_tuned_proba),
    'XGBoost (Tuned)': (xgb_tuned, xgb_tuned_pred, xgb_tuned_proba)
}

final_model, final_predictions, final_probabilities = model_map[final_model_name]

print(f"\n{'='*80}")
print("FINAL SELECTED MODEL")
print("="*80)
print(f"Model: {final_model_name}")
print(f"\nTest Performance:")
print(f"  Recall:    {final_results_df.loc[best_idx, 'Recall']:.4f}")
print(f"  Precision: {final_results_df.loc[best_idx, 'Precision']:.4f}")
print(f"  F1-Score:  {final_results_df.loc[best_idx, 'F1-Score']:.4f}")
print(f"  ROC-AUC:   {final_results_df.loc[best_idx, 'ROC-AUC']:.4f}")
print(f"  Overfitting Gap: {final_results_df.loc[best_idx, 'Overfitting_Gap']:.4f}")

# ============================================================================
# STEP 8: DETAILED EVALUATION
# ============================================================================
print("\nSTEP 8: DETAILED MODEL EVALUATION")

cm = confusion_matrix(y_test, final_predictions)
print(f"\nConfusion Matrix:")
print(f"  TN: {cm[0,0]:4d} | FP: {cm[0,1]:4d}")
print(f"  FN: {cm[1,0]:4d} | TP: {cm[1,1]:4d}")

print("\n" + classification_report(y_test, final_predictions,
                                   target_names=['Non-Habitable', 'Potentially Habitable']))

# ROC Curve
fpr, tpr, thresholds = roc_curve(y_test, final_probabilities)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(10, 6))
plt.plot(fpr, tpr, color='darkblue', lw=2, label=f'ROC Curve (AUC = {roc_auc:.4f})')
plt.plot([0, 1], [0, 1], color='gray', lw=1, linestyle='--', label='Random Classifier')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate', fontsize=12)
plt.ylabel('True Positive Rate (Recall)', fontsize=12)
plt.title(f'ROC Curve - {final_model_name}', fontsize=14, fontweight='bold')
plt.legend(loc="lower right", fontsize=11)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'roc_curve_clean.png', dpi=300, bbox_inches='tight')
plt.close()

# ============================================================================
# STEP 9: HABITABILITY SCORING & RANKING
# ============================================================================
print("\nSTEP 9: HABITABILITY SCORING & PLANET RANKING")

full_predictions = final_model.predict(X)
full_probabilities = final_model.predict_proba(X)[:, 1]

ranking_df = pd.DataFrame({
    'pl_name': df['pl_name'],
    'predicted_class': full_predictions,
    'habitability_probability': full_probabilities,
    'habitability_score': full_probabilities * 100,
    'actual_label': y,
    'pl_rade': df['pl_rade'],
    'pl_eqt': df['pl_eqt'],
    'pl_insol': df['pl_insol'],
    'st_teff': df['st_teff'],
    'pl_orbeccen': df['pl_orbeccen']
})

ranking_df = ranking_df.sort_values('habitability_probability', ascending=False).reset_index(drop=True)
ranking_df['rank'] = ranking_df.index + 1

output_file = OUTPUT_DIR / 'habitability_ranked_clean.csv'
ranking_df.to_csv(output_file, index=False)

print(f"\nTop 20 Potentially Habitable Exoplanets:")
top_20 = ranking_df.head(20)[['rank', 'pl_name', 'habitability_score', 'pl_rade', 'pl_eqt']]
print(top_20.to_string(index=False))

print(f"\nPredicted habitable (prob > 0.5): {(full_probabilities > 0.5).sum():,}")

# ============================================================================
# STEP 10: MODEL INTERPRETABILITY
# ============================================================================
print("\nSTEP 10: MODEL INTERPRETABILITY")

if 'Random Forest' in final_model_name:
    feature_importances = final_model.named_steps['classifier'].feature_importances_
elif 'XGBoost' in final_model_name:
    feature_importances = final_model.named_steps['classifier'].feature_importances_
elif 'Decision Tree' in final_model_name:
    feature_importances = final_model.named_steps['classifier'].feature_importances_
else:
    feature_importances = np.abs(final_model.named_steps['classifier'].coef_[0])

importance_df = pd.DataFrame({
    'feature': X.columns,
    'importance': feature_importances
}).sort_values('importance', ascending=False)

print("\nTop 15 Most Important Features:")
print(importance_df.head(15).to_string(index=False))

# Plot
plt.figure(figsize=(12, 8))
top_n = 20
top_features = importance_df.head(top_n)
plt.barh(range(top_n), top_features['importance'].values, color='steelblue')
plt.yticks(range(top_n), top_features['feature'].values)
plt.xlabel('Feature Importance', fontsize=12)
plt.ylabel('Feature', fontsize=12)
plt.title(f'Top {top_n} Feature Importances - {final_model_name}', fontsize=14, fontweight='bold')
plt.gca().invert_yaxis()
plt.grid(axis='x', alpha=0.3)
plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'feature_importance_clean.png', dpi=300, bbox_inches='tight')
plt.close()

# ============================================================================
# STEP 11: SAVE MODEL
# ============================================================================
print("\nSTEP 11: SAVING FINAL MODEL")

model_filename = MODEL_DIR / f"{final_model_name.lower().replace(' ', '_').replace('(', '').replace(')', '')}_clean.pkl"
joblib.dump(final_model, model_filename)

metadata = {
    'model_name': final_model_name,
    'version': '2.0_leakage_free',
    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'metrics': {
        'accuracy': float(final_results_df.loc[best_idx, 'Accuracy']),
        'precision': float(final_results_df.loc[best_idx, 'Precision']),
        'recall': float(final_results_df.loc[best_idx, 'Recall']),
        'f1_score': float(final_results_df.loc[best_idx, 'F1-Score']),
        'roc_auc': float(final_results_df.loc[best_idx, 'ROC-AUC']),
        'overfitting_gap': float(final_results_df.loc[best_idx, 'Overfitting_Gap'])
    },
    'features_used': X.columns.tolist(),
    'random_state': RANDOM_STATE
}

metadata_file = MODEL_DIR / 'model_metadata_clean.json'
with open(metadata_file, 'w') as f:
    json.dump(metadata, f, indent=2)

print(f"Model saved: {model_filename}")
print(f"Metadata saved: {metadata_file}")

print(f"\n{'='*80}")
print("PIPELINE EXECUTION COMPLETE")
print(f"{'='*80}\n")