import pandas as pd
import numpy as np
import json
from pathlib import Path
from datetime import datetime
from .config import *

def load_data(file_path=RAW_DATA_PATH):
    print(f"Source: {file_path}\n")
    
    # Load CSV
    df = pd.read_csv(file_path, sep=",", comment="#", low_memory=False)
    df.columns = df.columns.str.strip()
    
    # Select required features
    df = df[REQUIRED_FEATURES].copy()
    
    # Convert to numeric
    numeric_cols = [col for col in df.columns if col != 'pl_name']
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')
    
    print(f"Loaded {len(df):,} exoplanets")
    print(f"Selected {len(df.columns)} features")

    return df


def clean_data(df):
    """Clean data by removing invalid values and imputing missing data."""
    print("CLEANING DATA")
    
    initial_size = len(df)
    
    # 1. Remove rows with missing critical features
    df = df.dropna(subset=CRITICAL_FEATURES)
    print(f"      Removed {initial_size - len(df):,} rows → {len(df):,} remaining")
    
    # 2. Remove physically invalid values
    before = len(df)
    valid_mask = pd.Series(True, index=df.index)
    
    for feature, rules in VALIDATION_RULES.items():
        if feature in df.columns:
            valid_mask &= (
                (df[feature] >= rules["min"]) & 
                (df[feature] <= rules["max"]) | 
                df[feature].isna()
            )
    
    df = df[valid_mask]
    print(f"Removed {before - len(df)} invalid rows → {len(df):,} remaining")
    
    # 3. Impute orbital semi-major axis (Kepler's 3rd law)
    missing_before = df['pl_orbsmax'].isna().sum()
    
    def estimate_semimajor_axis(row):
        if pd.notna(row['pl_orbsmax']):
            return row['pl_orbsmax']
        if pd.notna(row['pl_orbper']) and pd.notna(row['st_mass']):
            period_years = row['pl_orbper'] / 365.25
            return (row['st_mass'] * period_years**2)**(1/3)
        return np.nan
    
    df['pl_orbsmax'] = df.apply(estimate_semimajor_axis, axis=1)
    
    # Fill remaining with period-based median
    df['pl_orbsmax'] = df.groupby(
        pd.cut(df['pl_orbper'], bins=10),
        observed=False
    )['pl_orbsmax'].transform(lambda x: x.fillna(x.median()))
    
    print(f"      Imputed {missing_before - df['pl_orbsmax'].isna().sum()} values")
    
    # 4. Impute planet mass (mass-radius relationships)
    missing_before = df['pl_bmasse'].isna().sum()
    
    def estimate_mass(row):
        if pd.notna(row['pl_bmasse']):
            return row['pl_bmasse']
        if pd.notna(row['pl_rade']):
            r = row['pl_rade']
            if r < 1.5:
                return r ** 3.7  # Rocky
            elif r < 4.0:
                return r ** 2.06  # Neptune-like
            else:
                return 317 * (r / 11.2) ** 1.3  # Jupiter-like
        return np.nan
    
    df['pl_bmasse'] = df.apply(estimate_mass, axis=1)
    print(f"      Imputed {missing_before} values")
    
    # 5. Fill remaining features with median
    for feature in IMPUTABLE_FEATURES:
        if feature in df.columns:
            missing = df[feature].isna().sum()
            if missing > 0:
                df[feature] = df[feature].fillna(df[feature].median())
                print(f"      {feature:20} - Filled {missing:5} values")
    
    print(f"\n Cleaning complete: {len(df):,} rows retained ({len(df)/initial_size*100:.1f}%)\n")
    return df

def engineer_features(df):
    """Create derived features and habitability indices."""
    print("ENGINEERING FEATURES")
    
    # Physical features
    df['pl_density'] = df['pl_bmasse'] / (df['pl_rade'] ** 3)
    df['escape_velocity_factor'] = np.sqrt(df['pl_bmasse'] / df['pl_rade'])
    df['tidal_heating_indicator'] = np.where(
        df['pl_orbsmax'].notna() & (df['pl_orbsmax'] > 0),
        df['pl_orbeccen'] / (df['pl_orbsmax'] ** 3),
        np.nan
    )
    df['flux_variation'] = df['pl_insol'] * df['pl_orbeccen']
    print("Created: density, escape_velocity, tidal_heating, flux_variation")
    
    # Categorical features    
    # Stellar type
    def categorize_star(temp):
        if 2400 <= temp < 3700: return 'M'
        elif 3700 <= temp < 5200: return 'K'
        elif 5200 <= temp < 6000: return 'G'
        elif 6000 <= temp < 7500: return 'F'
        return 'Other'
    
    df['st_type_category'] = df['st_teff'].apply(categorize_star)
    
    # Planet type
    def categorize_planet(radius):
        if radius < 1.5: return 'rocky'
        elif radius < 2.5: return 'super_earth'
        elif radius < 6.0: return 'neptune'
        return 'jupiter'
    
    df['pl_type_category'] = df['pl_rade'].apply(categorize_planet)
    print("Created: stellar_type, planet_type")
    
    # Habitability indices    
    # Stellar compatibility index
    temp_score = pd.cut(df['st_teff'], bins=[0, 3700, 5200, 6000, 7500, 10000],
                       labels=[0.9, 1.0, 0.95, 0.7, 0.3]).astype(float)
    met_score = (1.0 - np.abs(df['st_met']) / 2.0).clip(0, 1)
    mass_score = np.where((df['st_mass'] >= 0.5) & (df['st_mass'] <= 1.5), 1.0, 0.5)
    df['stellar_compatibility_index'] = (temp_score + met_score + mass_score) / 3.0
    
    # Habitability score index
    insol_score = np.where(
        df['pl_insol'].between(0.36, 1.11),
        1.0 - np.abs(df['pl_insol'] - 1.0) / 1.0, 0.0
    )
    temp_score = np.maximum(0, 1.0 - np.abs(df['pl_eqt'] - 288) / 100)
    radius_score = np.where(
        df['pl_rade'].between(0.5, 2.5),
        1.0 - np.abs(df['pl_rade'] - 1.0) / 1.5, 0.0
    )
    ecc_score = np.maximum(0, 1.0 - df['pl_orbeccen'] / 0.3)
    
    df['habitability_score_index'] = (
        insol_score * 0.25 + temp_score * 0.25 + 
        radius_score * 0.2 + ecc_score * 0.15 + 
        df['stellar_compatibility_index'] * 0.15
    )
    
    # Habitability labels (Conservative, Standard, Optimistic)
    for hz_name, hz_criteria in [
        ('hz_conservative', CONSERVATIVE_HZ),
        ('habitable_candidate', STANDARD_HZ),
        ('hz_optimistic', OPTIMISTIC_HZ)
    ]:
        df[hz_name] = (
            df['pl_insol'].between(*hz_criteria['pl_insol']) &
            df['pl_rade'].between(*hz_criteria['pl_rade']) &
            df['pl_eqt'].between(*hz_criteria['pl_eqt']) &
            (df['pl_orbeccen'] < hz_criteria['pl_orbeccen_max']) &
            df['st_teff'].between(*hz_criteria['st_teff'])
        ).astype(int)
    
    print("Created: stellar_compatibility_index, habitability_score_index")
    print("Created: hz_conservative, habitable_candidate, hz_optimistic")
    
    # One-hot encoding
    star_dummies = pd.get_dummies(df['st_type_category'], prefix='st_type_category')
    planet_dummies = pd.get_dummies(df['pl_type_category'], prefix='pl_type_category')
    df = pd.concat([df, star_dummies, planet_dummies], axis=1)
    print(f"Created {len(star_dummies.columns) + len(planet_dummies.columns)} binary features")
    
    print(f"\n Feature engineering complete: {len(df.columns)} total features\n")
    return df

def run_preprocessing_pipeline():
    """Run complete preprocessing pipeline."""
    start_time = datetime.now()

    # Step 1: Load data
    df = load_data()
    initial_rows = len(df)
    
    # Step 2: Clean data
    df = clean_data(df)
    
    # Step 3: Engineer features
    df = engineer_features(df)
    
    # Step 4: Save processed data
    df.to_csv(PROCESSED_DATA_PATH, index=False)
    print(f"Saved processed data: {PROCESSED_DATA_PATH}\n")

    # Complete
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    print("PIPELINE COMPLETE")
    print(f"Final dataset: {len(df):,} rows × {len(df.columns)} columns")
    
    return df


if __name__ == "__main__":
    df = run_preprocessing_pipeline()
    
    print("  you can Visualize now: python3 -m backend.preprocessing.visualize")