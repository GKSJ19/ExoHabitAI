@echo off
REM ExoHabitAI Post-Deployment Testing Script (Windows)
REM Run this after both services are deployed on Render

setlocal enabledelayedexpansion

cls
echo.
echo ==========================================
echo ExoHabitAI Post-Deployment Test Suite
echo ==========================================
echo.

echo Enter your deployed URLs:
set /p BACKEND_URL="Backend URL (e.g., https://exohabitai-backend.onrender.com): "
set /p FRONTEND_URL="Frontend URL (e.g., https://exohabitai-frontend.onrender.com): "

echo.
echo Testing Backend...
echo ==========================================

REM Test 1: Backend /status endpoint
echo Checking /status endpoint...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" "%BACKEND_URL%/status"

REM Test 2: Backend /model/info endpoint  
echo Checking /model/info endpoint...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" "%BACKEND_URL%/model/info"

echo.
echo Testing Frontend...
echo ==========================================

REM Test 3: Frontend homepage
echo Checking homepage...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" "%FRONTEND_URL%/"

REM Test 4: Frontend predict page
echo Checking /predict page...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" "%FRONTEND_URL%/predict"

REM Test 5: Frontend batch page
echo Checking /batch page...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" "%FRONTEND_URL%/batch"

REM Test 6: Frontend ranking page
echo Checking /ranking page...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" "%FRONTEND_URL%/ranking"

echo.
echo ==========================================
echo Testing Summary
echo ==========================================
echo.
echo Backend URL: %BACKEND_URL%
echo Frontend URL: %FRONTEND_URL%
echo.
echo All HTTP 200 responses = Success!
echo.
echo If you see 200 for all endpoints:
echo   ✓ Your deployment is working!
echo.
echo If you see errors:
echo   ✗ Check Render service logs for details
echo.
echo Next: Test predict functionality manually in browser
echo.

endlocal
