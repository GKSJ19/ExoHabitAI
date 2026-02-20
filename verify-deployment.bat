@echo off
REM Deployment Verification Script - Windows
REM Checks if all files and configurations are ready for deployment

setlocal enabledelayedexpansion

echo.
echo ========================================
echo ExoHabitAI Deployment Verification
echo ========================================
echo.

set CHECK_COUNT=0
set PASS_COUNT=0

REM Function to check file
:check_file
set CHECK_COUNT=!CHECK_COUNT! + 1
set /a CHECK_COUNT=!CHECK_COUNT!
if exist "%1" (
    echo [PASS] [!CHECK_COUNT!] Found: %1
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [!CHECK_COUNT!] Missing: %1
)
goto :eof

REM Function to check directory
:check_dir
set CHECK_COUNT=!CHECK_COUNT! + 1
set /a CHECK_COUNT=!CHECK_COUNT!
if exist "%1" (
    echo [PASS] [!CHECK_COUNT!] Found: %1\
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [!CHECK_COUNT!] Missing: %1\
)
goto :eof

echo === Backend Files ===
if exist "backend\app.py" (
    echo [PASS] [1] Found: backend/app.py
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [1] Missing: backend/app.py
)
set /a CHECK_COUNT=1

if exist "backend\requirements.txt" (
    echo [PASS] [2] Found: backend/requirements.txt
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [2] Missing: backend/requirements.txt
)
set /a CHECK_COUNT=2

if exist "backend\utils.py" (
    echo [PASS] [3] Found: backend/utils.py
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [3] Missing: backend/utils.py
)
set /a CHECK_COUNT=3

echo.
echo === Frontend Files ===
if exist "frontend\package.json" (
    echo [PASS] [4] Found: frontend/package.json
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [4] Missing: frontend/package.json
)
set /a CHECK_COUNT=4

if exist "frontend\vite.config.js" (
    echo [PASS] [5] Found: frontend/vite.config.js
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [5] Missing: frontend/vite.config.js
)
set /a CHECK_COUNT=5

if exist "frontend\tailwind.config.js" (
    echo [PASS] [6] Found: frontend/tailwind.config.js
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [6] Missing: frontend/tailwind.config.js
)
set /a CHECK_COUNT=6

if exist "frontend\src" (
    echo [PASS] [7] Found: frontend/src/
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [7] Missing: frontend/src/
)
set /a CHECK_COUNT=7

echo.
echo === ML Model ===
if exist "models\exohabit_hybrid_stack.pkl" (
    echo [PASS] [8] Found: models/exohabit_hybrid_stack.pkl
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [8] Missing: models/exohabit_hybrid_stack.pkl
)
set /a CHECK_COUNT=8

echo.
echo === Deployment Configuration ===
if exist "Procfile" (
    echo [PASS] [9] Found: Procfile
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [9] Missing: Procfile
)
set /a CHECK_COUNT=9

if exist "render.yaml" (
    echo [PASS] [10] Found: render.yaml
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [10] Missing: render.yaml
)
set /a CHECK_COUNT=10

echo.
echo === Documentation ===
if exist "DEPLOYMENT_COMPLETE_GUIDE.md" (
    echo [PASS] [11] Found: DEPLOYMENT_COMPLETE_GUIDE.md
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [11] Missing: DEPLOYMENT_COMPLETE_GUIDE.md
)
set /a CHECK_COUNT=11

if exist "DEPLOYMENT_QUICK_START.md" (
    echo [PASS] [12] Found: DEPLOYMENT_QUICK_START.md
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [12] Missing: DEPLOYMENT_QUICK_START.md
)
set /a CHECK_COUNT=12

if exist "GITHUB_PUSH.md" (
    echo [PASS] [13] Found: GITHUB_PUSH.md
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [13] Missing: GITHUB_PUSH.md
)
set /a CHECK_COUNT=13

if exist "DEPLOYMENT_CHECKLIST.md" (
    echo [PASS] [14] Found: DEPLOYMENT_CHECKLIST.md
    set /a PASS_COUNT=!PASS_COUNT! + 1
) else (
    echo [FAIL] [14] Missing: DEPLOYMENT_CHECKLIST.md
)
set /a CHECK_COUNT=14

echo.
echo.
echo ========================================
echo Verification Result: %PASS_COUNT% / %CHECK_COUNT%
echo ========================================

if %PASS_COUNT% EQU %CHECK_COUNT% (
    echo.
    echo [SUCCESS] ALL CHECKS PASSED
    echo Your application is ready for deployment!
    echo.
    echo Next steps:
    echo 1. Read: DEPLOYMENT_COMPLETE_GUIDE.md
    echo 2. Push code to GitHub: See GITHUB_PUSH.md
    echo 3. Deploy on Render
    echo 4. Test and submit URLs
    echo.
    exit /b 0
) else (
    echo.
    echo [FAILED] SOME FILES ARE MISSING
    echo Please ensure all files are in the correct location
    echo.
    exit /b 1
)
