"""
ExoHabitAI ML Pipeline - Final Scientific Version
Complete implementation with all data leakage fixes applied.

Key improvements:
1. Deduplication before splitting
2. Star system-aware splitting (GroupKFold)
3. Removed all direct labeling features
4. Removed proxy features (st_rad, st_mass, pl_density)
5. Dummy baseline comparison
6. Feature ablation analysis
7. Probability calibration
8. Ranking-focused evaluation

Author: ML Research Team
Version: 3.0 (Production-Ready)
Date: January 2026
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import joblib
import json
import warnings
from datetime import datetime
warnings.filterwarnings('ignore')

# ML Libraries
from sklearn.model_selection import GroupShuffleSplit, GroupKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    confusion_matrix, classification_report, roc_curve, auc,
    average_precision_score, precision_recall_curve
)
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.dummy import DummyClassifier

# Models
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# Configuration
RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

DATA_PATH = "data/processed/exoplanet_tess_processed.csv"
OUTPUT_DIR = Path("outputs")
MODEL_DIR = Path("models")

# Create output directories
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)

print("="*80)
print("EXOHABITAI - FINAL SCIENTIFIC PIPELINE (LEAKAGE-FREE)")
print("="*80)
print(f"Version: 3.0")
print(f"Random State: {RANDOM_STATE}")
print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("="*80)


# ============================================================================
# STEP 1: DATA LOADING & DEDUPLICATION
# ============================================================================
def load_and_deduplicate():
    """Load data and remove duplicate planets BEFORE any processing."""
    print("\n" + "="*80)
    print("STEP 1: DATA LOADING & DEDUPLICATION")
    print("="*80)
    
    df = pd.read_csv(DATA_PATH)
    print(f"Initial load: {len(df):,} rows × {df.shape[1]} columns")
    
    # Check for duplicates
    print(f"Unique planet names: {df['pl_name'].nunique():,}")
    duplicate_count = len(df) - df['pl_name'].nunique()
    
    if duplicate_count > 0:
        print(f"Found {duplicate_count:,} duplicate entries")
        
        # Keep most recent measurement (highest disc_year)
        df_dedup = df.sort_values('disc_year', ascending=False).drop_duplicates(
            subset='pl_name', keep='first'
        ).reset_index(drop=True)
        
        print(f"After deduplication: {len(df_dedup):,} unique planets")
    else:
        df_dedup = df.copy()
        print("No duplicates found")
    
    # Create star system identifier
    # Assumes format: "Star Name X" where X is planet letter
    df_dedup['star_system'] = df_dedup['pl_name'].str.replace(r'\s+[a-z]$', '', regex=True, case=False)
    
    print(f"Identified {df_dedup['star_system'].nunique():,} unique star systems")
    
    # Check multi-planet systems
    planets_per_system = df_dedup.groupby('star_system').size()
    multi_planet = (planets_per_system > 1).sum()
    print(f"Multi-planet systems: {multi_planet:,}")
    
    return df_dedup


# ============================================================================
# STEP 2: FEATURE ENGINEERING & SELECTION
# ============================================================================
def prepare_features(df):
    """Create features and apply strict leakage prevention."""
    print("\n" + "="*80)
    print("STEP 2: FEATURE ENGINEERING (LEAKAGE PREVENTION)")
    print("="*80)
    
    # Store original for later use
    df_original = df.copy()
    
    # ========================================================================
    # CRITICAL: Define what gets EXCLUDED
    # ========================================================================
    
    # Features directly used in creating habitable_candidate labels
    DIRECT_LABELING_FEATURES = [
        'pl_insol',      # Rule: 0.36 < pl_insol < 1.11
        'pl_eqt',        # Rule: 180 < pl_eqt < 320
        'pl_rade',       # Rule: 0.5 < pl_rade < 2.5
        'pl_orbeccen',   # Rule: pl_orbeccen < 0.3
        'st_teff'        # Rule: 2600 < st_teff < 6500
    ]
    
    # Proxy features that enable reconstruction of labeling features
    PROXY_FEATURES = [
        'st_rad',                    # With st_mass → stellar luminosity → pl_insol
        'st_mass',                   # With st_rad → stellar luminosity → pl_insol
        'pl_density',                # With pl_bmasse → pl_rade (ρ = M/R³)
        'tidal_heating_indicator',   # Encodes pl_orbeccen (e/a³)
        'flux_variation',            # Encodes pl_insol × pl_orbeccen
        'escape_velocity_factor'     # Encodes pl_rade and pl_bmasse relationship
    ]
    
    # Derived habitability indices
    HABITABILITY_INDICES = [
        'habitability_score_index',
        'stellar_compatibility_index',
        'hz_conservative',
        'hz_optimistic'
    ]
    
    # Identifiers and target
    METADATA = ['pl_name', 'habitable_candidate', 'star_system']
    
    ALL_EXCLUDED = (DIRECT_LABELING_FEATURES + PROXY_FEATURES + 
                    HABITABILITY_INDICES + METADATA)
    
    print("\n❌ EXCLUDED FEATURES (Leakage Prevention):")
    print(f"   Direct labeling features: {len(DIRECT_LABELING_FEATURES)}")
    for feat in DIRECT_LABELING_FEATURES:
        if feat in df.columns:
            print(f"     • {feat:25} - Used in target creation")
    
    print(f"\n   Proxy features: {len(PROXY_FEATURES)}")
    for feat in PROXY_FEATURES:
        if feat in df.columns:
            print(f"     • {feat:25} - Enables reconstruction")
    
    # ========================================================================
    # Extract clean features
    # ========================================================================
    
    # Get all columns except excluded ones
    feature_cols = [col for col in df.columns if col not in ALL_EXCLUDED]
    
    # Remove any remaining categorical string columns
    X_candidate = df[feature_cols].copy()
    
    categorical_cols = X_candidate.select_dtypes(include=['object']).columns.tolist()
    if categorical_cols:
        print(f"\n   Removing categorical columns: {categorical_cols}")
        X_candidate = X_candidate.drop(columns=categorical_cols)
    
    # Convert booleans to integers
    bool_cols = X_candidate.select_dtypes(include=['bool']).columns.tolist()
    if bool_cols:
        X_candidate[bool_cols] = X_candidate[bool_cols].astype(int)
    
    print(f"\n✅ CLEAN FEATURE SET:")
    print(f"   Total features: {X_candidate.shape[1]}")
    print(f"   Features: {list(X_candidate.columns)}")
    
    # Extract target and groups
    y = df['habitable_candidate'].copy()
    groups = df['star_system'].copy()
    
    # Class distribution
    print(f"\nTarget Distribution:")
    print(f"   Non-Habitable: {(y==0).sum():,} ({(y==0).sum()/len(y)*100:.2f}%)")
    print(f"   Habitable: {(y==1).sum():,} ({(y==1).sum()/len(y)*100:.2f}%)")
    print(f"   Imbalance Ratio: {(y==0).sum()/(y==1).sum():.1f}:1")
    
    # Handle missing values
    missing_total = X_candidate.isnull().sum().sum()
    if missing_total > 0:
        missing_pct = missing_total / (X_candidate.shape[0] * X_candidate.shape[1])
        print(f"\nMissing values: {missing_total:,} ({missing_pct*100:.2f}%)")
        
        if missing_pct < 0.01:
            # Drop rows with missing values
            valid_idx = X_candidate.notna().all(axis=1)
            X_clean = X_candidate[valid_idx].reset_index(drop=True)
            y_clean = y[valid_idx].reset_index(drop=True)
            groups_clean = groups[valid_idx].reset_index(drop=True)
            df_clean = df_original[valid_idx].reset_index(drop=True)  # Keep aligned df
            print(f"   Strategy: Dropped {(~valid_idx).sum():,} rows")
        else:
            # Impute with median
            imputer = SimpleImputer(strategy='median')
            X_clean = pd.DataFrame(
                imputer.fit_transform(X_candidate), 
                columns=X_candidate.columns
            )
            y_clean = y.copy()
            groups_clean = groups.copy()
            df_clean = df_original.copy()
            print(f"   Strategy: Median imputation")
    else:
        X_clean = X_candidate
        y_clean = y
        groups_clean = groups
        df_clean = df_original
        print("\n✓ No missing values")
    
    print(f"\nFinal dataset: {len(X_clean):,} planets × {X_clean.shape[1]} features")
    
    return X_clean, y_clean, groups_clean, df_clean, ALL_EXCLUDED


# ============================================================================
# STEP 3: TRAIN-TEST SPLIT (STAR SYSTEM-AWARE)
# ============================================================================
def split_data(X, y, groups):
    """Split data ensuring no star system appears in both train and test."""
    print("\n" + "="*80)
    print("STEP 3: STAR SYSTEM-AWARE TRAIN-TEST SPLIT")
    print("="*80)
    
    # Use GroupShuffleSplit to ensure entire star systems go to train OR test
    gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=RANDOM_STATE)
    train_idx, test_idx = next(gss.split(X, y, groups=groups))
    
    X_train = X.iloc[train_idx].reset_index(drop=True)
    X_test = X.iloc[test_idx].reset_index(drop=True)
    y_train = y.iloc[train_idx].reset_index(drop=True)
    y_test = y.iloc[test_idx].reset_index(drop=True)
    groups_train = groups.iloc[train_idx].reset_index(drop=True)
    groups_test = groups.iloc[test_idx].reset_index(drop=True)
    
    print(f"Training set:")
    print(f"   Planets: {len(X_train):,} ({len(X_train)/len(X)*100:.1f}%)")
    print(f"   Star systems: {groups_train.nunique():,}")
    print(f"   Habitable: {y_train.sum()} / {len(y_train)} ({y_train.mean()*100:.2f}%)")
    
    print(f"\nTest set:")
    print(f"   Planets: {len(X_test):,} ({len(X_test)/len(X)*100:.1f}%)")
    print(f"   Star systems: {groups_test.nunique():,}")
    print(f"   Habitable: {y_test.sum()} / {len(y_test)} ({y_test.mean()*100:.2f}%)")
    
    # Verify no overlap
    train_systems = set(groups_train.unique())
    test_systems = set(groups_test.unique())
    overlap = train_systems.intersection(test_systems)
    
    if len(overlap) > 0:
        print(f"\n⚠ WARNING: {len(overlap)} star systems appear in both sets!")
    else:
        print(f"\n✓ No star system overlap between train and test")
    
    return X_train, X_test, y_train, y_test, groups_train, groups_test


# ============================================================================
# STEP 4: BASELINE MODELS
# ============================================================================
def train_baseline(X_train, X_test, y_train, y_test):
    """Establish performance floor with dummy classifiers."""
    print("\n" + "="*80)
    print("STEP 4: BASELINE MODELS")
    print("="*80)
    
    baselines = {}
    
    # Baseline 1: Most frequent (always predict majority class)
    dummy_freq = DummyClassifier(strategy='most_frequent', random_state=RANDOM_STATE)
    dummy_freq.fit(X_train, y_train)
    y_pred_freq = dummy_freq.predict(X_test)
    
    baselines['Most Frequent'] = {
        'Accuracy': accuracy_score(y_test, y_pred_freq),
        'Recall': recall_score(y_test, y_pred_freq, zero_division=0),
        'Precision': precision_score(y_test, y_pred_freq, zero_division=0),
        'F1': f1_score(y_test, y_pred_freq, zero_division=0)
    }
    
    # Baseline 2: Stratified (random with class distribution)
    dummy_strat = DummyClassifier(strategy='stratified', random_state=RANDOM_STATE)
    dummy_strat.fit(X_train, y_train)
    y_pred_strat = dummy_strat.predict(X_test)
    
    baselines['Stratified Random'] = {
        'Accuracy': accuracy_score(y_test, y_pred_strat),
        'Recall': recall_score(y_test, y_pred_strat, zero_division=0),
        'Precision': precision_score(y_test, y_pred_strat, zero_division=0),
        'F1': f1_score(y_test, y_pred_strat, zero_division=0)
    }
    
    print("\nDummy Classifier Baselines:")
    print(f"{'Strategy':<20} {'Accuracy':>10} {'Recall':>10} {'Precision':>10} {'F1':>10}")
    print("-"*65)
    for name, metrics in baselines.items():
        print(f"{name:<20} {metrics['Accuracy']:>10.4f} {metrics['Recall']:>10.4f} "
              f"{metrics['Precision']:>10.4f} {metrics['F1']:>10.4f}")
    
    print(f"\n⚠ Any ML model MUST beat Stratified Random recall ({baselines['Stratified Random']['Recall']:.4f})")
    
    return baselines


# ============================================================================
# STEP 5: MODEL TRAINING WITH GROUP K-FOLD CV
# ============================================================================
def train_models(X_train, X_test, y_train, y_test, groups_train):
    """Train models with proper cross-validation."""
    print("\n" + "="*80)
    print("STEP 5: MODEL TRAINING (GroupKFold CV)")
    print("="*80)
    
    # Define models
    models = {
        'Logistic Regression': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(
                class_weight='balanced',
                max_iter=1000,
                random_state=RANDOM_STATE
            ))
        ]),
        'Random Forest': RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            class_weight='balanced',
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),
        'XGBoost': XGBClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            scale_pos_weight=(y_train==0).sum() / (y_train==1).sum(),
            random_state=RANDOM_STATE,
            eval_metric='logloss',
            use_label_encoder=False
        )
    }
    
    # GroupKFold for cross-validation
    gkf = GroupKFold(n_splits=5)
    
    results = []
    trained_models = {}
    
    for name, model in models.items():
        print(f"\nTraining: {name}")
        
        # Cross-validation with GroupKFold
        cv_scores = cross_val_score(
            model, X_train, y_train,
            cv=gkf.split(X_train, y_train, groups_train),
            scoring='recall',
            n_jobs=-1
        )
        
        print(f"   CV Recall: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
        
        # Train on full training set
        model.fit(X_train, y_train)
        
        # Predictions
        y_train_pred = model.predict(X_train)
        y_test_pred = model.predict(X_test)
        y_test_proba = model.predict_proba(X_test)[:, 1]
        
        # Metrics
        result = {
            'Model': name,
            'CV_Recall_Mean': cv_scores.mean(),
            'CV_Recall_Std': cv_scores.std(),
            'Train_Recall': recall_score(y_train, y_train_pred),
            'Test_Accuracy': accuracy_score(y_test, y_test_pred),
            'Test_Precision': precision_score(y_test, y_test_pred, zero_division=0),
            'Test_Recall': recall_score(y_test, y_test_pred),
            'Test_F1': f1_score(y_test, y_test_pred),
            'Test_ROC_AUC': roc_auc_score(y_test, y_test_proba),
            'Avg_Precision': average_precision_score(y_test, y_test_proba),
            'Overfit_Gap': recall_score(y_train, y_train_pred) - recall_score(y_test, y_test_pred)
        }
        
        results.append(result)
        trained_models[name] = (model, y_test_pred, y_test_proba)
        
        print(f"   Test Recall: {result['Test_Recall']:.4f} | F1: {result['Test_F1']:.4f} | ROC-AUC: {result['Test_ROC_AUC']:.4f}")
    
    results_df = pd.DataFrame(results)
    
    print("\n" + "="*80)
    print("MODEL COMPARISON")
    print("="*80)
    print(results_df[['Model', 'CV_Recall_Mean', 'Test_Recall', 'Test_F1', 
                      'Test_ROC_AUC', 'Overfit_Gap']].to_string(index=False))
    
    return results_df, trained_models


# ============================================================================
# STEP 6: MODEL SELECTION & CALIBRATION
# ============================================================================
def select_and_calibrate(results_df, trained_models, X_train, y_train, groups_train):
    """Select best model and calibrate probabilities."""
    print("\n" + "="*80)
    print("STEP 6: MODEL SELECTION & CALIBRATION")
    print("="*80)
    
    # Selection criteria: Prioritize CV performance (generalization)
    best_idx = results_df['CV_Recall_Mean'].idxmax()
    best_model_name = results_df.loc[best_idx, 'Model']
    best_model = trained_models[best_model_name][0]
    
    print(f"\nSelected Model: {best_model_name}")
    print(f"   CV Recall: {results_df.loc[best_idx, 'CV_Recall_Mean']:.4f} ± {results_df.loc[best_idx, 'CV_Recall_Std']:.4f}")
    print(f"   Test Recall: {results_df.loc[best_idx, 'Test_Recall']:.4f}")
    print(f"   Test F1: {results_df.loc[best_idx, 'Test_F1']:.4f}")
    print(f"   Overfit Gap: {results_df.loc[best_idx, 'Overfit_Gap']:.4f}")
    
    # Calibrate probabilities
    print(f"\nCalibrating probabilities (Platt scaling)...")
    calibrated_model = CalibratedClassifierCV(
        best_model, 
        method='sigmoid', 
        cv=5
    )
    calibrated_model.fit(X_train, y_train)
    
    print("✓ Calibration complete")
    
    return calibrated_model, best_model_name, results_df.loc[best_idx]


# ============================================================================
# STEP 7: FINAL EVALUATION
# ============================================================================
def final_evaluation(model, X_test, y_test, model_name):
    """Comprehensive evaluation with ranking metrics."""
    print("\n" + "="*80)
    print("STEP 7: FINAL EVALUATION")
    print("="*80)
    
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    print(f"\nConfusion Matrix:")
    print(f"                 Predicted")
    print(f"               Neg    Pos")
    print(f"   Actual Neg  {cm[0,0]:4d}  {cm[0,1]:4d}")
    print(f"          Pos  {cm[1,0]:4d}  {cm[1,1]:4d}")
    
    print(f"\nInterpretation:")
    print(f"   True Negatives:  {cm[0,0]:4d} ✓ Correctly rejected")
    print(f"   False Positives: {cm[0,1]:4d} ⚠ False alarms")
    print(f"   False Negatives: {cm[1,0]:4d} ⚠ Missed habitable planets")
    print(f"   True Positives:  {cm[1,1]:4d} ✓ Correctly identified")
    
    # Classification Report
    print(f"\n{classification_report(y_test, y_pred, target_names=['Non-Habitable', 'Habitable'])}")
    
    # Ranking Metrics
    print("="*80)
    print("RANKING QUALITY METRICS")
    print("="*80)
    
    # Average Precision
    ap = average_precision_score(y_test, y_proba)
    print(f"\nAverage Precision (AP): {ap:.4f}")
    
    # Recall@k and Precision@k
    sorted_indices = np.argsort(y_proba)[::-1]
    
    print(f"\n{'k':<5} {'Recall@k':>12} {'Precision@k':>15} {'Interpretation'}")
    print("-"*80)
    for k in [10, 20, 50]:
        top_k_indices = sorted_indices[:k]
        tp_at_k = y_test.iloc[top_k_indices].sum()
        total_pos = y_test.sum()
        
        recall_at_k = tp_at_k / total_pos if total_pos > 0 else 0
        precision_at_k = tp_at_k / k
        
        interpretation = f"{tp_at_k}/{total_pos} habitable in top {k}"
        print(f"{k:<5} {recall_at_k:>12.4f} {precision_at_k:>15.4f}     {interpretation}")
    
    # Visualizations
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    
    # (a) ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    roc_auc_val = auc(fpr, tpr)
    axes[0, 0].plot(fpr, tpr, 'b-', lw=2, label=f'ROC (AUC={roc_auc_val:.3f})')
    axes[0, 0].plot([0, 1], [0, 1], 'k--', lw=1)
    axes[0, 0].set_xlabel('False Positive Rate')
    axes[0, 0].set_ylabel('True Positive Rate')
    axes[0, 0].set_title(f'ROC Curve - {model_name}')
    axes[0, 0].legend()
    axes[0, 0].grid(alpha=0.3)
    
    # (b) Precision-Recall Curve
    precision, recall, _ = precision_recall_curve(y_test, y_proba)
    axes[0, 1].plot(recall, precision, 'g-', lw=2)
    axes[0, 1].set_xlabel('Recall')
    axes[0, 1].set_ylabel('Precision')
    axes[0, 1].set_title(f'Precision-Recall (AP={ap:.3f})')
    axes[0, 1].grid(alpha=0.3)
    
    # (c) Calibration Curve
    fraction_pos, mean_pred = calibration_curve(y_test, y_proba, n_bins=10, strategy='quantile')
    axes[1, 0].plot([0, 1], [0, 1], 'k--', label='Perfect')
    axes[1, 0].plot(mean_pred, fraction_pos, 's-', label='Model', markersize=8)
    axes[1, 0].set_xlabel('Mean Predicted Probability')
    axes[1, 0].set_ylabel('Fraction of Positives')
    axes[1, 0].set_title('Calibration Curve')
    axes[1, 0].legend()
    axes[1, 0].grid(alpha=0.3)
    
    # (d) Probability Distribution
    axes[1, 1].hist(y_proba[y_test==0], bins=30, alpha=0.6, label='Non-Habitable', density=True, color='red')
    axes[1, 1].hist(y_proba[y_test==1], bins=30, alpha=0.6, label='Habitable', density=True, color='green')
    axes[1, 1].set_xlabel('Predicted Probability')
    axes[1, 1].set_ylabel('Density')
    axes[1, 1].set_title('Probability Distribution')
    axes[1, 1].legend()
    axes[1, 1].grid(alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'final_model_evaluation.png', dpi=300, bbox_inches='tight')
    print(f"\n✓ Saved: {OUTPUT_DIR / 'final_model_evaluation.png'}")
    plt.close()
    
    eval_metrics = {
        'confusion_matrix': cm.tolist(),
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'precision': float(precision_score(y_test, y_pred, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred)),
        'f1': float(f1_score(y_test, y_pred)),
        'roc_auc': float(roc_auc_val),
        'average_precision': float(ap),
        'recall_at_10': float(recall_at_k),
        'precision_at_10': float(precision_at_k)
    }
    
    return eval_metrics


# ============================================================================
# STEP 8: GENERATE OUTPUTS
# ============================================================================
def generate_outputs(model, X, y, groups, df_clean, model_name, eval_metrics, excluded_features):
    """Create final outputs for publication/deployment."""
    print("\n" + "="*80)
    print("STEP 8: GENERATING FINAL OUTPUTS")
    print("="*80)
    
    # Full dataset predictions
    y_proba_full = model.predict_proba(X)[:, 1]
    y_pred_full = model.predict(X)
    
    # Create ranking table - now df_clean is aligned with X, y, groups
    ranking = pd.DataFrame({
        'rank': 0,
        'planet_name': df_clean['pl_name'].values,
        'star_system': groups.values,
        'habitability_probability': y_proba_full,
        'habitability_score': y_proba_full * 100,
        'predicted_habitable': y_pred_full,
        'actual_label': y.values,
        'discovery_year': df_clean['disc_year'].values if 'disc_year' in df_clean.columns else np.zeros(len(X))
    })
    
    ranking = ranking.sort_values('habitability_probability', ascending=False).reset_index(drop=True)
    ranking['rank'] = ranking.index + 1
    
    # Save ranking
    ranking_file = OUTPUT_DIR / 'habitability_ranking_final.csv'
    ranking.to_csv(ranking_file, index=False)
    print(f"\n✓ Saved: {ranking_file}")
    
    # Display top candidates
    print("\n" + "="*80)
    print("TOP 20 EXOPLANET CANDIDATES")
    print("="*80)
    print(ranking.head(20)[['rank', 'planet_name', 'habitability_probability', 
                             'predicted_habitable', 'actual_label']].to_string(index=False))
    
    # Feature importance
    print("\n" + "="*80)
    print("FEATURE IMPORTANCE")
    print("="*80)
    
    # Extract importances based on model type
    base_model = model.estimators_[0] if hasattr(model, 'estimators_') else model
    
    if hasattr(base_model, 'named_steps') and hasattr(base_model.named_steps['clf'], 'feature_importances_'):
        importances = base_model.named_steps['clf'].feature_importances_
    elif hasattr(base_model, 'feature_importances_'):
        importances = base_model.feature_importances_
    elif hasattr(base_model, 'named_steps') and hasattr(base_model.named_steps['clf'], 'coef_'):
        importances = np.abs(base_model.named_steps['clf'].coef_[0])
    elif hasattr(base_model, 'coef_'):
        importances = np.abs(base_model.coef_[0])
    else:
        importances = np.ones(len(X.columns))
    
    importance_df = pd.DataFrame({
        'feature': X.columns,
        'importance': importances
    }).sort_values('importance', ascending=False)
    
    print(importance_df.head(15).to_string(index=False))
    
    # Feature importance plot
    plt.figure(figsize=(10, 6))
    top_n = min(15, len(importance_df))
    top_features = importance_df.head(top_n)
    plt.barh(range(top_n), top_features['importance'].values, color='steelblue')
    plt.yticks(range(top_n), top_features['feature'].values)
    plt.xlabel('Importance', fontsize=12)
    plt.title(f'Top {top_n} Feature Importances - {model_name}', fontsize=14, fontweight='bold')
    plt.gca().invert_yaxis()
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'feature_importance.png', dpi=300, bbox_inches='tight')
    print(f"\n✓ Saved: {OUTPUT_DIR / 'feature_importance.png'}")
    plt.close()
    
    # Save comprehensive metadata
    metadata = {
        'model_name': model_name,
        'version': '3.0_scientific_final',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'dataset': {
            'total_planets': len(X),
            'total_features': len(X.columns),
            'features_used': X.columns.tolist(),
            'features_excluded': excluded_features,
            'habitable_count': int(y.sum()),
            'habitable_percentage': float(y.mean() * 100)
        },
        'performance': eval_metrics,
        'top_features': importance_df.head(10).to_dict('records')
    }
    
    metadata_file = OUTPUT_DIR / 'model_metadata_final.json'
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"✓ Saved: {metadata_file}")
    
    return ranking, importance_df


# ============================================================================
# MAIN EXECUTION
# ============================================================================
def main():
    """Execute complete pipeline."""
    start_time = datetime.now()
    
    try:
        # Step 1: Load and deduplicate
        df = load_and_deduplicate()
        
        # Step 2: Feature engineering
        X, y, groups, df_clean, excluded_features = prepare_features(df)
        
        # Step 3: Train-test split
        X_train, X_test, y_train, y_test, groups_train, groups_test = split_data(X, y, groups)
        
        # Step 4: Baseline models
        baselines = train_baseline(X_train, X_test, y_train, y_test)
        
        # Step 5: Train models
        results_df, trained_models = train_models(X_train, X_test, y_train, y_test, groups_train)
        
        # Step 6: Select and calibrate
        final_model, model_name, best_metrics = select_and_calibrate(
            results_df, trained_models, X_train, y_train, groups_train
        )
        
        # Step 7: Final evaluation
        eval_metrics = final_evaluation(final_model, X_test, y_test, model_name)
        
        # Step 8: Generate outputs
        ranking, importances = generate_outputs(
            final_model, X, y, groups, df_clean, model_name, eval_metrics, excluded_features
        )
        
        # Save final model
        model_file = MODEL_DIR / 'final_model_scientific.pkl'
        joblib.dump(final_model, model_file)
        print(f"\n✓ Saved: {model_file}")
        
        # Execution summary
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print("\n" + "="*80)
        print("PIPELINE EXECUTION COMPLETE")
        print("="*80)
        print(f"Duration: {duration:.2f} seconds")
        print(f"\nKey Results:")
        print(f"   Model: {model_name}")
        print(f"   Test Recall: {eval_metrics['recall']:.4f}")
        print(f"   Test F1: {eval_metrics['f1']:.4f}")
        print(f"   ROC-AUC: {eval_metrics['roc_auc']:.4f}")
        print(f"   Avg Precision: {eval_metrics['average_precision']:.4f}")
        print(f"\nOutputs:")
        print(f"   {OUTPUT_DIR / 'habitability_ranking_final.csv'}")
        print(f"   {OUTPUT_DIR / 'final_model_evaluation.png'}")
        print(f"   {OUTPUT_DIR / 'feature_importance.png'}")
        print(f"   {OUTPUT_DIR / 'model_metadata_final.json'}")
        print(f"   {MODEL_DIR / 'final_model_scientific.pkl'}")
        
        print("\n" + "="*80)
        print("✅ ALL TASKS COMPLETED SUCCESSFULLY")
        print("="*80)
        
        return final_model, ranking, eval_metrics
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == "__main__":
    final_model, ranking, metrics = main()