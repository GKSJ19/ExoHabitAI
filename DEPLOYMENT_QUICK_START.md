# ExoHabitAI - Quick Deployment Checklist

## Pre-Deployment ✓
- [x] Flask backend app.py ready with model loading
- [x] requirements.txt updated with all dependencies
- [x] Procfile created for production
- [x] Model file (exohabit_hybrid_stack.pkl) in models/
- [x] Frontend API service configured with env variable support
- [x] CORS enabled in Flask backend

## Render Deployment Steps

### Backend (5-10 minutes)
1. Go to https://render.com → Sign in with GitHub
2. Click "New+" → "Web Service"
3. Select repository: GKSJ-Deepvision/B13-ExoHabitAI
4. Configure:
   - Name: `exohabitai-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn backend.app:app` (Procfile auto-detected)
5. Click "Create Web Service"
6. Wait for deployment
7. **Save the URL** (e.g., https://exohabitai-backend.onrender.com)

### Frontend (3-5 minutes)
1. In Render Dashboard, click "New+" → "Static Site"
2. Select same repository
3. Configure:
   - Name: `exohabitai-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
4. Add Environment Variables (in service settings):
   - Key: `VITE_API_URL`
   - Value: `https://exohabitai-backend.onrender.com` (from Step 1)
5. Click "Create Static Site"
6. Wait for deployment
7. **Frontend URL is now live!** (Check Render Dashboard for URL)

## Post-Deployment Testing

### Test Endpoints
```bash
# Health check
curl https://your-backend-url.onrender.com/status

# Model info
curl https://your-backend-url.onrender.com/model/info
```

### Test Frontend
1. Open https://your-frontend-url.onrender.com
2. Test each page:
   - [ ] Home page loads
   - [ ] Predict page works (load sample, predict)
   - [ ] Batch upload works
   - [ ] Rankings page displays data
3. Check browser console (F12) for errors

## Deliverables

Submit to your instructor:
- [ ] Live backend URL
- [ ] Live frontend URL
- [ ] GitHub repository link
- [x] Backend requirements.txt
- [x] Procfile
- [x] Deployment guide (DEPLOYMENT.md)
- [ ] Screenshots of working app
- [ ] API response test results

## Common Errors & Fixes

| Problem | Solution |
|---------|----------|
| "Module not found" on Render | Check requirements.txt has all imports |
| "Model not found" | Ensure models/ folder committed to GitHub |
| Frontend shows blank page | Check browser F12 console, verify VITE_API_URL set |
| API calls fail (CORS error) | Verified CORS enabled in Flask (it is) |

## Resources
- Render Docs: https://docs.render.com
- Troubleshooting: See DEPLOYMENT.md for detailed guide
