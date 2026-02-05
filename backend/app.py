from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from backend.utils import (
    validate_input, 
    prepare_features, 
    format_prediction_response,
    load_ranking_data,
    get_example_inputs
)

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

app.config['JSON_SORT_KEYS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

MODEL_PATH = project_root / "models" / "final_model_scientific.pkl"
RANKING_PATH = project_root / "data" / "processed" / "habitability_ranking_final.csv"

try:
    model = joblib.load(MODEL_PATH)
    print(f"✓ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None

try:
    ranking_data = load_ranking_data(str(RANKING_PATH))
    print(f"✓ Ranking data loaded: {len(ranking_data)} exoplanets")
except Exception as e:
    print(f"⚠ Warning: Could not load ranking data: {e}")
    ranking_data = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "service": "ExoHabitAI Backend API",
        "version": "1.0",
        "endpoints": {
            "/": "API documentation",
            "/health": "Health status",
            "/predict": "Predict habitability (POST)",
            "/rank": "Get ranked exoplanets (GET)",
            "/examples": "Example inputs (GET)"
        },
        "status": "operational" if model is not None else "model not loaded"
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "ranking_data_available": ranking_data is not None and len(ranking_data) > 0,
        "ranking_count": len(ranking_data) if ranking_data is not None else 0
    })

@app.route('/examples', methods=['GET'])
def examples():
    return jsonify({
        "examples": get_example_inputs()
    })

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight request
    if request.method == 'OPTIONS':
        return '', 204
    
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    if not request.is_json:
        return jsonify({"error": "Invalid content type", "message": "Request must be JSON"}), 400
    
    data = request.get_json()
    is_valid, error_message = validate_input(data)
    
    if not is_valid:
        return jsonify({"error": "Invalid input", "message": error_message}), 400
    
    try:
        features = prepare_features(data)
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0, 1]
        planet_name = data.get('planet_name', 'Unknown Planet')
        response = format_prediction_response(planet_name, probability, prediction)
        response['status'] = 'success'
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": "Prediction failed", "message": str(e)}), 500

@app.route('/rank', methods=['GET', 'POST'])
def rank():
    if ranking_data is None or len(ranking_data) == 0:
        return jsonify({"error": "Ranking data not available"}), 404
    
    top = request.args.get('top', default=20, type=int)
    threshold = request.args.get('threshold', default=0.0, type=float)
    
    if top < 1 or top > 1000:
        return jsonify({"error": "Invalid parameter", "message": "Parameter 'top' must be between 1 and 1000"}), 400
    
    if threshold < 0.0 or threshold > 1.0:
        return jsonify({"error": "Invalid parameter", "message": "Parameter 'threshold' must be between 0.0 and 1.0"}), 400
    
    try:
        filtered = ranking_data[ranking_data['habitability_probability'] >= threshold].copy()
        top_candidates = filtered.head(top)
        
        candidates = []
        for idx, row in top_candidates.iterrows():
            candidates.append({
                "rank": int(row['rank']),
                "planet_name": row['planet_name'],
                "habitability_probability": round(float(row['habitability_probability']), 4),
                "habitability_score": round(float(row['habitability_score']), 2),
                "predicted_habitable": bool(row['predicted_habitable']),
                "actual_label": int(row['actual_label']) if 'actual_label' in row else None,
                "discovery_year": int(row['discovery_year']) if 'discovery_year' in row else None
            })
        
        return jsonify({
            "status": "success",
            "parameters": {"top": top, "threshold": threshold},
            "statistics": {
                "total_exoplanets": len(ranking_data),
                "above_threshold": len(filtered),
                "returned": len(candidates)
            },
            "candidates": candidates
        }), 200
    except Exception as e:
        return jsonify({"error": "Ranking failed", "message": str(e)}), 500

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    if not request.is_json:
        return jsonify({"error": "Invalid content type"}), 400
    
    data = request.get_json()
    
    if 'planets' not in data or not isinstance(data['planets'], list):
        return jsonify({"error": "Invalid input", "message": "Request must contain 'planets' array"}), 400
    
    if len(data['planets']) > 100:
        return jsonify({"error": "Too many planets", "message": "Maximum 100 planets per batch request"}), 400
    
    results = []
    errors = []
    
    for idx, planet_data in enumerate(data['planets']):
        is_valid, error_message = validate_input(planet_data)
        if not is_valid:
            errors.append({
                "index": idx,
                "planet_name": planet_data.get('planet_name', f'Planet {idx}'),
                "error": error_message
            })
            continue
        
        try:
            features = prepare_features(planet_data)
            prediction = model.predict(features)[0]
            probability = model.predict_proba(features)[0, 1]
            planet_name = planet_data.get('planet_name', f'Planet {idx}')
            result = format_prediction_response(planet_name, probability, prediction)
            results.append(result)
        except Exception as e:
            errors.append({
                "index": idx,
                "planet_name": planet_data.get('planet_name', f'Planet {idx}'),
                "error": str(e)
            })
    
    return jsonify({
        "status": "success" if len(errors) == 0 else "partial_success",
        "total_requested": len(data['planets']),
        "successful": len(results),
        "failed": len(errors),
        "results": results,
        "errors": errors if len(errors) > 0 else None
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 ExoHabitAI Backend Server Starting...")
    print("="*60)
    print(f"📍 Server: http://localhost:5000")
    print(f"🔍 Health Check: http://localhost:5000/health")
    print(f"📚 API Docs: http://localhost:5000/")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)