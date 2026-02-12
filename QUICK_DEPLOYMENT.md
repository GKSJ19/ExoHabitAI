# ⚡ Quick Deployment Guide (5-Minute Summary)

## 🎯 Objective
Deploy ExoHabitAI to production using **Render (Backend)** + **Vercel (Frontend)** for maximum speed and reliability.

---

## 📋 Prerequisites
- [ ] GitHub account with repo pushed
- [ ] Render account (sign up via GitHub)
- [ ] Vercel account (sign up via GitHub)
- [ ] Procfile in project root
- [ ] gunicorn in backend/requirements.txt

---

## 🚀 Deployment Steps

### **Step 1: Deploy Backend (5 minutes)**

1. **Create Procfile** in project root:
   ```text
   web: gunicorn backend.app:app
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

3. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com
   - Click **New +** → **Web Service**
   - Select your GitHub repo
   - **Name:** `exohabitai-backend`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `gunicorn backend.app:app`
   - Click **Create Web Service**

4. **Wait for deployment** (2-3 minutes)
   - Copy the live URL: `https://exohabitai-backend.onrender.com`

5. **Verify it works:**
   ```bash
   curl https://exohabitai-backend.onrender.com/status
   ```

---

### **Step 2: Deploy Frontend (3 minutes)**

1. **Update `frontend/.env`:**
   ```env
   VITE_API_URL=https://exohabitai-backend.onrender.com
   ```

2. **Push to GitHub:**
   ```bash
   git add frontend/.env
   git commit -m "Update API URL for Render"
   git push origin main
   ```

3. **Go to Vercel Dashboard:**
   - Visit https://vercel.com
   - Click **Add New** → **Project**
   - Select your GitHub repo
   - **Root Directory:** `frontend`
   - **Framework:** Vite
   - **Environment Variable:**
     - Key: `VITE_API_URL`
     - Value: `https://exohabitai-backend.onrender.com`
   - Click **Deploy**

4. **Wait for deployment** (1-2 minutes)
   - Copy the live URL: `https://exohabitai.vercel.app`

---

## ✅ Verification

### **Test Backend**
```bash
curl https://exohabitai-backend.onrender.com/status
# Should return: {"status": "OK", ...}
```

### **Test Frontend**
1. Open https://exohabitai.vercel.app
2. Check that page loads
3. Go to Predict page → Click "Load Earth Data" → Click "Analyze"
4. Should show "Habitable" with high confidence

### **Test Dashboard**
1. Go to https://exohabitai.vercel.app/dashboard
2. Verify charts load with data
3. Test PDF/CSV export buttons

---

## 🔗 Your Live URLs

| Component | URL |
|-----------|-----|
| **Frontend** | https://exohabitai.vercel.app |
| **Backend API** | https://exohabitai-backend.onrender.com |
| **API Status** | https://exohabitai-backend.onrender.com/status |

---

## 📱 Share Your Deployment

```markdown
🌌 **ExoHabitAI is now live!**

🔗 **Live Demo:** https://exohabitai.vercel.app
🔗 **API Docs:** https://exohabitai-backend.onrender.com

🚀 Built with React + Flask + Machine Learning
✨ Identifies habitable exoplanets from NASA data
📊 Interactive analytics dashboard with 3D visualizations

Try it now! 🪐
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Backend won't deploy** | Check Procfile exists and gunicorn is in requirements.txt |
| **Frontend won't connect** | Verify VITE_API_URL in Vercel env vars matches Render URL |
| **API 404 errors** | Check backend logs on Render dashboard |
| **Slow loading** | Free tier has cold starts (15-30s first request) |
| **Model errors** | Ensure model file exists in backend directory |

---

## 📞 Getting Help

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Check Logs:** 
  - Render: Dashboard → Service → Logs
  - Vercel: Dashboard → Project → Deployments

---

## 🎉 You Did It!

Your ExoHabitAI application is now **live, fast, and globally accessible!**

**Total time:** ~8-10 minutes ⏱️

---

**Next Steps:**
1. Update README.md with your live URLs
2. Add deployment badges
3. Share with your mentor
4. Monitor performance on dashboards
5. Update your resume with the live link!

