🪐 ExoHabitAI:  A Predictive Machine Learning Model for Evaluating the Potential Habitability of Exoplanets
Deployed on: Vercel (Frontend) | Render (Backend)
Tech Stack: Python 3.8+ | React 18


🔗 Live Demo: https://exohabit-ai-sigma.vercel.app
🔗 API Base URL: https://exohabitai-backend.onrender.com



📋 Project Overview
ExoHabitAI is a full-stack machine learning web application designed to identify potentially habitable exoplanets using NASA's confirmed exoplanet dataset.
It leverages a Hybrid Stacking Ensemble Model (XGBoost + Random Forest) to analyze 39 astronomical and physical parameters, achieving:


🎯 83.33% Recall


📈 99.17% Accuracy


⚡ <50ms Prediction Time



⚡ Quick Stats


🌍 1,089 exoplanets analyzed


🟢 13 habitable candidates identified


📊 99.17% model accuracy


🎯 83.33% recall rate


🔬 39 features per planet


⚡ <50ms prediction latency



⭐ Key Features
🎬 Cinematic User Experience


🌌 3D Black Hole Visualization (Three.js)


🎨 Glassmorphism UI with gradient themes


✨ Smooth animations using Framer Motion


📱 Fully responsive design



🧠 Intelligent ML Engine


🤖 Hybrid Stacking Model (XGBoost + Random Forest)


🎯 Recall-optimized threshold (0.0763)


🔍 39-feature deep analysis


⚡ Real-time predictions



📊 Interactive Analytics Dashboard


📌 4 Dynamic stat cards


📈 4 Interactive charts


📄 PDF & CSV export


🔄 Real-time backend sync



🚀 Batch Processing


📂 Analyze 100+ planets at once


📥 CSV upload support


📊 Progress tracking


📉 Interactive result visualization



🏆 Ranking & Discovery


🥇 Habitability ranking system


🌍 Top candidate planets list


📑 Detailed metadata


🏅 Visual badges (trophy, medal)




🖼️ Screenshots


🌌 Homepage (3D Visualization)

📊 Dashboard Analytics

🔍 Prediction Interface




🛠️ Technology Stack
LayerTechnologyVersionFrontendReact + Vite18.2.0 + 5.4.21StylingTailwind CSS3.4.0AnimationsFramer Motion10.18.03D GraphicsThree.js + React Three Fiber0.182.0 + 8.15.12ChartsChart.js4.4.1BackendFlask3.0.0ML ModelsXGBoost + Scikit-learn2.0.0 + 1.3.0DataPandas + NumPy2.0.0 + 1.24.0ServerGunicorn21.2.0DeploymentVercel + RenderLatest




📊 Model Performance
MetricValueMeaningAccuracy99.17%Overall correctnessRecall83.33%Detects most habitable planetsPrecision38.46%Trade-off for higher recallF1 Score52.63%Balanced performanceThreshold0.0763Optimized decision boundary



🚀 Quick Start
🔧 Local Development
Backend
cd backendpython -m venv venvsource venv/bin/activate   # Windows: venv\Scripts\activatepip install -r requirements.txtpython app.py
Frontend

cd frontendnpm installecho "VITE_API_URL=http://localhost:5000" > .envnpm run dev
🌐 Visit: http://localhost:5173



🌍 Live Deployment


Frontend: https://exohabit-ai-sigma.vercel.app


Backend: https://exohabitai-backend.onrender.com




📡 API Endpoints
MethodEndpointDescriptionGET/statusHealth checkGET/model/infoModel infoPOST/predictSingle predictionPOST/predict/batchBulk predictionGET/rankTop candidatesGET/planet/<index>Planet detailsGET/dashboard/statsDashboard statsGET/dashboard/feature-importanceFeature importanceGET/dashboard/correlationsCorrelation data



📁 Project Structure
ExoHabitAI/├── backend/├── frontend/├── data/├── notebooks/├── Procfile├── screenshots/└── README.md


🎓 Deployment Guide
Backend (Render)
web: gunicorn backend.app:app
Frontend (Vercel)
VITE_API_URL=https://exohabitai-backend.onrender.com



🧪 Testing
cd backend && pytest test_api.py -vcd frontend && npm run buildcurl https://exohabitai-backend.onrender.com/status



🐛 Troubleshooting
IssueSolutionAPI ErrorCheck .env URLPort IssueKill process on 5000Build FailureClear npm cacheModel ErrorVerify model + joblib


🎯 Milestones


✅ Data Processing


✅ ML Model Development


✅ Backend API


✅ Frontend UI


✅ 3D Visualization


✅ Dashboard


✅ 🚀 Production Deployment



📝 License
MIT License

👨‍💻 Author
Developed by: UJJWAL KUMAR

Internship: Infosys Springboard Virtual Internship 6.0

Last Updated: February 2026


🌌 Final Note

Exploring the Universe, One Planet at a Time 




