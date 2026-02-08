# 🌌 ExoHabitAI Frontend

A modern and responsive web application for predicting the habitability of exoplanets using machine learning. This frontend connects with the ExoHabitAI Flask backend to provide real-time predictions, batch processing, and ranking analysis.

---

## 📌 Project Overview

ExoHabitAI Frontend is designed to help users analyze exoplanet data and determine whether a planet is habitable or not. It provides a clean UI, smooth animations, and powerful visualization features.

The system works in integration with the Flask-based backend API.

- Backend URL: http://localhost:5000  
- Frontend URL: http://localhost:3000  

---

## ⚙️ Technology Stack

- React 18 – User Interface
- Vite – Build Tool
- Tailwind CSS – Styling
- React Router – Page Navigation
- Axios – API Requests
- Framer Motion – Animations
- Chart.js – Data Visualization
- Lucide React – Icons

---

## 📁 Project Structure

frontend/
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Application pages
│ ├── services/ # API integration
│ ├── App.jsx # Main app
│ ├── main.jsx # Entry point
│ └── index.css # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js


---

## 🛠️ Installation & Setup

### Step 1: Install Dependencies

```bash
##cd frontend
npm install

Step 2: Configure Environment

Create a .env file:

cp .env.example .env


Edit .env file:

VITE_API_URL=http://localhost:5000

Step 3: Run Development Server
npm run dev


Open in browser:

http://localhost:3000

🔌 API Integration

All API requests are handled in:

src/services/api.js


Example:

import { apiService } from "../services/api";

apiService.getStatus();
apiService.predictHabitability(data);
apiService.predictBatch(planets);
apiService.getRanking(top, minScore);

🌟 Features
🏠 Home Page

Animated hero section

Project overview

Quick navigation buttons

🔮 Single Prediction

Input form with validation

Sample data loader

Habitability status

Confidence score display

📦 Batch Prediction

JSON input support

Sample format loader

Downloadable results

🏆 Ranking System

Top planets list

Score filters

Medal system for top 3

ℹ️ About Page

Project details

Technology stack

Milestone information

🎨 User Interface

Dark space-themed layout

Glass-morphism cards

Gradient text

Smooth animations

Fully responsive design

📱 Responsive Design
Device	Width Range
Mobile	< 640px
Tablet	640px - 1024px
Desktop	> 1024px
🧪 Testing Procedure
Start Backend
cd backend
python app.py

Start Frontend
cd frontend
npm run dev

Test Flow

Open Home Page

Navigate to Prediction

Load sample data

Submit values

View results

Try Batch and Ranking pages

🏗️ Production Build
npm run build
npm run preview


Build files will be generated in:

dist/

🔧 Troubleshooting
Backend Not Connecting

Check backend is running

Verify API URL in .env

Enable CORS in Flask

Dependency Errors
rm -rf node_modules
rm package-lock.json
npm install

Port Conflict
npx kill-port 3000

🚀 Deployment Options

Vercel

Netlify

GitHub Pages

📜 License

This project is part of the Infosys Internship Program.

👤 Author

Your Name
Infosys Internship
ExoHabitAI Project
Milestone 3 (Module 6)

❤️ Acknowledgement

Built with React, Tailwind CSS, and Machine Learning integration.


---

If you want, I can now:

✅ Customize this with **your real name & college**  
✅ Convert this into **Word/PDF format**  
✅ Shorten it for **viva/mentor presentation**

