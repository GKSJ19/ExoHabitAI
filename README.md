# 🌌 ExoHabitAI  
**AI-Powered Exoplanet Habitability Prediction & Ranking**

ExoHabitAI is a full-stack machine learning web application that predicts and ranks the habitability of exoplanets using planetary and stellar parameters. It integrates data preprocessing, machine learning, backend APIs, and an interactive frontend to deliver real-time habitability insights.

---

## 🚀 Live Demo
🔗 **Deployed Application:**  
https://janhvi01-exohabitai.hf.space

---

## 📌 Project Overview
ExoHabitAI uses astrophysical data from the **NASA Exoplanet Archive** to:
- Predict whether an exoplanet is **potentially habitable**
- Provide a **confidence score**
- Rank multiple exoplanets by habitability probability

The project demonstrates an end-to-end ML workflow from data preprocessing and model training to deployment and visualization.

---

## 📊 Dataset Description
- **Source:** NASA Exoplanet Archive  
- **Mission Focus:** TESS  
- **Records:** ~39,000 confirmed exoplanets  
- **Time Range:** 1992 – 2026  

### Selected Features
Planet radius, mass, density, orbital parameters, equilibrium temperature, and host star properties were retained. Redundant units, administrative metadata, and sparse uncertainty columns were removed to improve model performance.

---

## 🧹 Data Preprocessing
- Missing value analysis and imputation (median/mode)
- Removal of physically invalid values
- Outlier handling using IQR
- Feature scaling with `StandardScaler`

### Feature Engineering
- **Habitability Score Index** (Earth-like temperature and radius proximity)
- **Orbital Stability Factor** (orbital period / semi-major axis)

Final dataset: `preprocessed.csv`

---

## 🤖 Machine Learning Model
- **Type:** Binary Classification (Habitable / Not Habitable)

### Models Used
- Logistic Regression
- Random Forest
- XGBoost

Models were evaluated using Accuracy, Precision, Recall, F1-score, and ROC-AUC.  
The best-performing model was saved as `best_exohabit_model.pkl`.

---

## 🛠️ Backend (Flask API)
A Flask-based REST API serves the trained model.

### Endpoints
- `GET /` – Health check  
- `POST /predict` – Single exoplanet prediction  
- `POST /rank` – Multi-exoplanet ranking  

The model is dynamically loaded from the **Hugging Face Model Hub**.

---

## 🎨 Frontend
Built using HTML, CSS, Bootstrap, and JavaScript with a space-themed UI.

### Features
- Single and JSON-based predictions  
- Multi-planet ranking  
- Interactive charts (Radar & Bar)  
- Input validation and error handling  

---

## 🌐 Deployment
- **Platform:** Hugging Face Spaces  
- **Backend:** Flask + Gunicorn  
- **Model Hosting:** Hugging Face Model Hub  

Frontend connects dynamically using:
```js
const API = window.location.origin;