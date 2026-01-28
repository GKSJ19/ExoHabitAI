"""
ExoHabitAI Backend API - Test Suite
Tests for all API endpoints
"""

import pytest
import json
from app import app
from utils import get_feature_names, generate_example_input


@pytest.fixture
def client():
    """Create test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_status_endpoint(client):
    """Test /status health check endpoint"""
    response = client.get('/status')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert data['status'] == 'operational'
    assert 'model_loaded' in data
    assert 'threshold' in data


def test_predict_endpoint_success(client):
    """Test /predict with valid input"""
    payload = generate_example_input()
    payload['pl_name'] = 'Test-Planet-1'
    
    response = client.post('/predict',
                           data=json.dumps(payload),
                           content_type='application/json')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert 'prediction_result' in data
    assert 'confidence_score' in data
    assert data['planet_id'] == 'Test-Planet-1'


def test_predict_endpoint_missing_features(client):
    """Test /predict with missing features"""
    payload = {'pl_dens': -0.048}  # Only one feature
    
    response = client.post('/predict',
                           data=json.dumps(payload),
                           content_type='application/json')
    data = json.loads(response.data)
    
    assert response.status_code == 400
    assert data['status'] == 'error'
    assert 'missing_features' in str(data)


def test_predict_endpoint_no_data(client):
    """Test /predict with no input data"""
    response = client.post('/predict',
                           data='',
                           content_type='application/json')
    data = json.loads(response.data)
    
    assert response.status_code == 400
    assert data['status'] == 'error'


def test_rank_endpoint(client):
    """Test /rank endpoint"""
    response = client.get('/rank?top=5')
    data = json.loads(response.data)
    
    # May fail if ranking file doesn't exist
    if response.status_code == 200:
        assert data['status'] == 'success'
        assert 'planets' in data
        assert data['returned_count'] <= 5
    else:
        assert response.status_code == 404


def test_batch_predict_endpoint(client):
    """Test /predict/batch endpoint"""
    planet1 = generate_example_input()
    planet2 = generate_example_input()
    planet2['pl_dens'] = 0.123  # Modify one feature
    
    payload = {
        'planets': [planet1, planet2]
    }
    
    response = client.post('/predict/batch',
                           data=json.dumps(payload),
                           content_type='application/json')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['total_processed'] == 2
    assert len(data['results']) == 2


def test_model_info_endpoint(client):
    """Test /model/info endpoint"""
    response = client.get('/model/info')
    data = json.loads(response.data)
    
    if response.status_code == 200:
        assert data['status'] == 'success'
        assert 'model_type' in data
        assert 'feature_count' in data
        assert data['feature_count'] == 38


def test_404_error(client):
    """Test 404 handler"""
    response = client.get('/nonexistent')
    data = json.loads(response.data)
    
    assert response.status_code == 404
    assert data['status'] == 'error'


def test_405_method_not_allowed(client):
    """Test 405 handler"""
    response = client.post('/status')  # Status only accepts GET
    data = json.loads(response.data)
    
    assert response.status_code == 405
    assert data['status'] == 'error'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
