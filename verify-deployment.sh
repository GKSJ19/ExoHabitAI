#!/bin/bash
# Deployment Verification Script - Linux/Mac
# Checks if all files and configurations are ready for deployment

echo ""
echo "========================================"
echo "ExoHabitAI Deployment Verification"
echo "========================================"
echo ""

PASS="✓"
FAIL="✗"
CHECK_COUNT=0
PASS_COUNT=0

check_file() {
    CHECK_COUNT=$((CHECK_COUNT + 1))
    if [ -f "$1" ]; then
        echo "$PASS [$CHECK_COUNT] Found: $1"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo "$FAIL [$CHECK_COUNT] Missing: $1"
    fi
}

check_dir() {
    CHECK_COUNT=$((CHECK_COUNT + 1))
    if [ -d "$1" ]; then
        echo "$PASS [$CHECK_COUNT] Found: $1/"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo "$FAIL [$CHECK_COUNT] Missing: $1/"
    fi
}

echo "=== Backend Files ==="
check_file "backend/app.py"
check_file "backend/requirements.txt"
check_file "backend/utils.py"

echo ""
echo "=== Frontend Files ==="
check_file "frontend/package.json"
check_file "frontend/vite.config.js"
check_file "frontend/tailwind.config.js"
check_dir "frontend/src"

echo ""
echo "=== ML Model ==="
check_file "models/exohabit_hybrid_stack.pkl"

echo ""
echo "=== Deployment Configuration ==="
check_file "Procfile"
check_file "render.yaml"
check_file ".gitkeep"

echo ""
echo "=== Documentation ==="
check_file "DEPLOYMENT_COMPLETE_GUIDE.md"
check_file "DEPLOYMENT_QUICK_START.md"
check_file "DEPLOYMENT_CHECKLIST.md"
check_file "GITHUB_PUSH.md"
check_file "DEPLOYMENT_STATUS.md"
check_file "DEPLOYMENT.md"
check_file "README_DEPLOYMENT.md"

echo ""
echo "========================================"
echo "Verification Result: $PASS_COUNT / $CHECK_COUNT"
echo "========================================"

if [ $PASS_COUNT -eq $CHECK_COUNT ]; then
    echo ""
    echo "$PASS ALL CHECKS PASSED"
    echo "Your application is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Read: DEPLOYMENT_COMPLETE_GUIDE.md"
    echo "2. Push code to GitHub: See GITHUB_PUSH.md"
    echo "3. Deploy on Render"
    echo "4. Test and submit URLs"
    echo ""
    exit 0
else
    echo ""
    echo "$FAIL SOME FILES ARE MISSING"
    echo "Please ensure all files are in the correct location"
    echo ""
    exit 1
fi
