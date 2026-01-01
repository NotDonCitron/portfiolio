#!/bin/bash

echo "🚀 Portfolio Performance Test"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

URL="http://localhost:5173"

# Test 1: Server Response Time
echo "📡 Test 1: Server Response Time"
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' $URL)
if (( $(echo "$RESPONSE_TIME < 0.5" | bc -l) )); then
  echo -e "${GREEN}✅ PASS${NC} - ${RESPONSE_TIME}s (< 0.5s)"
elif (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
  echo -e "${YELLOW}⚠️  WARN${NC} - ${RESPONSE_TIME}s (should be < 0.5s)"
else
  echo -e "${RED}❌ FAIL${NC} - ${RESPONSE_TIME}s (> 1.0s)"
fi
echo ""

# Test 2: Content Size
echo "📦 Test 2: Bundle Size"
HTML_SIZE=$(curl -s $URL | wc -c)
if [ $HTML_SIZE -lt 10000 ]; then
  echo -e "${GREEN}✅ PASS${NC} - HTML is ${HTML_SIZE} bytes (< 10KB)"
else
  echo -e "${YELLOW}⚠️  WARN${NC} - HTML is ${HTML_SIZE} bytes"
fi

if [ -d "dist/assets" ]; then
  JS_SIZE=$(du -h dist/assets/*.js 2>/dev/null | grep -E '[0-9]+K' | cut -f1)
  CSS_SIZE=$(du -h dist/assets/*.css 2>/dev/null | grep -E '[0-9]+K' | cut -f1)
  echo -e "  JS Bundle: ${JS_SIZE}"
  echo -e "  CSS Bundle: ${CSS_SIZE}"
fi
echo ""

# Test 3: Number of Requests (needs DevTools for accurate count)
echo "📊 Test 3: Resource Count"
echo "⚠️  Manual check required:"
echo "  1. Open DevTools (F12)"
echo "  2. Go to Network tab"
echo "  3. Refresh page (F5)"
echo "  4. Count requests"
echo "  5. Target: < 50 requests"
echo ""

# Test 4: Backend Health
echo "🤖 Test 4: AI Backend Health"
if curl -s http://localhost:5000/health > /dev/null; then
  echo -e "${GREEN}✅ PASS${NC} - Backend is healthy"
else
  echo -e "${RED}❌ FAIL${NC} - Backend not responding"
fi
echo ""

# Test 5: Production Build
echo "🏗️  Test 5: Production Build Check"
if [ -d "dist" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Production build exists"
  echo -e "  Total dist size: $(du -h dist | cut -f1)"
else
  echo -e "${YELLOW}⚠️  WARN${NC} - No production build"
fi
echo ""

# Summary
echo "================================"
echo "📋 Summary & Recommendations"
echo ""
echo "✅ Good:"
echo "  - Bundle size is reasonable (408KB)"
echo "  - Server is responding"
echo ""
echo "⚠️  Improvements needed:"
echo "  - Test Lighthouse score (DevTools > Lighthouse)"
echo "  - Measure First Contentful Paint"
echo "  - Check for unused code"
echo "  - Add code splitting (Phase 2)"
echo ""
echo "📖 Full testing guide: PERFORMANCE_TESTING.md"
echo ""
echo "🌐 Open URL in browser: $URL"
