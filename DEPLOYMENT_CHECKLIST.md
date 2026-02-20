# ExoHabitAI - Deployment Checklist

## Pre-Deployment Verification ✓

### Backend Files
- [x] `backend/app.py` - Flask API with model loading
- [x] `backend/requirements.txt` - All dependencies listed
- [x] `backend/utils.py` - Utility functions
- [x] `models/exohabit_hybrid_stack.pkl` - ML model file
- [x] `models/.gitkeep` - Model directory tracked

### Frontend Files
- [x] `frontend/package.json` - Dependencies configured
- [x] `frontend/src/` - All React components
- [x] `frontend/vite.config.js` - Vite configuration
- [x] `frontend/tailwind.config.js` - Tailwind config with new colors
- [x] `frontend/src/services/api.js` - API client with env var support
- [x] `frontend/index.html` - Entry point

### Deployment Configuration
- [x] `Procfile` - Production start command
- [x] `render.yaml` - Render deployment blueprint
- [x] `deploy.sh` - Linux/Mac deployment script
- [x] `deploy.bat` - Windows deployment script

### Documentation
- [x] `DEPLOYMENT.md` - Detailed deployment guide
- [x] `DEPLOYMENT_QUICK_START.md` - Quick reference
- [x] `DEPLOYMENT_COMPLETE_GUIDE.md` - Full walkthrough
- [x] `GITHUB_PUSH.md` - GitHub push instructions

---

## Phase 1: GitHub Push

**Status: READY**

### Steps:
```powershell
cd c:\Users\ujjwa\Desktop\InfosysProject\ExoHabitAI

# Configure git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Initialize and commit
git init
git remote add origin https://github.com/GKSJ-Deepvision/B13-ExoHabitAI.git
git add .
git commit -m "Deployment: Add Procfile, render.yaml, and deployment guides"
git branch -M main
git push -u origin main
```

**Verification:**
- [ ] All files appear on GitHub
- [ ] No errors during push
- [ ] Repository shows latest commits

---

## Phase 2: Backend Deployment on Render

**Status: READY**

### Configuration:
| Setting | Value |
|---------|-------|
| Service Type | Web Service |
| Name | exohabitai-backend |
| Environment | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn backend.app:app` |
| Region | Oregon (or closest) |
| Plan | Free |

### Steps:
1. [ ] Go to https://render.com
2. [ ] Sign up with GitHub
3. [ ] Create Web Service from B13-ExoHabitAI repo
4. [ ] Enter configuration above
5. [ ] Click "Create Web Service"
6. [ ] Wait for deployment (5-10 min)
7. [ ] **SAVE**: Backend URL from dashboard

### Verification:
- [ ] Service shows "Live" status
- [ ] Test: `https://your-url.onrender.com/status`
- [ ] Should return: `{"status": "operational", ...}`
- [ ] Check logs: "Model Loaded Successfully"

---

## Phase 3: Frontend Deployment on Render

**Status: READY**

### Configuration:
| Setting | Value |
|---------|-------|
| Service Type | Static Site |
| Name | exohabitai-frontend |
| Build Command | `cd frontend && npm install && npm run build` |
| Publish Directory | `frontend/dist` |
| Region | Oregon (or closest) |
| Plan | Free |

### Environment Variables:
| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com` |

### Steps:
1. [ ] Create Static Site from B13-ExoHabitAI repo
2. [ ] Enter build command and publish directory
3. [ ] Click "Create Static Site"
4. [ ] Go to Environment settings
5. [ ] Add `VITE_API_URL` with backend URL
6. [ ] Wait for deployment (3-5 min)
7. [ ] **SAVE**: Frontend URL from dashboard

### Verification:
- [ ] Service shows "Live" status
- [ ] Open frontend URL in browser
- [ ] Page loads without blank screen
- [ ] Check console (F12) for errors

---

## Phase 4: End-to-End Testing

### Home Page
- [ ] Loads with animations
- [ ] Navigation links visible
- [ ] "About", "Predict", "Batch", "Rankings" accessible

### Predict Page
- [ ] Form displays with input fields
- [ ] "Load Sample Data" button works
- [ ] Data populates in form
- [ ] "Predict Habitability" button submits
- [ ] Results display with confidence score
- [ ] No API errors in console

### Batch Page
- [ ] Page loads
- [ ] CSV upload input visible
- [ ] Can select file
- [ ] Submit triggers processing
- [ ] Results display (or shows "no data yet")

### Rankings Page
- [ ] Page loads
- [ ] Data table displays
- [ ] Sorting/filtering works (if implemented)
- [ ] API call successful

### About Page
- [ ] Content displays
- [ ] Technologies listed
- [ ] Project timeline visible

### API Testing
```
Test these in browser:
- [ ] Backend /status endpoint: https://your-backend-url/status
- [ ] Backend /model/info: https://your-backend-url/model/info
- [ ] Frontend loads without console errors
- [ ] All API calls go to your deployed backend
```

---

## Phase 5: Final Submission

### Documentation Ready
- [x] DEPLOYMENT.md - Detailed guide
- [x] DEPLOYMENT_QUICK_START.md - Quick reference
- [x] DEPLOYMENT_COMPLETE_GUIDE.md - Full walkthrough
- [x] GITHUB_PUSH.md - Push instructions

### URLs to Submit
- [ ] **Backend URL**: `https://exohabitai-backend.onrender.com` (or your URL)
- [ ] **Frontend URL**: `https://exohabitai-frontend.onrender.com` (or your URL)
- [ ] **GitHub Repository**: `https://github.com/GKSJ-Deepvision/B13-ExoHabitAI`

### Screenshots to Capture
1. [ ] **Render Dashboard** - Both services showing "Live"
2. [ ] **Frontend Home Page** - Full page view
3. [ ] **Predict Page** - With prediction results
4. [ ] **Batch Page** - Showing file upload
5. [ ] **Browser Console** - No errors (F12 → Console tab)

### Final Checklist
- [ ] All pages load without errors
- [ ] Predict functionality works end-to-end
- [ ] API calls use deployed backend URL
- [ ] No missing assets or broken images
- [ ] Navigation works on all pages
- [ ] Responsive design works on mobile
- [ ] Backend responds to health check

---

## Deployment Summary

**Total Estimated Time: 45 minutes**

### What's Deployed
- ✓ React Frontend (Vite + Tailwind CSS)
- ✓ Flask Backend API
- ✓ XGBoost ML Model
- ✓ Full habitability prediction system
- ✓ Production-ready configuration

### Services Running
- ✓ Frontend: Render Static Site
- ✓ Backend: Render Web Service  
- ✓ Database: Local (models & data in repo)

### Features Live
- ✓ Single planet prediction
- ✓ Batch CSV upload & processing
- ✓ Habitability rankings
- ✓ Real-time visualization
- ✓ Mobile responsive UI

---

## Important Notes

### Free Tier Limitations
- Render free tier: App spins down after 15 min of inactivity
- First request after spin-down may take 15-30 seconds
- Upgrade to "Starter" ($7/month) for always-on instance

### Maintenance
- Monitor Render dashboard logs weekly
- Check for any API errors or crashes
- Update dependencies as needed
- Backup model file regularly

### Next Steps
1. Deploy now using DEPLOYMENT_COMPLETE_GUIDE.md
2. Test all functionality
3. Submit URLs and screenshots
4. Consider upgrading to paid plan for production use

---

## Support & Troubleshooting

### Quick Help
- **Blank Frontend Page**: Check VITE_API_URL env var
- **API Call Fails**: Verify backend URL is correct
- **Model Not Loading**: Check Render backend service logs
- **Build Error**: Run `npm install` in frontend folder locally

### Full Troubleshooting
See: `DEPLOYMENT_COMPLETE_GUIDE.md` → Troubleshooting section

---

## Sign-Off

**Deployment Package**: COMPLETE ✓  
**Date Prepared**: 2026-02-18  
**Status**: READY FOR DEPLOYMENT

All files are in place. Follow `DEPLOYMENT_COMPLETE_GUIDE.md` for step-by-step deployment.

**Next Action**: Push to GitHub → Deploy on Render → Test → Submit URLs
