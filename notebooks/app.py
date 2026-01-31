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

# Optimized threshold from MLDP4 notebook
OPTIMAL_THRESHOLD = 0.0034

try:
    model = joblib.load(MODEL_PATH)
    print(f"✓ ExoHabitAI Model Loaded Successfully from {MODEL_PATH}")
    print(f"  Model Type: {type(model).__name__}")
    print(f"  Detection Threshold: {OPTIMAL_THRESHOLD}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None

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
        "threshold_used": 0.0034
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
        
        # Convert to response format
        planets = []
        for idx, row in top_candidates.iterrows():
            planets.append({
                "rank": idx + 1,
                "habitability_score": float(row['habitability_score']),
                "predicted_class": int(row['predicted_class']),
                "actual_class": int(row['actual_class']),
                "classification": "Habitable" if row['predicted_class'] == 1 else "Non-Habitable"
            })
        
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


# ========== ERROR HANDLERS ==========
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "error",
        "message": "Endpoint not found",
        "available_endpoints": ["/status", "/predict", "/rank", "/predict/batch", "/model/info"]
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
    print(f"Detection Threshold: {OPTIMAL_THRESHOLD}")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
