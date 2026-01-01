# Performance Testing Guide

## Current Bundle Size (Baseline)

**Web Bundle (Actual):**
- JavaScript: 360KB (gzip: ~120KB)
- CSS: 44KB (gzip: ~9KB)
- HTML: 4KB
- **Total: ~408KB** (gzip: ~133KB)

**Note:** The 392MB dist size includes Python venv for image-compare backend (not web bundle)

---

## Performance Testing Methods

### 1. **Chrome DevTools (Easiest - No install needed)**

**Steps:**
1. Open http://localhost:5173/ in Chrome
2. Press F12 (or Cmd+Opt+I on Mac)
3. Go to **Lighthouse** tab
4. Click "Analyze page load"
5. Wait for results

**Key Metrics to Watch:**
- Performance Score (aim for 90+)
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.8s
- Cumulative Layout Shift (CLS) < 0.1

### 2. **Network Tab (Loading Speed)**

**Steps:**
1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page (F5)
4. Look at "DOMContentLoaded" and "Load" times

**What to Check:**
- Total load time < 2s on fast connection
- Number of requests < 100
- No large images blocking initial render

### 3. **Performance Tab (Runtime Performance)**

**Steps:**
1. Open DevTools → **Performance** tab
2. Click record (circle icon)
3. Scroll through page
4. Click stop
5. Analyze the recording

**What to Check:**
- Main thread blocking time
- Script evaluation time
- Layout thrashing

### 4. **Online Tools (Requires internet)**

Run your build and deploy, then test:

```bash
npm run build
npm run preview
```

Then use:
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
  - Enter your URL
  - Get 0-100 score
  - Detailed optimization suggestions

- **GTmetrix**: https://gtmetrix.com/
  - Waterfall view of resources
  - Loading timeline
  - Grade A-F

- **WebPageTest**: https://www.webpagetest.org/
  - Multiple locations
  - Video playback of load
  - Detailed metrics

### 5. **Bundle Analysis**

```bash
npm install -D rollup-plugin-visualizer

# Then in vite.config.ts:
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true })
  ]
})
```

Run `npm run build` to see visual bundle breakdown.

---

## Current Performance Baseline

### Manual Test (You can do now):

**Test 1: First Paint**
- Open http://localhost:5173/
- Count seconds until you see content
- **Target:** < 2 seconds

**Test 2: Interactive**
- Try clicking buttons/scrolling
- Time until everything responds
- **Target:** < 3 seconds

**Test 3: Smooth Scrolling**
- Scroll through all sections
- Watch for stuttering/lag
- **Target:** No visible lag

**Test 4: Theme Switch**
- Click theme palette
- Time until new theme applies
- **Target:** Instant (no reload)

---

## After Phase 2 Optimization

We'll measure improvement:
- **Before:** Current baseline
- **After:** Code splitting, lazy loading, optimization
- **Goal:** 50% faster initial load, higher Lighthouse scores

---

## Quick Performance Check Script

```bash
# Test load time with curl
time curl -s http://localhost:5173/ > /dev/null

# Check bundle size
du -sh dist/assets/

# Count requests (DevTools is better for this)
```

---

## Next Steps

1. Run Lighthouse test now (baseline)
2. We'll implement Phase 2 optimizations
3. Re-test and compare scores
4. Document improvements

Ready to test? Open Chrome DevTools → Lighthouse → Analyze!
