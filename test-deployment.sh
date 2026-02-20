#!/bin/bash
# ExoHabitAI Post-Deployment Testing Script
# Run this after both services are deployed on Render

echo ""
echo "=========================================="
echo "ExoHabitAI Post-Deployment Test Suite"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Prompt for URLs
echo "Enter your deployed URLs:"
read -p "Backend URL (e.g., https://exohabitai-backend.onrender.com): " BACKEND_URL
read -p "Frontend URL (e.g., https://exohabitai-frontend.onrender.com): " FRONTEND_URL

echo ""
echo "Testing Backend..."
echo "=================="

# Test 1: Backend /status endpoint
echo -n "Testing /status endpoint... "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/status")
if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✓ PASS${NC} (HTTP 200)"
else
  echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE)"
fi

# Test 2: Backend /model/info endpoint
echo -n "Testing /model/info endpoint... "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/model/info")
if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✓ PASS${NC} (HTTP 200)"
else
  echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE)"
fi

# Test 3: Backend model data
echo -n "Testing model loading... "
MODEL_STATUS=$(curl -s "$BACKEND_URL/model/info" | grep -i "model" | wc -l)
if [ "$MODEL_STATUS" -gt 0 ]; then
  echo -e "${GREEN}✓ PASS${NC} (Model data found)"
else
  echo -e "${RED}✗ FAIL${NC} (Model data not found)"
fi

echo ""
echo "Testing Frontend..."
echo "=================="

# Test 4: Frontend homepage loads
echo -n "Testing frontend loads... "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/")
if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✓ PASS${NC} (HTTP 200)"
else
  echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE)"
fi

# Test 5: Frontend predict page
echo -n "Testing /predict page... "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/predict")
if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✓ PASS${NC} (HTTP 200)"
else
  echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE)"
fi

# Test 6: Frontend batch page
echo -n "Testing /batch page... "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/batch")
if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✓ PASS${NC} (HTTP 200)"
else
  echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE)"
fi

# Test 7: Frontend ranking page
echo -n "Testing /ranking page... "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/ranking")
if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✓ PASS${NC} (HTTP 200)"
else
  echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE)"
fi

echo ""
echo "Testing API Integration..."
echo "=========================="

# Test 8: Test prediction endpoint
echo -n "Testing /predict endpoint... "
PREDICT_RESPONSE=$(curl -s -X POST "$BACKEND_URL/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "pl_name": "TEST-001",
    "pl_dens": 5.51,
    "pl_bmasse": 1.0,
    "pl_ratdor": 215.0,
    "st_logg": 4.44,
    "st_dens": 1.41,
    "pl_rvamp": 0.089,
    "st_lum": 1.0,
    "sy_bmag": 5.48,
    "pl_ratror": 0.0091,
    "pl_orbincl": 89.0,
    "st_met": 0.0,
    "st_mass": 1.0,
    "pl_trandep": 0.008,
    "st_rad": 1.0,
    "pl_orbper": 365.25,
    "dec": -0.44,
    "pl_imppar": 0.1,
    "glat": -6.0,
    "pl_trandur": 13.0,
    "pl_tranmid": 2450000.0,
    "sy_pmra": 0.0,
    "sy_w4mag": 8.0,
    "st_age": 4.6,
    "sy_pm": 0.0,
    "rowid": 1,
    "pl_orbsmax": 1.0,
    "sy_pmdec": 0.0,
    "glon": 0.0,
    "ra": 0.0,
    "elon": 0.0,
    "rv_flag": 1,
    "st_teff": 5778.0,
    "pl_nnotes": 0,
    "sy_plx": 100.0,
    "pl_ntranspec": 0,
    "pl_orblper": 0.0,
    "tran_flag": 1,
    "pl_insol.1": 1.0,
    "pl_orbeccen.1": 0.017
  }' 2>/dev/null)

if echo "$PREDICT_RESPONSE" | grep -q "prediction_result"; then
  RESULT=$(echo "$PREDICT_RESPONSE" | grep -o '"prediction_result":"[^"]*"')
  echo -e "${GREEN}✓ PASS${NC} ($RESULT)"
else
  echo -e "${RED}✗ FAIL${NC} (No prediction result)"
fi

echo ""
echo "=========================================="
echo "Testing Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo ""
echo "If all tests passed: ✓ Your deployment is working!"
echo "If any failed: Check the service logs on Render for errors"
echo ""
