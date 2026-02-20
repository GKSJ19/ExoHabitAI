# ExoHabitAI - Deployment Guide

## Prerequisites
- GitHub account with repository access
- Render account (https://render.com)
- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)

## Deployment Architecture
```
User (Browser)
  ↓
Frontend (Render or Vercel) - React + Vite
  ↓
Backend API (Render) - Flask + Gunicorn
  ↓
ML Model (XGBoost Hybrid Stack)
  ↓
Results
```

## Step 1: Backend Deployment (Render)

### 1.1 Prepare Backend
- ✓ Model file: `models/exohabit_hybrid_stack.pkl`
- ✓ Created: `Procfile` with command: `web: gunicorn backend.app:app`
- ✓ Updated: `backend/requirements.txt` with all dependencies
- ✓ Set: `app.run(debug=False)` for production

### 1.2 Deploy on Render
1. Go to https://render.com and sign up with GitHub
2. Click "New +" → "Web Service"
3. Select your GitHub repository: `GKSJ-Deepvision/B13-ExoHabitAI`
4. Configure the Web Service:
   - **Name:** `exohabitai-backend` (or your choice)
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn backend.app:app`
   - **Region:** Select closest to your location
5. Click "Create Web Service"
6. Wait for deployment to complete (5-10 minutes)
7. Copy the provided URL (e.g., `https://exohabitai-backend.onrender.com`)

### 1.3 Test Backend Endpoints
- Health Check: `https://your-backend-url.onrender.com/status`
- Model Info: `https://your-backend-url.onrender.com/model/info`
- Example Prediction: POST to `/predict` with planet data

## Step 2: Frontend Deployment (Render or Vercel)

### 2.1 Prepare Frontend
1. Create `frontend/.env.local`:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. Build production version:
   ```
   cd frontend
   npm run build
   ```

### 2.2 Deploy on Render (Recommended)
1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `exohabitai-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
5. Click "Create Static Site"
6. Add Environment Variables:
   - Go to the service settings
   - Under "Environment", add: `VITE_API_URL=https://your-backend-url.onrender.com`
7. Wait for deployment (3-5 minutes)
8. Your app is now live at the provided Render URL!

### 2.2 Alternative: Deploy on Vercel
1. Go to https://vercel.com, sign in with GitHub
2. Import your ExoHabitAI repository
3. Select "Frontend" as root directory
4. Add environment variables: `VITE_API_URL=https://your-backend-url.onrender.com`
5. Click Deploy

## Step 3: Configure CORS

If you get CORS errors:
1. Backend (Flask) already has CORS enabled with `CORS(app)`
2. Verify in `backend/app.py` that `flask-cors` is imported
3. In production, you can restrict origins:
   ```python
   CORS(app, resources={
       r"/predict": {"origins": ["https://your-frontend-url.com"]},
       r"/rank": {"origins": ["https://your-frontend-url.com"]},
   })
   ```

## Step 4: Testing the Deployed Application

After both frontend and backend are deployed:

1. **Test Home Page:**
   - Open your frontend URL
   - Verify all pages load without errors
   - Check that navbar and dashboard links work

2. **Test Prediction:**
   - Navigate to Predict page
   - Load sample data
   - Click "Predict Habitability"
   - Verify results display correctly

3. **Test Batch Upload:**
   - Navigate to Batch page
   - Upload sample CSV
   - Monitor progress
   - Verify results visualization

4. **Test Rankings:**
   - Navigate to Rankings page
   - Verify data loads
   - Check sorting and filtering

## Step 5: Monitor Deployment

### Render Dashboard
- Go to Services → View logs
- Check for errors and performance metrics
- Monitor API response times

### Frontend Performance
- Use browser DevTools (F12) → Network tab
- Check that API calls go to your deployed backend
- Verify no 404 or 500 errors

## Troubleshooting

### Backend Issues
| Error | Solution |
|-------|----------|
| Module not found | Ensure all packages in `requirements.txt` |
| Model not loading | Verify `exohabit_hybrid_stack.pkl` is committed to GitHub |
| CORS errors | Check Flask has `from flask_cors import CORS` and `CORS(app)` |

### Frontend Issues
| Error | Solution |
|-------|----------|
| API not responding | Verify `VITE_API_URL` env var points to correct backend |
| Home page blank | Check browser console (F12) for errors |
| Images/assets missing | Ensure `npm run build` was successful |

## Environment Variables Reference

### Backend (Render)
- No additional environment variables required
- Model and data files are included in repository

### Frontend (Render/Vercel)
- `VITE_API_URL` - Backend API URL (e.g., `https://exohabitai-backend.onrender.com`)
- `VITE_DEBUG` - Debug mode (set to `false` for production)

## Final Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Render/Vercel
- [ ] Environment variables configured
- [ ] All endpoints tested and working
- [ ] No console errors in browser
- [ ] API response times acceptable (<2s)
- [ ] Documentation saved
- [ ] GitHub repository has latest code
- [ ] Deployment URLs documented

## Support Resources

- Render Documentation: https://docs.render.com
- Flask Documentation: https://flask.palletsprojects.com
- Vite Documentation: https://vitejs.dev
- React Documentation: https://react.dev

---

**Deployment Date:** [Your Date]  
**Backend URL:** [Your Backend URL]  
**Frontend URL:** [Your Frontend URL]  
**Repository:** https://github.com/GKSJ-Deepvision/B13-ExoHabitAI
