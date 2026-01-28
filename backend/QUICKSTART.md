# ExoHabitAI Backend - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Start the Server

```bash
python app.py
```

You should see:
```
============================================================
ExoHabitAI Backend API - Starting Server
============================================================
Model Path: ..\models\exohabit_hybrid_stack.pkl
✓ ExoHabitAI Model Loaded Successfully
Detection Threshold: 0.0034
============================================================
 * Running on http://0.0.0.0:5000
```

### Step 3: Test the API

Open a new terminal and try:

```bash
# Test 1: Health Check
curl http://localhost:5000/status

# Test 2: Predict Habitability (using sample data)
curl -X POST http://localhost:5000/predict ^
  -H "Content-Type: application/json" ^
  -d @sample_planet.json

# Test 3: Get Top 10 Habitable Candidates
curl http://localhost:5000/rank?top=10
```

---

## 📝 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/status` | GET | Health check |
| `/predict` | POST | Single planet prediction |
| `/predict/batch` | POST | Batch predictions |
| `/rank` | GET | Get ranked planets |
| `/model/info` | GET | Model specifications |

---

## 🧪 Running Tests

```bash
# Run all tests
pytest test_api.py -v

# Run specific test
pytest test_api.py::test_predict_endpoint_success -v
```

---

## 🌐 Sample Request (Python)

```python
import requests

# Predict habitability
url = "http://localhost:5000/predict"
data = {
    "pl_dens": -0.048,
    "pl_bmasse": 1.96,
    # ... (include all 38 features)
    "pl_name": "Kepler-22b"
}

response = requests.post(url, json=data)
print(response.json())
```

---

## 🔧 Troubleshooting

### Issue: Model Not Found

**Error**: `Model file not found!`

**Solution**: 
1. Check that `models/exohabit_hybrid_stack.pkl` exists
2. Run the MLDP4 notebook to generate the model:
   ```bash
   cd notebooks
   jupyter notebook MLDP4.ipynb
   ```

### Issue: Ranking Data Not Found

**Error**: `Ranking data not found`

**Solution**:
1. Ensure `data/processed/habitability_ranked_Milestone2.csv` exists
2. Run cell 2 in MLDP4.ipynb to generate the ranking file

### Issue: Import Errors

**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution**:
```bash
pip install -r requirements.txt
```

---

## 📊 Expected Output Examples

### Successful Prediction

```json
{
  "status": "success",
  "prediction_result": "Habitable",
  "confidence_score": 0.9234,
  "threshold_used": 0.0034,
  "planet_id": "Kepler-452b",
  "timestamp": "2026-01-28T10:35:00"
}
```

### Ranking Response

```json
{
  "status": "success",
  "total_planets": 1000,
  "returned_count": 10,
  "planets": [
    {
      "rank": 1,
      "habitability_score": 0.9876,
      "classification": "Habitable"
    }
  ]
}
```

---

## 🎯 Next Steps (Module 6)

After confirming the API works:

1. **Frontend Integration**: Connect React dashboard to these endpoints
2. **Database Connection**: Implement dynamic data retrieval
3. **Authentication**: Add JWT tokens for secured access
4. **Deployment**: Deploy to cloud platform (Azure/AWS/Heroku)

---

## 📞 Support

- Check `README.md` for detailed documentation
- Review `MLDP4.ipynb` for model details
- Contact your mentor for internship-specific questions

---

**Version**: 1.0.0  
**Last Updated**: January 28, 2026
