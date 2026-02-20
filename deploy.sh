#!/bin/bash
# ExoHabitAI Deployment Script
# This script prepares and deploys the application

set -e

echo "================================"
echo "ExoHabitAI Deployment Script"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is initialized
echo -e "${BLUE}[1/6] Checking Git status...${NC}"
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  git remote add origin https://github.com/GKSJ-Deepvision/B13-ExoHabitAI.git
  echo -e "${GREEN}✓ Git initialized${NC}"
else
  echo -e "${GREEN}✓ Git already initialized${NC}"
fi

# Install backend dependencies
echo -e "${BLUE}[2/6] Verifying backend dependencies...${NC}"
cd backend
pip install -r requirements.txt
cd ..
echo -e "${GREEN}✓ Backend dependencies verified${NC}"

# Install frontend dependencies
echo -e "${BLUE}[3/6] Installing frontend dependencies...${NC}"
cd frontend
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Build frontend
echo -e "${BLUE}[4/6] Building frontend for production...${NC}"
npm run build
echo -e "${GREEN}✓ Frontend build complete (dist/ folder created)${NC}"
cd ..

# Verify model file exists
echo -e "${BLUE}[5/6] Verifying model files...${NC}"
if [ -f "models/exohabit_hybrid_stack.pkl" ]; then
  echo -e "${GREEN}✓ Model file found: models/exohabit_hybrid_stack.pkl${NC}"
else
  echo -e "${RED}✗ Model file not found!${NC}"
  exit 1
fi

# Verify Procfile exists
echo -e "${BLUE}[6/6] Verifying deployment configuration...${NC}"
if [ -f "Procfile" ]; then
  echo -e "${GREEN}✓ Procfile found${NC}"
  cat Procfile
else
  echo -e "${RED}✗ Procfile not found!${NC}"
  exit 1
fi

echo ""
echo "================================"
echo -e "${GREEN}✓ All deployment preparations complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Commit all changes: git add . && git commit -m 'Deployment ready'"
echo "2. Push to GitHub: git push -u origin main"
echo "3. Deploy on Render:"
echo "   - Backend: Create Web Service from Procfile"
echo "   - Frontend: Create Static Site from frontend/dist"
echo ""
