# ExoHabitAI

## Project Description
ExoHabitAI is an AI-based system that predicts the habitability potential of exoplanets using planetary and stellar parameters.

## Tech Stack
-- numpy
-- pandas
-- matplotlib
-- seaborn
-- scikit-learn
-- xgboost
-- flask
-- joblib
-- requests
-- plotly
-- gunicorn
*** Module 1: Data Collection and Management
Objectives
-Collect exoplanet datasets from:

NASA Exoplanet Archive

Store data in: CSV format
Validate schema and ensure completeness

#Example Dataset Features
Planet radius
Planet mass
Planet density
Surface temperature
Orbital period
Distance from star
Host star type
Stellar luminosity
Stellar temperature
Metallicity

***Module 2: Data Cleaning and Feature Engineering
Data Preprocessing
-Handle missing values
-Remove or treat outliers
-Fix inconsistent entries
Feature Engineering
-One-hot encoding for categorical features (e.g., star type)
-Normalize numerical features

Create custom indices:
-Habitability Score Index
-Stellar Compatibility Index

Data Validation

-Descriptive statistics
-Correlation analysis

***Module 3: Machine Learning Dataset Preparation
-Train-test split (80:20)
-Feature selection based on correlation
-Define target variable:
-Binary classification (Habitable / Non-Habitable)
-Multi-class habitability levels Or continuous habitability score

Build ML pipelines:
-Scaling
-Encoding
-Feature selection

*** Module 4: AI Model for Habitability Prediction
Models Used
Random Forest Classifier
XGBoost Classifier

Evaluation Metrics

-Accuracy
-Precision
-Recall
-F1-score
-ROC-AUC

Output

-Predict habitability class
-Generate habitability score
-Rank exoplanets based on predictions

*** Module 5: Flask Backend API
Features

REST API endpoints

Accept planetary parameter input

Return:

-Habitability prediction
-Probability score
-Ranking information
-JSON response structure

-Database connectivity
-CORS support
-Secure API endpoints

Example Endpoint
POST /predict

*** Module 6: Frontend UI Development
Features

Responsive design

Input form for planetary parameters

Display:

-Habitability prediction

-Score visualization

-Ranking tables

Clean UI using:

-HTML
-CSS
-Vite + modern stack

Frontend
-HTML / CSS / Bootstrap
OR Vite + JavaScript
-Database
-CSV storage

Backend Setup
cd backend
pip install -r requirements.txt
python app.py

Backend runs at: http://127.0.0.1:5000
Frontend Setup
-cd frontend
-cd habitable-worlds-finder-main
npm install
npm run dev

Frontend runs at: http://localhost:5173
Connecting Frontend & Backend
-Ensure frontend API calls use:
-fetch("http://127.0.0.1:5000/predict", {...})

For deployment, replace with:
https://exohabitai-ux25.onrender.com

Deploy Backend on Render
Create Procfile in project root:

web: gunicorn backend.app:app
Go to dashboard.render.com

Click New + → Web Service

Connect your GitHub repository

Configure:

Name: exohabitai-backend
Runtime: Python 3
Build Command: pip install -r backend/requirements.txt
Start Command: gunicorn backend.app:app
Click Create Web Service

Copy the live URL (e.g., https://exohabitai-backend.onrender.com)

Phase 2: Deploy Frontend on Vercel
Update frontend/.env:

VITE_API_URL=https://exohabitai-backend.onrender.com
-Go to vercel.com
-Click Add New → Project
-Import your GitHub repository

Configure:

Framework: Vite
-Root Directory: frontend
-Environment: VITE_API_URL
-Click Deploy
