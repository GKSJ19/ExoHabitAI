# ExoHabitAI Backend API — Refined Documentation

## 1. Objective

Expose the Hybrid Stacking Ensemble (Milestone 2) through a secure, scalable REST API so users can query habitability without direct access to Python artifacts.

## 2. Model & Decision Logic

### 2.1 Intelligence Engine

- **Ensemble Type:** Stacking Classifier
- **Base Models:** XGBoost, Random Forest
- **Meta Learner:** Logistic Regression
- **Preprocessing:** Standard Scaler

### 2.2 Discovery Threshold

To preserve recall, the classifier uses a tuned threshold instead of $0.5$:

- **Optimized Threshold:** $0.0763$
- **Rule:** if $p \ge 0.0763$, classify as **Habitable**

## 3. Architecture Overview

- **Framework:** Flask
- **Model Loading:** Joblib
- **CORS:** Enabled for frontend integration
- **Validation:** `utils.py` enforces required features and numeric types

## 4. Endpoints Reference

### 4.1 Health Check

- **URL:** `/status`
- **Method:** `GET`
- **Purpose:** Service status and model readiness

### 4.2 Single Prediction

- **URL:** `/predict`
- **Method:** `POST`
- **Body:** JSON with all 39 features (plus optional `pl_name`)
- **Response:** Prediction, confidence, threshold, timestamp

### 4.3 Batch Prediction

- **URL:** `/predict/batch`
- **Method:** `POST`
- **Body:** `{ "planets": [ {...}, {...} ] }`
- **Response:** Per-planet results with indices and statuses

### 4.4 Habitability Ranking

- **URL:** `/rank`
- **Method:** `GET`
- **Query:**
  - `top` (int, default 10)
  - `min_score` (float, default 0.0)

### 4.5 Model Info

- **URL:** `/model/info`
- **Method:** `GET`
- **Purpose:** Model specs, features list, threshold

### 4.6 Planet Details

- **URL:** `/planet/<index>`
- **Method:** `GET`
- **Purpose:** Metadata and prediction info for a specific index

## 5. Input Validation & Error Handling

Validation ensures all 39 features are present and numeric.

| Scenario | HTTP Code | Example Response |
| --- | --- | --- |
| Missing features | 400 | `{ "message": "Invalid input features", "details": [...] }` |
| Non-numeric values | 400 | `{ "message": "Invalid input features", "details": [...] }` |
| Empty payload | 400 | `{ "message": "No input data provided" }` |
| Model not loaded | 503 | `{ "message": "Model not loaded" }` |
| Unknown endpoint | 404 | `{ "message": "Endpoint not found" }` |

## 6. Quick Start

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Run the Server

```bash
python app.py
```

### Step 3: Verify

```bash
curl http://localhost:5000/status
```

## 7. Example Requests

### Single Prediction

```json
{
  "pl_name": "Kepler-186f",
  "pl_dens": 5.26,
  "pl_orbper": 129.9,
  "pl_insol.1": 0.41,
  "st_mass": 0.54,
  "st_rad": 0.52
}
```

### Batch Prediction

```json
{
  "planets": [
    { "pl_name": "Planet A", "pl_dens": 5.5, "pl_bmasse": 1.2, "pl_orbper": 20.5, "pl_insol.1": 0.7, "st_mass": 0.9, "st_rad": 0.8 },
    { "pl_name": "Planet B", "pl_dens": 1.2, "pl_bmasse": 0.4, "pl_orbper": 6.1,  "pl_insol.1": 2.1, "st_mass": 1.1, "st_rad": 1.0 }
  ]
}
```

### Ranking Query

`/rank?top=5&min_score=0.9`

## 8. Testing

```bash
pytest test_api.py -v
```

## 9. Data Dependencies

- Model: `../models/exohabit_hybrid_stack.pkl`
- Ranking Data: `../data/processed/habitability_ranked_Milestone2.csv`
- Metadata: `../data/processed/final-preprocessed6.csv`

## 10. Version

**Version:** 1.1.0  
**Last Updated:** February 7, 2026
