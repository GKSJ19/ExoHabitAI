import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import os

# Set random seed for reproducibility
np.random.seed(42)

def generate_exoplanet_data(n_samples=2000):
    """
    Generate synthetic exoplanet data based on real astronomical parameters
    """
    
    # Generate habitable planets (Class 1)
    n_habitable = n_samples // 2
    
    # Habitable zone characteristics (Earth-like)
    habitable_data = {
        'pl_rade': np.random.normal(1.0, 0.3, n_habitable),  # Earth radii (0.8-1.5)
        'pl_orbper': np.random.normal(365, 150, n_habitable),  # Days (200-600)
        'pl_eqt': np.random.normal(288, 25, n_habitable),  # Kelvin (250-320)
        'st_teff': np.random.normal(5778, 400, n_habitable),  # Kelvin (5000-6500)
        'st_rad': np.random.normal(1.0, 0.15, n_habitable),  # Solar radii (0.8-1.2)
        'st_mass': np.random.normal(1.0, 0.15, n_habitable),  # Solar masses (0.8-1.2)
        'habitable': np.ones(n_habitable)
    }
    
    # Generate non-habitable planets (Class 0)
    n_non_habitable = n_samples - n_habitable
    
    # Calculate split sizes
    split1 = n_non_habitable // 3
    split2 = n_non_habitable // 3
    split3 = n_non_habitable - split1 - split2  # Remainder goes here
    
    # Mix of different non-habitable types
    # Hot Jupiters, Ice Giants, Too Hot/Cold, Wrong star type
    non_habitable_data = {
        'pl_rade': np.concatenate([
            np.random.uniform(3.0, 11.0, split1),  # Gas giants
            np.random.uniform(0.3, 0.7, split2),   # Too small
            np.random.uniform(1.6, 2.5, split3),   # Super-Earths (borderline)
        ]),
        'pl_orbper': np.concatenate([
            np.random.uniform(1, 50, split1),      # Too close
            np.random.uniform(800, 2000, split2),  # Too far
            np.random.uniform(100, 700, split3),   # Varied
        ]),
        'pl_eqt': np.concatenate([
            np.random.uniform(400, 1500, split1),  # Too hot
            np.random.uniform(100, 230, split2),   # Too cold
            np.random.uniform(330, 450, split3),   # Borderline hot
        ]),
        'st_teff': np.concatenate([
            np.random.uniform(3000, 4500, split1), # Cool stars
            np.random.uniform(6800, 9000, split2), # Hot stars
            np.random.uniform(5000, 6500, split3), # Sun-like but wrong planets
        ]),
        'st_rad': np.concatenate([
            np.random.uniform(0.3, 0.7, split1),   # Small stars
            np.random.uniform(1.5, 3.0, split2),   # Large stars
            np.random.uniform(0.8, 1.3, split3),   # Normal stars
        ]),
        'st_mass': np.concatenate([
            np.random.uniform(0.3, 0.7, split1),   # Low mass
            np.random.uniform(1.5, 2.5, split2),   # High mass
            np.random.uniform(0.8, 1.2, split3),   # Normal mass
        ]),
        'habitable': np.zeros(n_non_habitable)
    }
    
    # Combine datasets
    df_habitable = pd.DataFrame(habitable_data)
    df_non_habitable = pd.DataFrame(non_habitable_data)
    df = pd.concat([df_habitable, df_non_habitable], ignore_index=True)
    
    # Shuffle the dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Ensure positive values
    for col in df.columns:
        if col != 'habitable':
            df[col] = df[col].clip(lower=0.1)
    
    return df

def train_model():
    """
    Train the exoplanet habitability prediction model
    """
    
    print("=" * 60)
    print("ExoHabitAI - Machine Learning Training Pipeline")
    print("=" * 60)
    
    # Generate data
    print("\n[1/6] Generating exoplanet dataset...")
    df = generate_exoplanet_data(n_samples=2000)
    print(f"✓ Generated {len(df)} exoplanet samples")
    print(f"  - Habitable: {(df['habitable']==1).sum()}")
    print(f"  - Non-Habitable: {(df['habitable']==0).sum()}")
    
    # Create directories
    print("\n[2/6] Creating directories...")
    os.makedirs("../models", exist_ok=True)
    os.makedirs("../data/processed", exist_ok=True)
    print("✓ Directories created")
    
    # Save processed data
    print("\n[3/6] Saving processed dataset...")
    df.to_csv("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/data/processed/reprocessed.csv", index=False)
    print("✓ Saved to: data/processed/reprocessed.csv")
    
    # Prepare features and target
    print("\n[4/6] Preparing features...")
    X = df.drop('habitable', axis=1)
    y = df['habitable']
    
    feature_names = X.columns.tolist()
    print(f"✓ Features: {feature_names}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"✓ Train set: {len(X_train)} samples")
    print(f"✓ Test set: {len(X_test)} samples")
    
    # Train model
    print("\n[5/6] Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    print("✓ Model trained successfully")
    
    # Evaluate model
    print("\n[6/6] Evaluating model performance...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n{'='*60}")
    print(f"MODEL PERFORMANCE")
    print(f"{'='*60}")
    print(f"\nAccuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, 
                                target_names=['Not Habitable', 'Habitable']))
    
    print("\nConfusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(f"  True Negatives: {cm[0][0]:>4}  |  False Positives: {cm[0][1]:>4}")
    print(f"  False Negatives: {cm[1][0]:>4}  |  True Positives: {cm[1][1]:>4}")
    
    # Feature importance
    print("\nFeature Importance:")
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for idx, row in feature_importance.iterrows():
        print(f"  {row['feature']:12s}: {row['importance']:.4f}")
    
    # Save model
    print("\n" + "="*60)
    print("Saving model...")
    joblib.dump(model, "C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/models/exohabit_model.pkl")
    print("✓ Model saved to: models/exohabit_model.pkl")
    
    # Test predictions
    print("\n" + "="*60)
    print("TEST PREDICTIONS")
    print("="*60)
    
    # Test with Earth-like planet
    earth_like = pd.DataFrame([[1.0, 365.25, 288, 5778, 1.0, 1.0]], 
                               columns=feature_names)
    pred = model.predict(earth_like)[0]
    prob = model.predict_proba(earth_like)[0][1]
    print(f"\nEarth-like planet:")
    print(f"  Prediction: {'Habitable' if pred==1 else 'Not Habitable'}")
    print(f"  Probability: {prob*100:.1f}%")
    
    # Test with Hot Jupiter
    hot_jupiter = pd.DataFrame([[11.0, 3.5, 1200, 6000, 1.1, 1.05]], 
                                columns=feature_names)
    pred = model.predict(hot_jupiter)[0]
    prob = model.predict_proba(hot_jupiter)[0][1]
    print(f"\nHot Jupiter:")
    print(f"  Prediction: {'Habitable' if pred==1 else 'Not Habitable'}")
    print(f"  Probability: {prob*100:.1f}%")
    
    print("\n" + "="*60)
    print("✓ TRAINING COMPLETE!")
    print("="*60)
    print("\nYou can now run the Flask backend:")
    print("  cd backend")
    print("  python app.py")
    print("="*60)

if __name__ == "__main__":
    train_model()