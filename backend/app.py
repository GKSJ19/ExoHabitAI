"""
ExoHabitAI Flask Backend API
Milestone 3: Week 5-6 - Module 5: Flask Backend API

This Flask application provides REST APIs for:
1. Exoplanet habitability prediction
2. Habitability ranking retrieval
3. System health monitoring
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime
from utils import validate_input_features, preprocess_input, get_feature_names

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# ========== MODEL INITIALIZATION ==========
MODEL_PATH = os.path.join('..', 'models', 'exohabit_hybrid_stack.pkl')
RANKING_PATH = os.path.join('..', 'data', 'processed', 'habitability_ranked_Milestone2.csv')
METADATA_PATH = os.path.join('..', 'data', 'processed', 'final-preprocessed6.csv')

# Optimized threshold from MLDP4 notebook (83.33% Recall, 38.46% Precision, 99% Accuracy)
OPTIMAL_THRESHOLD = 0.0763

try:
    model = joblib.load(MODEL_PATH)
    print(f"✓ ExoHabitAI Model Loaded Successfully from {MODEL_PATH}")
    print(f"  Model Type: {type(model).__name__}")
    print(f"  Detection Threshold: {OPTIMAL_THRESHOLD}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None

# Load metadata for planet details
metadata_df = None
try:
    if os.path.exists(METADATA_PATH):
        metadata_df = pd.read_csv(METADATA_PATH)
        print(f"✓ Planet Metadata Loaded: {len(metadata_df)} planets")
        print(f"  Metadata columns: {metadata_df.columns.tolist()}")
    else:
        print(f"⚠ Metadata file not found at {METADATA_PATH}")
except Exception as e:
    print(f"✗ Error loading metadata: {e}")

# ========== ENDPOINT 1: HEALTH CHECK ==========
@app.route('/status', methods=['GET'])
def health_check():
    """
    System health check endpoint
    Returns the operational status of the API and model
    """
    return jsonify({
        "status": "operational",
        "service": "ExoHabitAI Backend API",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "threshold": OPTIMAL_THRESHOLD,
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }), 200


# ========== ENDPOINT 2: HABITABILITY PREDICTION ==========
@app.route('/predict', methods=['POST'])
def predict_habitability():
    """
    Main prediction endpoint
    Accepts exoplanet features and returns habitability prediction
    
    Expected Input (JSON):
    {
        "pl_dens": -0.048,
        "pl_bmasse": 1.96,
        "pl_ratdor": -0.237,
        ... (38 features total)
    }
    
    Returns (JSON):
    {
        "status": "success",
        "prediction_result": "Habitable" or "Non-Habitable",
        "confidence_score": 0.9234,
        "planet_id": "Kepler-22b",
        "threshold_used": 0.0763
    }
    """
    try:
        # Validate model availability
        if model is None:
            return jsonify({
                "status": "error",
                "message": "Model not loaded. Please contact system administrator."
            }), 503
        
        # Parse and validate input
        data = request.get_json()
        if not data:
            return jsonify({
                "status": "error",
                "message": "No input data provided. Please send JSON with exoplanet features."
            }), 400
        
        # Validate required features
        expected_features = get_feature_names()
        validation_result = validate_input_features(data, expected_features)
        
        if not validation_result["valid"]:
            return jsonify({
                "status": "error",
                "message": "Invalid input features",
                "details": validation_result["errors"]
            }), 400
        
        # Preprocess input data
        input_df = preprocess_input(data, expected_features)
        
        # Generate prediction
        probability = model.predict_proba(input_df)[:, 1][0]
        prediction = 1 if probability >= OPTIMAL_THRESHOLD else 0
        
        # Extract planet identifier
        planet_id = data.get('pl_name', data.get('planet_id', 'Unknown'))
        
        # Prepare response
        response = {
            "status": "success",
            "prediction_result": "Habitable" if prediction == 1 else "Non-Habitable",
            "confidence_score": float(np.round(probability, 4)),
            "threshold_used": OPTIMAL_THRESHOLD,
            "planet_id": planet_id,
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Internal server error during prediction",
            "error_details": str(e)
        }), 500


# ========== ENDPOINT 3: HABITABILITY RANKING ==========
@app.route('/rank', methods=['GET'])
def get_habitability_ranking():
    """
    Retrieve ranked exoplanets by habitability score
    
    Query Parameters:
    - top: Number of top candidates to return (default: 10)
    - min_score: Minimum habitability score threshold (default: 0.5)
    
    Example: /rank?top=20&min_score=0.7
    
    Returns:
    {
        "status": "success",
        "total_planets": 1000,
        "returned_count": 20,
        "planets": [...]
    }
    """
    try:
        # Check if ranking file exists
        if not os.path.exists(RANKING_PATH):
            return jsonify({
                "status": "error",
                "message": f"Ranking data not found at {RANKING_PATH}"
            }), 404
        
        # Load ranking data
        ranking_df = pd.read_csv(RANKING_PATH)
        
        # Parse query parameters
        top_n = request.args.get('top', default=10, type=int)
        min_score = request.args.get('min_score', default=0.0, type=float)
        
        # Apply filters
        filtered_df = ranking_df[ranking_df['habitability_score'] >= min_score]
        top_candidates = filtered_df.head(top_n)
        
        # Convert to response format with metadata
        planets = []
        for idx, row in top_candidates.iterrows():
            planet_data = {
                "rank": idx + 1,
                "habitability_score": float(row['habitability_score']),
                "predicted_class": int(row['predicted_class']),
                "actual_class": int(row['actual_class']),
                "classification": "Habitable" if row['predicted_class'] == 1 else "Non-Habitable"
            }
            
            # Add metadata if available by matching index
            if metadata_df is not None and idx < len(metadata_df):
                try:
                    meta_row = metadata_df.iloc[idx]
                    planet_data.update({
                        "pl_name": str(meta_row.get('pl_name', f'Exoplanet-{idx+1}')),
                        "hostname": str(meta_row.get('hostname', 'Unknown')),
                        "st_spectype": str(meta_row.get('st_spectype', 'Unknown')),
                        "discoverymethod": str(meta_row.get('discoverymethod', 'Unknown')),
                        # Additional planetary parameters
                        "pl_orbper": float(meta_row.get('pl_orbper', 0)) if pd.notna(meta_row.get('pl_orbper')) else None,
                        "pl_orbsmax": float(meta_row.get('pl_orbsmax', 0)) if pd.notna(meta_row.get('pl_orbsmax')) else None,
                        "pl_rade": float(meta_row.get('pl_rade', 0)) if pd.notna(meta_row.get('pl_rade')) else None,
                        "pl_bmasse": float(meta_row.get('pl_bmasse', 0)) if pd.notna(meta_row.get('pl_bmasse')) else None,
                        "pl_dens": float(meta_row.get('pl_dens', 0)) if pd.notna(meta_row.get('pl_dens')) else None,
                        # Stellar parameters
                        "st_teff": float(meta_row.get('st_teff', 0)) if pd.notna(meta_row.get('st_teff')) else None,
                        "st_rad": float(meta_row.get('st_rad', 0)) if pd.notna(meta_row.get('st_rad')) else None,
                        "st_mass": float(meta_row.get('st_mass', 0)) if pd.notna(meta_row.get('st_mass')) else None,
                        "st_age": float(meta_row.get('st_age', 0)) if pd.notna(meta_row.get('st_age')) else None,
                        # System parameters
                        "sy_dist": float(meta_row.get('sy_dist', 0)) if pd.notna(meta_row.get('sy_dist')) else None,
                    })
                except Exception as e:
                    print(f"Warning: Could not load metadata for planet at index {idx}: {e}")
            else:
                # Fallback names if metadata not available
                planet_data.update({
                    "pl_name": f"Exoplanet-{idx+1}",
                    "hostname": "Unknown",
                    "st_spectype": "Unknown",
                    "discoverymethod": "Unknown"
                })
            
            planets.append(planet_data)
        
        return jsonify({
            "status": "success",
            "total_planets": len(ranking_df),
            "filtered_count": len(filtered_df),
            "returned_count": len(planets),
            "min_score_filter": min_score,
            "planets": planets
        }), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Error retrieving ranking data",
            "error_details": str(e)
        }), 500


# ========== ENDPOINT 4: BATCH PREDICTION ==========
@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Batch prediction endpoint for multiple exoplanets
    
    Expected Input (JSON):
    {
        "planets": [
            {"pl_dens": -0.048, "pl_bmasse": 1.96, ...},
            {"pl_dens": 0.123, "pl_bmasse": 2.45, ...}
        ]
    }
    
    Returns predictions for all planets
    """
    try:
        if model is None:
            return jsonify({
                "status": "error",
                "message": "Model not loaded"
            }), 503
        
        data = request.get_json()
        if not data or 'planets' not in data:
            return jsonify({
                "status": "error",
                "message": "No planet data provided. Expected 'planets' array."
            }), 400
        
        planets = data['planets']
        if not isinstance(planets, list):
            return jsonify({
                "status": "error",
                "message": "'planets' must be an array"
            }), 400
        
        expected_features = get_feature_names()
        results = []
        
        for idx, planet_data in enumerate(planets):
            try:
                validation_result = validate_input_features(planet_data, expected_features)
                if not validation_result["valid"]:
                    results.append({
                        "index": idx,
                        "status": "error",
                        "message": "Invalid features",
                        "errors": validation_result["errors"]
                    })
                    continue
                
                input_df = preprocess_input(planet_data, expected_features)
                probability = model.predict_proba(input_df)[:, 1][0]
                prediction = 1 if probability >= OPTIMAL_THRESHOLD else 0
                
                results.append({
                    "index": idx,
                    "status": "success",
                    "prediction_result": "Habitable" if prediction == 1 else "Non-Habitable",
                    "confidence_score": float(np.round(probability, 4)),
                    "planet_id": planet_data.get('pl_name', f"Planet_{idx}")
                })
            except Exception as e:
                results.append({
                    "index": idx,
                    "status": "error",
                    "message": str(e)
                })
        
        return jsonify({
            "status": "success",
            "total_processed": len(results),
            "results": results,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Batch prediction error",
            "error_details": str(e)
        }), 500


# ========== ENDPOINT 5: MODEL INFO ==========
@app.route('/model/info', methods=['GET'])
def model_info():
    """
    Returns detailed information about the loaded model
    """
    if model is None:
        return jsonify({
            "status": "error",
            "message": "Model not loaded"
        }), 503
    
    try:
        model_pipeline = model
        expected_features = get_feature_names()
        
        return jsonify({
            "status": "success",
            "model_type": "Hybrid Stacking Ensemble",
            "base_models": ["XGBoost", "Random Forest"],
            "meta_learner": "Logistic Regression",
            "preprocessing": "Standard Scaler",
            "optimal_threshold": OPTIMAL_THRESHOLD,
            "target_recall": 0.85,
            "feature_count": len(expected_features),
            "features": expected_features,
            "training_source": "MLDP4.ipynb"
        }), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Error retrieving model information",
            "error_details": str(e)
        }), 500


# ========== ENDPOINT 6: GET PLANET DETAILS ==========
@app.route('/planet/<int:planet_index>', methods=['GET'])
def get_planet_details(planet_index):
    """
    Get detailed information about a specific planet by index
    
    URL: /planet/<index>
    Example: /planet/0 (first planet)
    
    Returns complete metadata and prediction information
    """
    try:
        if metadata_df is None:
            return jsonify({
                "status": "error",
                "message": "Metadata not available"
            }), 503
        
        if planet_index < 0 or planet_index >= len(metadata_df):
            return jsonify({
                "status": "error",
                "message": f"Invalid planet index. Valid range: 0-{len(metadata_df)-1}"
            }), 400
        
        # Get planet data
        planet = metadata_df.iloc[planet_index]
        
        # Get ranking data if available
        ranking_info = {}
        if os.path.exists(RANKING_PATH):
            try:
                ranking_df = pd.read_csv(RANKING_PATH)
                if planet_index < len(ranking_df):
                    rank_row = ranking_df.iloc[planet_index]
                    ranking_info = {
                        "habitability_score": float(rank_row['habitability_score']),
                        "predicted_class": int(rank_row['predicted_class']),
                        "actual_class": int(rank_row['actual_class']),
                        "classification": "Habitable" if rank_row['predicted_class'] == 1 else "Non-Habitable"
                    }
            except Exception as e:
                print(f"Could not load ranking info: {e}")
        
        # Build response with all available data
        response = {
            "status": "success",
            "planet_index": planet_index,
            # Core identification
            "pl_name": str(planet.get('pl_name', f'Exoplanet-{planet_index+1}')),
            "hostname": str(planet.get('hostname', 'Unknown')),
            "st_spectype": str(planet.get('st_spectype', 'Unknown')),
            "discoverymethod": str(planet.get('discoverymethod', 'Unknown')),
            # Prediction info
            **ranking_info,
            # Planetary parameters
            "planetary_params": {
                "pl_orbper": float(planet['pl_orbper']) if pd.notna(planet.get('pl_orbper')) else None,
                "pl_orbsmax": float(planet['pl_orbsmax']) if pd.notna(planet.get('pl_orbsmax')) else None,
                "pl_rade": float(planet['pl_rade']) if pd.notna(planet.get('pl_rade')) else None,
                "pl_bmasse": float(planet['pl_bmasse']) if pd.notna(planet.get('pl_bmasse')) else None,
                "pl_dens": float(planet['pl_dens']) if pd.notna(planet.get('pl_dens')) else None,
                "pl_orbeccen": float(planet['pl_orbeccen']) if pd.notna(planet.get('pl_orbeccen')) else None,
                "pl_orbincl": float(planet['pl_orbincl']) if pd.notna(planet.get('pl_orbincl')) else None,
                "pl_eqt": float(planet['pl_eqt']) if pd.notna(planet.get('pl_eqt')) else None,
                "pl_insol": float(planet['pl_insol']) if pd.notna(planet.get('pl_insol')) else None,
            },
            # Stellar parameters
            "stellar_params": {
                "st_teff": float(planet['st_teff']) if pd.notna(planet.get('st_teff')) else None,
                "st_rad": float(planet['st_rad']) if pd.notna(planet.get('st_rad')) else None,
                "st_mass": float(planet['st_mass']) if pd.notna(planet.get('st_mass')) else None,
                "st_age": float(planet['st_age']) if pd.notna(planet.get('st_age')) else None,
                "st_met": float(planet['st_met']) if pd.notna(planet.get('st_met')) else None,
                "st_logg": float(planet['st_logg']) if pd.notna(planet.get('st_logg')) else None,
                "st_lum": float(planet['st_lum']) if pd.notna(planet.get('st_lum')) else None,
            },
            # System parameters
            "system_params": {
                "sy_dist": float(planet['sy_dist']) if pd.notna(planet.get('sy_dist')) else None,
                "sy_plx": float(planet['sy_plx']) if pd.notna(planet.get('sy_plx')) else None,
            }
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Error retrieving planet details",
            "error_details": str(e)
        }), 500


# ========== ERROR HANDLERS ==========
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "error",
        "message": "Endpoint not found",
        "available_endpoints": ["/status", "/predict", "/rank", "/predict/batch", "/model/info", "/planet/<index>"]
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "status": "error",
        "message": "Method not allowed for this endpoint"
    }), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500


# ========== MAIN ENTRY POINT ==========
if __name__ == '__main__':
    print("=" * 60)
    print("ExoHabitAI Backend API - Starting Server")
    print("=" * 60)
    print(f"Model Path: {MODEL_PATH}")
    print(f"Ranking Data: {RANKING_PATH}")
    print(f"Metadata Path: {METADATA_PATH}")
    print(f"Detection Threshold: {OPTIMAL_THRESHOLD}")
    print(f"Planets with Metadata: {len(metadata_df) if metadata_df is not None else 0}")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
