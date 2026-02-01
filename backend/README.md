# ExoHabitAI – Backend (Flask API)

This folder contains the backend implementation of **ExoHabitAI**, developed using Flask.
It exposes the trained machine learning model through REST APIs for exoplanet habitability
prediction and ranking.

---

## 📁 Backend Structure

backend/
│
├── app.py # Main Flask application
├── utils.py # Input validation and preprocessing
├── feature_columns.pkl # Saved feature order from training
├── models/
│ └── habitability_model.pkl
└── README.md

## ⚙️ Environment Setup

### Requirements
- Python 3.x
- Flask
- NumPy
- Pandas
- Joblib
- XGBoost

Install dependencies using:

```bash
pip install flask numpy pandas joblib xgboost

▶ Running the Backend Server

Open terminal / PowerShell

Navigate to the backend folder:

cd backend


Start the Flask server:

python app.py


The backend will start at:

http://127.0.0.1:5000

🔮 API Endpoints
1️⃣ /predict (POST)

Predicts whether an exoplanet is habitable.

Request Format (JSON):

{
  "pl_rade": 1.1,
  "pl_bmasse": 0.9,
  "pl_orbper": 365,
  "pl_eqt": 288,
  "st_spectype": "G"
}

Response Format:

{
  "prediction": 0
}

2️⃣ /rank (POST)

Ranks multiple exoplanets based on habitability score.

Request Format (JSON):

{
  "planets": [
    {
      "name": "EarthLike",
      "pl_rade": 1.1,
      "pl_bmasse": 1.0,
      "pl_orbper": 365,
      "pl_eqt": 288,
      "st_spectype": "G"
    },
    {
      "name": "HotPlanet",
      "pl_rade": 3.5,
      "pl_bmasse": 8.0,
      "pl_orbper": 50,
      "pl_eqt": 900,
      "st_spectype": "M"
    }
  ]
}

Response Format:

{
  "status": "success",
  "ranked_planets": [
    {"name": "EarthLike", "score": 0.0},
    {"name": "HotPlanet", "score": 0.0}
  ]
}

🧪 Testing

The backend APIs were tested using:

PowerShell (Invoke-RestMethod)

Browser

Manual JSON requests

✅ Status

Backend API integration is complete and functional as per project requirements.
