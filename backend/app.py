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
def run_prediction():
    try:
        # Step 1: Check model status
        if model is None:
            return jsonify({
                "success": False,
                "reason": "Prediction model is unavailable"
            }), 503

        # Step 2: Read request body
        payload = request.get_json(silent=True)
        if payload is None:
            return jsonify({
                "success": False,
                "reason": "Request body must be valid JSON"
            }), 400

        # Step 3: Feature validation
        required_cols = get_feature_names()
        missing_cols = [f for f in required_cols if f not in payload]

        if missing_cols:
            return jsonify({
                "success": False,
                "reason": "Missing required input features",
                "missing_features": missing_cols
            }), 400

        # Step 4: Convert input to model-ready format
        processed_input = preprocess_input(payload, required_cols)

        # Step 5: Predict probability
        prob_score = float(model.predict_proba(processed_input)[0][1])
        is_habitable = prob_score >= OPTIMAL_THRESHOLD

        # Step 6: Identify planet
        planet_name = payload.get("pl_name") or payload.get("planet_id") or "N/A"

        # Step 7: Build response
        result = {
            "success": True,
            "planet": planet_name,
            "classification": "Habitable" if is_habitable else "Non-Habitable",
            "confidence": round(prob_score, 4),
            "decision_threshold": OPTIMAL_THRESHOLD,
            "evaluated_at": datetime.utcnow().isoformat()
        }

        return jsonify(result), 200

    except Exception as err:
        return jsonify({
            "success": False,
            "reason": "Prediction failed due to server error",
            "debug_info": str(err)
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
@app.post("/predict/batch")
def batch_prediction():
    try:
        # 1. Ensure model is ready
        if model is None:
            return jsonify({
                "success": False,
                "message": "ML model is not available"
            }), 503

        # 2. Read request JSON
        request_body = request.get_json(silent=True)
        if not request_body or "planets" not in request_body:
            return jsonify({
                "success": False,
                "message": "Input must contain a 'planets' list"
            }), 400

        planet_list = request_body["planets"]
        if not isinstance(planet_list, list):
            return jsonify({
                "success": False,
                "message": "'planets' should be an array of objects"
            }), 400

        required_features = get_feature_names()
        batch_output = []

        # 3. Process each planet separately
        for i, planet in enumerate(planet_list):
            planet_result = {"item": i}

            try:
                missing = [f for f in required_features if f not in planet]
                if missing:
                    planet_result.update({
                        "success": False,
                        "error": "Missing input features",
                        "missing_features": missing
                    })
                    batch_output.append(planet_result)
                    continue

                prepared_data = preprocess_input(planet, required_features)
                prob = float(model.predict_proba(prepared_data)[0][1])
                label = "Habitable" if prob >= OPTIMAL_THRESHOLD else "Non-Habitable"

                planet_result.update({
                    "success": True,
                    "planet_name": planet.get("pl_name", f"Planet_{i}"),
                    "prediction": label,
                    "confidence": round(prob, 4)
                })

            except Exception as item_error:
                planet_result.update({
                    "success": False,
                    "error": "Prediction failed for this planet",
                    "details": str(item_error)
                })

            batch_output.append(planet_result)

        # 4. Final response
        return jsonify({
            "success": True,
            "processed_count": len(batch_output),
            "predictions": batch_output,
            "generated_at": datetime.utcnow().isoformat()
        }), 200

    except Exception as err:
        return jsonify({
            "success": False,
            "message": "Batch prediction service error",
            "debug_info": str(err)
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
