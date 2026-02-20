# ExoHabitAI - Complete Deployment Walkthrough

## Overview
This guide covers the entire deployment process from code push to live application.

**Total Time: 30-45 minutes**

---

## Phase 1: Local Preparation (5 minutes)

### 1.1 Verify All Deployment Files

Run this command to check everything is in place:

```powershell
cd c:\Users\ujjwa\Desktop\InfosysProject\ExoHabitAI

# Check essential files
Test-Path Procfile
Test-Path backend\requirements.txt
Test-Path backend\app.py
Test-Path frontend\package.json
Test-Path models\exohabit_hybrid_stack.pkl
Test-Path DEPLOYMENT.md
```

**Expected output: All should be `True`**

### 1.2 (Optional) Run Local Build Verification

```powershell
# Test backend can start
cd backend
python app.py
# Wait 5 seconds, then Ctrl+C to stop
# Should see: "✓ ExoHabitAI Model Loaded Successfully"

# Test frontend build
cd ..\frontend
npm run build
# Should complete without errors and create dist/ folder
```

---

## Phase 2: Push to GitHub (5 minutes)

### 2.1 Initialize Git and Push

```powershell
cd c:\Users\ujjwa\Desktop\InfosysProject\ExoHabitAI

# Configure git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Initialize repository
git init
git remote add origin https://github.com/GKSJ-Deepvision/B13-ExoHabitAI.git

# Commit and push
git add .
git commit -m "Deployment: Procfile, requirements, and guides ready"
git branch -M main
git push -u origin main
```

### 2.2 Handle Authentication

When prompted for password:
- **Use GitHub Personal Access Token** (recommended)
  1. Go to https://github.com/settings/tokens
  2. Generate new token (classic)
  3. Scope: `repo` (full control)
  4. Copy token and paste when prompted
  
- **OR Use GitHub CLI**
  ```powershell
  gh auth login
  # Follow prompts
  git push -u origin main
  ```

### 2.3 Verify Push

Visit: https://github.com/GKSJ-Deepvision/B13-ExoHabitAI

You should see all your files in the repository.

---

## Phase 3: Deploy Backend on Render (10 minutes)

### 3.1 Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Render to access your GitHub account
5. Click "Create free account"

### 3.2 Create Backend Web Service

1. In Render Dashboard, click **"New +"** in top-right
2. Select **"Web Service"**
3. Under "Connect a repository":
   - Search for: `B13-ExoHabitAI`
   - Click to select
4. Configure the Web Service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `exohabitai-backend` |
   | **Environment** | Python 3 |
   | **Region** | Oregon (or closest to you) |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `gunicorn backend.app:app` |
   | **Plan** | Free |

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. **IMPORTANT: Save your backend URL** from the dashboard
   - It will look like: `https://exohabitai-backend.onrender.com`

### 3.3 Verify Backend Deployment

```
Test these URLs in your browser:
- https://your-backend-url.onrender.com/status
- https://your-backend-url.onrender.com/model/info

You should get JSON responses ✓
```

---

## Phase 4: Deploy Frontend on Render (8 minutes)

### 4.1 Create Frontend Static Site

1. In Render Dashboard, click **"New +"**
2. Select **"Static Site"**
3. Under "Connect a repository":
   - Select `B13-ExoHabitAI` (again)
4. Configure the Static Site:

   | Setting | Value |
   |---------|-------|
   | **Name** | `exohabitai-frontend` |
   | **Build Command** | `cd frontend && npm install && npm run build` |
   | **Publish Directory** | `frontend/dist` |
   | **Plan** | Free |

5. Click **"Create Static Site"**

### 4.2 Add Environment Variables

1. After creation, go to your Frontend service
2. Click **"Environment"** in left sidebar
3. Click **"Add Environment Variable"**
4. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com` (from Phase 3)
5. Click "Save"
6. Render will auto-redeploy with the new env var

### 4.3 Wait for Frontend Deployment

- Watch the "Logs" tab as deployment happens
- Look for: "Build successful"
- You'll see your Frontend URL like: `https://exohabitai-frontend.onrender.com`

---

## Phase 5: End-to-End Testing (5 minutes)

### 5.1 Test Frontend

1. Open: `https://your-frontend-url.onrender.com`
2. Test each page:
   | Page | Expected Result |
   |------|-----------------|
   | Home | Loads with hero animation |
   | Predict | Can enter planet data |
   | Batch | Can upload CSV |
   | Rankings | Shows exoplanet data |
   | About | Displays project info |

### 5.2 Test Predictions

1. Go to Predict page
2. Click "Load Sample Data"
3. Click "Predict Habitability"
4. You should see:
   - Green "Habitable" or red "Not Habitable" badge
   - Confidence score bar
   - Planet details

### 5.3 Test Batch Upload

1. Go to Batch page
2. Upload a CSV with exoplanet data
3. Wait for processing (backend calls model)
4. See results visualization

### 5.4 Check Browser Console

Press **F12** → **Console** tab

You should see:
- ✓ No red errors
- ✓ API calls succeeding

If you see CORS errors:
- Verify `VITE_API_URL` env var is set correctly
- Check backend URL is accessible

---

## Phase 6: Final Deliverables (2 minutes)

Create a screenshot showing:

### Screenshot 1: All Services Running
```
Render Dashboard → View both services
 ✓ exohabitai-backend (Live)
 ✓ exohabitai-frontend (Live)
```

### Screenshot 2: Frontend Working
```
Browser showing: https://your-frontend-url.onrender.com
 ✓ Home page displays
 ✓ Navigation working
```

### Screenshot 3: Prediction Working
```
Browser showing Predict page
 ✓ Sample data loaded
 ✓ Prediction result displayed (Habitable/Not Habitable)
 ✓ Confidence score visible
```

### Document These URLs

**Submit to instructor:**
```
Backend URL: https://exohabitai-backend.onrender.com
Frontend URL: https://exohabitai-frontend.onrender.com
GitHub: https://github.com/GKSJ-Deepvision/B13-ExoHabitAI
```

---

## Troubleshooting

### Backend Won't Start
```
Error: "gunicorn: command not found"
→ requir ements.txt missing gunicorn
→ Verify requirements.txt is in root backend folder
```

### Frontend Shows Blank Page
```
Error: In browser console "Cannot connect to API"
→ VITE_API_URL env var not set
→ Go to Frontend service → Environment
→ Add VITE_API_URL = your-backend-url
→ Redeploy
```

### API Calls Return 404
```
Error: POST /predict returns 404
→ Backend didn't deploy correctly
→ Check backend service logs
→ Verify Procfile command is: gunicorn backend.app:app
```

### Model Not Loading
```
Error: "Model file not found"
→ exohabit_hybrid_stack.pkl not in GitHub
→ Git commit must include models/ folder
→ Verify: git status shows models/exohabit_hybrid_stack.pkl
```

---

## Success Criteria ✓

You've successfully deployed when:

- [ ] Backend URL responds to /status
- [ ] Frontend URL loads without errors
- [ ] Predict page can load sample data
- [ ] Prediction returns results
- [ ] No CORS errors in console
- [ ] All pages accessible and working
- [ ] Screenshots taken and saved
- [ ] URLs documented

---

## Next Steps

Once live:

1. **Monitor Performance** - Check Render Dashboard logs
2. **Add Custom Domain** - Render allows custom domains (premium)
3. **Enable Auto-Deploy** - GitHub pushes auto-deploy on Render
4. **Scale Up** - Upgrade from Free to Starter plan if needed

---

## Support

- Render Docs: https://docs.render.com
- Flask Docs: https://flask.palletsprojects.com
- Vite Docs: https://vitejs.dev
- GitHub Docs: https://docs.github.com

---

**Total Deployment Time: 30-45 minutes**  
**Status: Ready for Production** ✓
