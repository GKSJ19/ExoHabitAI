import pandas as pd
import numpy as np
import joblib

try:
    scaler = joblib.load('../models/scaler.pkl')
    MODEL_FEATURES = [
        'Radius', 'Mass', 'Period', 'SemiMajorAxis', 'EqTemp', 'Density', 
        'StarTemp', 'StarLum', 'StarMet', 'Insolation',
        'Habitability_Score', 'Stellar_Compatibility', 'Orbital_Stability_Score',
        'Star_Type_G', 'Star_Type_K', 'Star_Type_M', 'Star_Type_Other' 
    ]
except:
    print("Warning: models/scaler.pkl not found. Please run Step 0.")
    scaler = None
    MODEL_FEATURES = []

def preprocess_input(data):
    """
    Converts raw JSON input -> Model-Ready Scaled Array
    """
    df = pd.DataFrame([data])

    
    df['Habitability_Score'] = (np.exp(-np.abs(df['Radius'] - 1.0)) + 
                                np.exp(-np.abs((df['EqTemp'] - 288)/288)) + 
                                np.exp(-np.abs(df['Insolation'] - 1.0))) / 3.0
    
    
    df['Stellar_Compatibility'] = np.exp(-np.abs((df['StarTemp'] - 5778.0)/1000.0))
    
    
    df['Orbital_Stability_Score'] = np.log1p(df['Period'] * df['SemiMajorAxis'])
    
    star_type = str(data.get('StarType', 'G'))[0].upper()
    df['Star_Type_G'] = 1 if star_type == 'G' else 0
    df['Star_Type_K'] = 1 if star_type == 'K' else 0
    df['Star_Type_M'] = 1 if star_type == 'M' else 0
    df['Star_Type_Other'] = 1 if star_type not in ['G', 'K', 'M'] else 0

    for col in MODEL_FEATURES:
        if col not in df.columns:
            df[col] = 0
            
    df_final = df[MODEL_FEATURES]

    if scaler:
        return scaler.transform(df_final)
    else:
        return df_final.values