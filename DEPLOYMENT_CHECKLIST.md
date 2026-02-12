# 🚀 ExoHabitAI Deployment Checklist

## Pre-Deployment Verification

### Code Quality
- [ ] All JavaScript/React code formatted with Prettier
- [ ] Backend Python code passes PEP8 linting
- [ ] No console.log statements in production code
- [ ] No hardcoded API keys or secrets
- [ ] All imports are used (no unused dependencies)
- [ ] Error handling implemented for all API calls
- [ ] CORS configuration set correctly

### Testing
- [ ] Backend unit tests passing (`pytest test_api.py`)
- [ ] Frontend build successful (`npm run build`)
- [ ] Manual testing of all pages completed
- [ ] API endpoints tested with Postman/curl
- [ ] Batch processing tested with sample data
- [ ] Export functionality (PDF/CSV) working
- [ ] Mobile responsiveness verified

### Documentation
- [ ] README.md updated with live URLs
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Setup instructions clear and tested
- [ ] Deployment guide included
- [ ] Troubleshooting section complete

### Configuration Files
- [ ] `Procfile` exists in project root
- [ ] `requirements.txt` has gunicorn
- [ ] `package.json` has all dependencies
- [ ] `.env` template created (`.env.example`)
- [ ] `.gitignore` configured correctly
- [ ] `vite.config.js` configured for production

---

## Phase 1: Backend Deployment (Render)

### Step 1: Prepare Repository
```bash
# Navigate to project root
cd ExoHabitAI

# Add and commit all changes
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

**Verification:**
- [ ] All files committed to GitHub
- [ ] No uncommitted changes
- [ ] Latest commit reflects deployment readiness

### Step 2: Create Render Service

**Actions:**
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Sign in with GitHub account
3. Click **New +** → **Web Service**
4. Click **Connect repository** and select `ExoHabitAI`

**Configuration:**
| Field | Value |
|-------|-------|
| **Name** | `exohabitai-backend` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r backend/requirements.txt` |
| **Start Command** | `gunicorn backend.app:app` |
| **Plan** | Free (or Starter if free tier unavailable) |

**Advanced Settings:**
- [ ] Health Check Path: `/status`
- [ ] Health Check Protocol: `HTTP`
- [ ] Auto-Deploy: Yes (on GitHub push)
- [ ] Root Directory: (leave empty)

### Step 3: Deploy
- [ ] Click **Create Web Service**
- [ ] Wait for build completion (2-3 minutes)
- [ ] Verify "Live" status
- [ ] Copy service URL (e.g., `https://exohabitai-backend.onrender.com`)

### Step 4: Verify Backend

```bash
# Test health endpoint
curl https://exohabitai-backend.onrender.com/status

# Expected response:
# {"status": "OK", "message": "ExoHabitAI API is running", ...}
```

**Verification:**
- [ ] Status endpoint returns 200
- [ ] Model loads without errors
- [ ] Sample prediction works

**Save Backend URL:** `https://exohabitai-backend.onrender.com`

---

## Phase 2: Frontend Deployment (Vercel)

### Step 1: Update Environment Variables

**Edit `frontend/.env`:**
```env
VITE_API_URL=https://exohabitai-backend.onrender.com
```

**Commit changes:**
```bash
git add frontend/.env
git commit -m "Update API URL for production"
git push origin main
```

- [ ] `.env` file updated with Render backend URL
- [ ] Changes committed to GitHub

### Step 2: Deploy on Vercel

**Actions:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (or create account)
3. Click **Add New...** → **Project**
4. Search for `ExoHabitAI` repository
5. Click **Import**

**Configuration:**
| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

**Environment Variables:**
```
VITE_API_URL = https://exohabitai-backend.onrender.com
```

### Step 3: Deploy
- [ ] Click **Deploy**
- [ ] Wait for build completion (1-2 minutes)
- [ ] Verify deployment success
- [ ] Copy deployment URL (e.g., `https://exohabitai.vercel.app`)

### Step 4: Verify Frontend

**Test in browser:**
1. Navigate to deployment URL
2. [ ] Homepage loads with 3D animation
3. [ ] Navbar links work correctly
4. [ ] Can navigate to Predict page
5. [ ] Can navigate to Ranking page
6. [ ] Can navigate to Dashboard
7. [ ] API calls to backend work (check Network tab)

**Performance Check:**
- [ ] Page load time <1000ms
- [ ] 3D scene renders smoothly (60 FPS)
- [ ] No console errors
- [ ] All images load correctly

**Save Frontend URL:** `https://exohabitai.vercel.app`

---

## Phase 3: Testing & Validation

### End-to-End Testing

#### Test Case 1: Single Prediction
```
1. Open https://exohabitai.vercel.app/predict
2. Click "Load Earth Data"
3. Click "Analyze"
4. Expected: Shows "Habitable" with ~95% confidence
```
- [ ] Prediction works
- [ ] Result displays correctly
- [ ] Confidence gauge animates

#### Test Case 2: Ranking Page
```
1. Open https://exohabitai.vercel.app/ranking
2. Verify list loads
3. Click on planet name for details
```
- [ ] List shows all habitable planets
- [ ] Sorting works
- [ ] Details modal shows data

#### Test Case 3: Dashboard
```
1. Open https://exohabitai.vercel.app/dashboard
2. Verify all charts load
3. Test export buttons
```
- [ ] Stats cards display
- [ ] Charts render correctly
- [ ] PDF export downloads file
- [ ] CSV export downloads data

#### Test Case 4: Batch Processing
```
1. Open https://exohabitai.vercel.app/batch
2. Upload sample_batch.json
3. Click "Analyze All"
```
- [ ] File uploads successfully
- [ ] Processing shows progress
- [ ] Results display in grid
- [ ] Export batch results works

### Performance Metrics

**Measure with DevTools:**
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3s

**Backend Performance:**
- [ ] Single prediction: <100ms
- [ ] Batch (100 planets): <5s
- [ ] Dashboard load: <1s

---

## Phase 4: Production Monitoring

### Render Backend Monitoring

Go to your Render dashboard:
- [ ] Check "Live" status is green
- [ ] Monitor CPU usage (should be <20% idle)
- [ ] Check memory usage (should be <50% idle)
- [ ] Review logs for errors
- [ ] Set up alerts for crashes

**Key Metrics to Monitor:**
- Response times
- Error rate
- CPU/Memory usage
- Deployment history

### Vercel Frontend Monitoring

Go to your Vercel dashboard:
- [ ] Check deployment is "Production"
- [ ] Review analytics (page views, unique visitors)
- [ ] Check core web vitals
- [ ] Monitor build times
- [ ] Review function invocations

**Key Metrics to Monitor:**
- Page performance
- Error tracking
- Analytics
- Cost usage

---

## Phase 5: Post-Deployment Tasks

### Documentation Updates

- [ ] Update README.md with live URLs:
  ```markdown
  **Live Demo:** https://exohabitai.vercel.app
  **API:** https://exohabitai-backend.onrender.com
  ```

- [ ] Update deployment section with URLs
- [ ] Add deployment metrics to README
- [ ] Create issue template for bug reports

### GitHub Configuration

- [ ] Add deployment badges to README
- [ ] Create GitHub releases for milestones
- [ ] Set branch protection rules
- [ ] Configure branch auto-deploy

### Custom Domain (Optional)

**For custom domain (e.g., exohabitai.com):**

**Vercel:**
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records at registrar

**Render:**
1. Go to Service Settings → Custom Domain
2. Add custom domain
3. Update DNS records at registrar

- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate automatic
- [ ] Email verification completed

### Monitoring & Analytics

- [ ] Google Analytics installed
- [ ] Sentry error tracking configured (optional)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured

---

## Phase 6: Maintenance & Updates

### Regular Tasks

**Weekly:**
- [ ] Check deployment logs for errors
- [ ] Monitor API response times
- [ ] Review user feedback

**Monthly:**
- [ ] Update dependencies
- [ ] Review and optimize performance
- [ ] Check for security vulnerabilities
- [ ] Review analytics trends

**Quarterly:**
- [ ] Major version updates
- [ ] Feature enhancements
- [ ] Database backups (if applicable)
- [ ] Security audit

### Emergency Procedures

**If Backend Down:**
1. Check Render dashboard for errors
2. View logs: Render > Services > Logs
3. Check recent commits
4. Rollback if needed: `git revert`
5. Re-deploy: Push to main branch

**If Frontend Down:**
1. Check Vercel dashboard
2. View build logs
3. Check for failed dependency
4. Retry deployment
5. Check environment variables

---

## Deployment Sign-Off

### Final Checklist
- [ ] All code committed and pushed
- [ ] Procfile created and verified
- [ ] requirements.txt complete
- [ ] package.json updated
- [ ] Environment variables configured
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] All endpoints tested
- [ ] Performance verified
- [ ] Documentation updated
- [ ] README has live URLs
- [ ] No errors in logs
- [ ] Monitoring configured

### URLs for Documentation

**Backend API:**
```
https://exohabitai-backend.onrender.com
```

**Frontend Application:**
```
https://exohabitai.vercel.app
```

**GitHub Repository:**
```
https://github.com/yourusername/ExoHabitAI
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Backend won't deploy | Missing gunicorn in requirements | Add `gunicorn==21.2.0` to requirements.txt |
| Frontend won't load | CORS error | Verify `VITE_API_URL` matches Render URL |
| Predictions fail | Model file missing | Ensure model is in backend directory |
| Build fails | Memory limit | Upgrade plan or optimize dependencies |
| Slow performance | Cold start | Use Starter plan or paid tier for consistent uptime |

### Support Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Flask Docs:** https://flask.palletsprojects.com
- **React Docs:** https://react.dev

---

## Success Criteria

✅ **Deployment Successful When:**
- [ ] Backend URL responds to `/status`
- [ ] Frontend loads in <2 seconds
- [ ] API calls succeed from frontend
- [ ] All pages functional
- [ ] No console errors
- [ ] No 404 errors
- [ ] Dashboard loads all data
- [ ] Export functions work
- [ ] Performance metrics acceptable
- [ ] Monitoring configured

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Notes:** _______________

---

**🎉 Congratulations on your production deployment! 🎉**

