# GitHub Deployment Instructions

## Prerequisites
- GitHub account: https://github.com
- Repository: GKSJ-Deepvision/B13-ExoHabitAI (or your fork)
- Git installed on your machine
- GitHub CLI or Git with credentials configured

## Step 1: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## Step 2: Initialize Repository (if not done)

```bash
cd c:\Users\ujjwa\Desktop\InfosysProject\ExoHabitAI
git init
git remote add origin https://github.com/GKSJ-Deepvision/B13-ExoHabitAI.git
```

## Step 3: Add All Files and Commit

```bash
git add .
git commit -m "Deployment: Add Procfile, deployment guides, and build configurations"
```

## Step 4: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

### If push fails with authentication error:
**Option A: Use GitHub Personal Access Token**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes: repo (full control of private repositories)
4. Copy the token
5. When git asks for password, paste the token

**Option B: Use GitHub CLI**
```bash
gh auth login
# Follow prompts to authenticate
git push -u origin main
```

**Option C: Use SSH (Recommended)**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your-email@example.com"`
2. Add to GitHub: https://github.com/settings/keys
3. Clone with SSH: `git clone git@github.com:GKSJ-Deepvision/B13-ExoHabitAI.git`
4. Push: `git push -u origin main`

## Step 5: Verify Push

Visit: https://github.com/GKSJ-Deepvision/B13-ExoHabitAI

Confirm you see:
- ✓ Procfile
- ✓ DEPLOYMENT.md
- ✓ DEPLOYMENT_QUICK_START.md
- ✓ frontend/ folder with `src/` and `dist/` (if built)
- ✓ backend/ folder with requirements.txt
- ✓ models/ folder with exohabit_hybrid_stack.pkl

## Files Ready for Deployment

The following files will be pushed:

### Backend
- `backend/app.py` (Flask API)
- `backend/requirements.txt` (Dependencies)
- `backend/utils.py` (Utilities)
- `models/exohabit_hybrid_stack.pkl` (ML Model)

### Frontend
- `frontend/src/` (React source)
- `frontend/package.json` (Dependencies)
- `frontend/dist/` (Built files after npm run build)

### Configuration
- `Procfile` (Production start command)
- `DEPLOYMENT.md` (Detailed guide)
- `DEPLOYMENT_QUICK_START.md` (Quick ref)
- `render.yaml` (Render deployment config)

## Troubleshooting

### "Permission denied (publickey)"
→ Setup SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### "fatal: not a git repository"
→ Run `git init` first

### "fatal: remote origin already exists"
→ Run `git remote remove origin` then add again

### "Your branch is ahead of 'origin/main' by X commits"
→ Run `git push origin main`

---

Once pushed, proceed to Render deployment (see DEPLOYMENT_QUICK_START.md)
