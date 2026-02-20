# 🚀 ExoHabitAI - FINAL ACTION PLAN - Execute NOW

**Date**: February 18, 2026  
**Status**: Ready to Deploy  
**Estimated Time**: 45 minutes

---

## ⚡ QUICK START - 3 STEPS

### ✅ STEP 1: Push Code to GitHub (5 minutes)

Copy and paste this into PowerShell:

```powershell
cd c:\Users\ujjwa\Desktop\InfosysProject\ExoHabitAI

# Initialize git
git init

# Add remote
git remote add origin https://github.com/GKSJ-Deepvision/B13-ExoHabitAI.git

# Configure git user
git config --global user.name "ExoHabitAI Dev"
git config --global user.email "dev@exohabitai.local"

# Commit all files
git add .
git commit -m "Deployment: Procfile, render.yaml, guides, and complete app ready"

# Set main branch and push
git branch -M main
git push -u origin main
```

**When it asks for password:**
- Option A: Paste your **GitHub Personal Access Token** (from: https://github.com/settings/tokens)
- Option B: Use **SSH** if already configured

**When successful, you'll see:**
```
Branch 'main' set up to track remote branch 'main' from 'origin'
```

✅ **Step 1 Complete!** Move to Step 2.

---

### ✅ STEP 2: Deploy Backend on Render (10 minutes)

#### 2.1 Go to Render & Connect
1. Open: https://render.com
2. Click "Sign up" (use GitHub)
3. Click "New +" → "Web Service"
4. Select repository: `B13-ExoHabitAI`

#### 2.2 Configure Backend
Use these exact settings:

```
Name:                    exohabitai-backend
Environment:             Python 3
Build Command:           pip install -r requirements.txt
Start Command:           gunicorn backend.app:app
Region:                  Oregon
Plan:                    Free
Auto-Deploy:             Yes
```

#### 2.3 Deploy
1. Click "Create Web Service"
2. **Wait for "Live" status** (5-10 min)
3. When green "Live" appears, **copy the URL**

**Example**: `https://exohabitai-backend.onrender.com`

#### 2.4 Test Backend
Open in browser: `https://your-url.onrender.com/status`

Should show JSON with `"status": "operational"`

✅ **Step 2 Complete!** Save Backend URL for Step 3.

---

### ✅ STEP 3: Deploy Frontend on Render (8 minutes)

#### 3.1 Create Static Site
Back on Render Dashboard:
1. Click "New +" → "Static Site"
2. Select: `B13-ExoHabitAI`

#### 3.2 Configure Frontend
Use these settings:

```
Name:                    exohabitai-frontend
Build Command:           cd frontend && npm install && npm run build
Publish Directory:       frontend/dist
Region:                  Oregon
Plan:                    Free
Auto-Deploy:             Yes
```

#### 3.3 Add Environment Variable ⭐ IMPORTANT
Before clicking "Create":

```
Key:   VITE_API_URL
Value: https://your-backend-url.onrender.com
       (Use the exact URL from Step 2!)
```

#### 3.4 Deploy
1. Click "Create Static Site"
2. **Wait for "Live" status** (3-5 min)
3. When green "Live" appears, **copy the URL**

**Example**: `https://exohabitai-frontend.onrender.com`

✅ **Step 3 Complete!** Your app is LIVE!

---

## 📝 AFTER DEPLOYMENT

### Test Everything Works

1. **Open frontend URL** in browser (from Step 3)
2. **Go to Predict page**
3. **Click "Load Sample Data"**
4. **Click "Predict Habitability"**
5. You should see:
   - Green "Habitable" badge
   - Confidence score
   - Planet details

### Collect Your URLs

Save these 3 URLs:
```
Backend:  https://exohabitai-backend.onrender.com
Frontend: https://exohabitai-frontend.onrender.com
GitHub:   https://github.com/GKSJ-Deepvision/B13-ExoHabitAI
```

### Take Screenshots (2 minutes)

1. **Render Dashboard** - Both services showing "Live"
2. **Frontend Home Page** - Full page view
3. **Predict Page** - With prediction results showing

### Submit to Instructor

- ✓ The 3 URLs (Backend, Frontend, GitHub)
- ✓ The 3 screenshots
- ✓ Confirmation that all pages work

---

## ⚠️ IF SOMETHING BREAKS

### "Branch not found" or push fails
→ Verify GitHub token is correct  
→ Try again with `--force`: `git push -u origin main --force`

### Backend shows "Build failed"
→ In Render: Click "Manual Deploy" to retry  
→ Check service logs for error details

### Frontend shows blank page
→ Press F12 → Console tab  
→ Should see NO red errors  
→ Verify `VITE_API_URL` environment variable is set

### API calls failing
→ Test backend directly: `https://your-backend-url/status`  
→ Should return JSON (not HTML error)  
→ If fails, backend isn't ready yet

### Takes forever to load
→ Free tier spins down after 15 min idle  
→ First request after spin-down takes 30-45 seconds  
→ Wait, then refresh page

---

## ✨ EXPECTED RESULTS

When complete, you should have:

```
✓ GitHub repository with all code
✓ Backend API running on Render (Live)
✓ Frontend app running on Render (Live)  
✓ All pages loading without errors
✓ Predict functionality working
✓ Batch upload accessible
✓ Rankings page working
✓ No console errors in browser
```

---

## 🎯 YOU ARE HERE

**Ready to start?**

1. Go to PowerShell
2. Copy/paste the Step 1 code
3. When push completes, go to Render.com
4. Follow Step 2 (Backend)
5. Follow Step 3 (Frontend)
6. Test your live app!

---

## ⏱️ Timeline

- Step 1 (Push): 5 min
- Step 2 (Backend): 10 min
- Step 3 (Frontend): 8 min
- Testing: 5 min
- **Total: ~30 minutes**

---

## 📞 During Deployment

**Watch for:**
- Branch being set to "main"
- Render showing "Build in Progress"
- Render showing "Live" (takes 5-10 min per service)
- Model loading message in backend logs
- "Build successful" in frontend logs

**If stuck:**
- Read the service logs carefully
- They usually explain the error
- Common: wrong env variable, missing dependency, GitHub auth failed

---

## 🚀 START NOW!

Open PowerShell → Copy the Step 1 code → Execute!

You've got this! 🎉

---

**Questions?** Check these files:
- `RENDER_DEPLOYMENT_STEPS.md` - Detailed Render steps
- `DEPLOYMENT_COMPLETE_GUIDE.md` - Full technical guide
- `test-deployment.sh` or `.bat` - Testing script (after deployment)

**Good luck! 🚀**
