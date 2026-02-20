@echo off
REM ExoHabitAI Deployment Script for Windows
REM This script prepares the application for deployment

setlocal enabledelayedexpansion

echo.
echo ================================
echo ExoHabitAI Deployment Script
echo ================================
echo.

REM Check if git is initialized
echo [1/6] Checking Git status...
if not exist .git (
  echo Initializing git repository...
  git init
  git remote add origin https://github.com/GKSJ-Deepvision/B13-ExoHabitAI.git
  echo [SUCCESS] Git initialized
) else (
  echo [SUCCESS] Git already initialized
)
echo.

REM Install backend dependencies
echo [2/6] Verifying backend dependencies...
cd backend
pip install -r requirements.txt
cd ..
echo [SUCCESS] Backend dependencies verified
echo.

REM Install frontend dependencies
echo [3/6] Installing frontend dependencies...
cd frontend
call npm install
echo [SUCCESS] Frontend dependencies installed
echo.

REM Build frontend
echo [4/6] Building frontend for production...
call npm run build
if %ERRORLEVEL% EQU 0 (
  echo [SUCCESS] Frontend build complete (dist/ folder created)
) else (
  echo [ERROR] Frontend build failed!
  exit /b 1
)
cd ..
echo.

REM Verify model file exists
echo [5/6] Verifying model files...
if exist "models\exohabit_hybrid_stack.pkl" (
  echo [SUCCESS] Model file found: models/exohabit_hybrid_stack.pkl
) else (
  echo [ERROR] Model file not found!
  exit /b 1
)
echo.

REM Verify Procfile exists
echo [6/6] Verifying deployment configuration...
if exist "Procfile" (
  echo [SUCCESS] Procfile found
  type Procfile
) else (
  echo [ERROR] Procfile not found!
  exit /b 1
)

echo.
echo ================================
echo [SUCCESS] All deployment preparations complete!
echo ================================
echo.
echo Next steps:
echo 1. Commit all changes: git add . && git commit -m "Deployment ready"
echo 2. Push to GitHub: git push -u origin main
echo 3. Deploy on Render:
echo    - Backend: Create Web Service from Procfile
echo    - Frontend: Create Static Site from frontend/dist
echo.

endlocal
