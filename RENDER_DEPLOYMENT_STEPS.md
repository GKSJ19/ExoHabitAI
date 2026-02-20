# ExoHabitAI - Render Deployment - Step by Step

## 🎯 You are Here: Starting Render Deployment

### Requirements Before Starting:
- ✓ Code pushed to GitHub (GKSJ-Deepvision/B13-ExoHabitAI)
- ✓ Render account (free at render.com)
- ✓ GitHub connected to Render
- ✓ Time: ~30 minutes

---

## 📋 STEP 1: Deploy Backend (10 minutes)

### 1.1 Go to Render Dashboard
1. Open: https://render.com
2. Log in with GitHub (if not already logged in)
3. Click dashboard → view services

### 1.2 Create Web Service for Backend
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
   - (NOT static site - this is for dynamicAPI)
3. **Connect Repository**:
   - Search for: `B13-ExoHabitAI`
   - Click to select (may need to authorize)
   - Click **"Connect"**

### 1.3 Configure Backend Service
Fill in these exact values:

```
Name:                    exohabitai-backend
Environment:             Python 3
Region:                  Oregon (or closest to you)
Branch:                  main

Build Command:           pip install -r requirements.txt
Start Command:           gunicorn backend.app:app

Runtime:                 Python 3
Plan:                    Free
Instance Type:           Free
Auto-Deploy:             Yes
```

### 1.4 Click "Create Web Service"
- Watch the deployment logs
- Wait for: ✓ "Successfully deployed"
- Look for: ✓ "Model Loaded Successfully"

### 1.5 Get Your Backend URL
- Once "Live" status appears
- Copy the URL shown (example: `https://exohabitai-backend.onrender.com`)
- **SAVE THIS URL** ← Important!

### 1.6 Test Backend Endpoint
Open in browser:
```
https://your-backend-url.onrender.com/status
```

Expected response:
```json
{
  "status": "operational",
  ...
}
```

---

## 📋 STEP 2: Deploy Frontend (8 minutes)

### 2.1 Create Static Site for Frontend
Back in Render Dashboard:
1. Click **"New +"** button (top right)
2. Select **"Static Site"**
   - (YES - this one IS for static files)

### 2.2 Connect Repository
1. Select: `B13-ExoHabitAI` (same repo)
2. Click **"Connect"**

### 2.3 Configure Frontend Service
Fill in these values:

```
Name:                    exohabitai-frontend
Branch:                  main
Build Command:           cd frontend && npm install && npm run build
Publish Directory:       frontend/dist
Region:                  Oregon (same as backend)
Plan:                    Free
Auto-Deploy:             Yes
```

### 2.4 Add Environment Variable
**IMPORTANT - Must do this BEFORE clicking Create**

1. Scroll down to "Environment"
2. Click **"Add Environment Variable"**
3. Fill in:
   ```
   Key:   VITE_API_URL
   Value: https://your-backend-url.onrender.com
          (Use the URL from Step 1.5)
   ```
4. Click **"Create Static Site"**

### 2.5 Wait for Deployment
- Frontend will build (~3-5 minutes)
- Look for: ✓ "Build successful"
- When "Live" appears
- Copy the frontend URL (example: `https://exohabitai-frontend.onrender.com`)
- **SAVE THIS URL** ← Important!

---

## ✅ STEP 3: Test Your Deployment (5 minutes)

### 3.1 Test Home Page
1. Open your frontend URL
2. Should see:
   - ✓ ExoHabitAI logo/header
   - ✓ Hero section with animations
   - ✓ "Predict" and "Rankings" buttons

### 3.2 Test Predict Page
1. Click "Predict" (or navigate to /predict)
2. Click **"Load Sample Data"** button
3. Click **"Predict Habitability"** button
4. You should see:
   - ✓ Green "Habitable" or red "Not Habitable"
   - ✓ Confidence score bar
   - ✓ Planet details

### 3.3 Test Other Pages
- [ ] Home - Loads and displays
- [ ] Predict - Sample loads and predicts
- [ ] Batch - Page loads
- [ ] Rankings - Data displays
- [ ] About - Shows info
- [ ] Dashboard - Shows page

### 3.4 Check for Errors
Press **F12** in browser → **Console** tab:
- Should see NO red errors
- API calls should show as successful

---

## 📸 STEP 4: Capture Screenshots (2 minutes)

Take 3 screenshots:

### Screenshot 1: Render Dashboard
- Show both services with "Live" status
- [Save as: `render-dashboard.png`]

### Screenshot 2: Frontend Home Page
- Show full page with hero section
- [Save as: `frontend-home.png`]

### Screenshot 3: Prediction Working
- Show Predict page with results displayed
- [Save as: `prediction-result.png`]

---

## 📝 STEP 5: Document Your URLs

Create a file called `DEPLOYMENT_URLS.txt`:

```
ExoHabitAI Deployment - February 18, 2026

Backend API URL:
https://your-backend-url.onrender.com

Frontend URL:
https://your-frontend-url.onrender.com

GitHub Repository:
https://github.com/GKSJ-Deepvision/B13-ExoHabitAI

Deployment Status: ✓ LIVE

Test Results:
✓ Backend /status endpoint working
✓ Frontend loads without errors
✓ Predict functionality working
✓ All pages accessible
✓ No console errors

Deployed: February 18, 2026
```

---

## 🎉 SUCCESS CHECKLIST

- [ ] Backend service shows "Live" in Render
- [ ] Frontend service shows "Live" in Render
- [ ] Frontend URL loads in browser
- [ ] Home page displays correctly
- [ ] Predict page works (sample → predict → results)
- [ ] No errors in browser console (F12)
- [ ] All pages accessible (Navigate between them)
- [ ] Screenshots captured (3 files)
- [ ] URLs documented

---

## ⚠️ TROUBLESHOOTING

### Backend Won't Start
**Error**: "gunicorn: command not found"
**Fix**: 
- Check requirements.txt has gunicorn
- Verify in backend/ folder
- Render sometimes needs rebuild: Click "Manual Deploy"

### Frontend Shows Blank Page
**Error**: Browser shows nothing
**Fix**:
1. Press F12 → Console
2. Look for API errors
3. Check that VITE_API_URL is set correctly
4. Verify backend URL is accessible
5. In Render, go to Frontend → Environment → check `VITE_API_URL`

### API Calls Fail
**Error**: "Cannot reach backend" or CORS errors
**Fix**:
1. Verify backend URL is correct in VITE_API_URL
2. Test backend /status endpoint directly in browser
3. Backend should be "Live" (not "Deploy failed")

### Build Fails
**Error**: "Build failed" in Render logs
**Fix**:
1. Click "Manual Deploy" to retry
2. Check logs for specific errors
3. Common: missing npm packages
4. Try locally first: `npm run build` in frontend/

---

## 🚀 What Happens Next

After successful deployment:

1. **Your app is LIVE** 🎉
2. **Can share URLs** with anyone
3. **Apps may spin down** after 15 min idle (free tier)
4. **First request takes 30s** after spin-down
5. **To always-on**: Upgrade to Paid plan

---

## 📞 Getting Help

If stuck:
1. Check Render Service Logs (click service → Logs)
2. Read error messages carefully
3. Try "Manual Deploy" for retry
4. Check that VITE_API_URL environment variable is set
5. Verify both services are "Live"

---

## ✨ Ready?

**Next Action**: Go to https://render.com and start with Step 1 above!

Questions? Check DEPLOYMENT_COMPLETE_GUIDE.md for more details.

All files are ready. You've got this! 🚀
