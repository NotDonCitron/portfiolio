# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (Vite + React)
```bash
npm run dev              # Start Vite dev server (default: http://localhost:5173)
npm run build            # TypeScript compile + Vite production build
npm run lint             # Run ESLint on TypeScript files
npm run preview          # Preview production build locally
```

### Backend (Dual Architecture)
```bash
npm run backend          # Start Node.js proxy server (port 5000)
# OR
cd backend && python app.py  # Start Flask backend for image comparison (port 5000)
```

### Full Stack Development
```bash
npm run dev:all          # Run both frontend (Vite) and backend (Node proxy) concurrently
```

### Testing & Quality
```bash
npx playwright test      # Run Playwright tests (if configured)
```

## Architecture Overview

### Dual Backend System
This portfolio uses **two separate backend services** depending on the feature:

1. **Node.js Proxy (`backend/proxy.js`)**
   - Handles AI chat functionality via HuggingFace Router API
   - Acts as a secure proxy to prevent exposing HF_TOKEN to frontend
   - Routes: `/api/chat`, `/health`
   - Uses `HF_TOKEN` from `.env`

2. **Flask Backend (`backend/app.py`)**
   - Powers the AI Image Compare project demo
   - OpenCV-based image comparison (SSIM, feature matching, histogram)
   - Routes: `/api/compare-images`, `/api/chat` (for AI analysis)
   - Uses `HF_TOKEN` from `.env`

**Important:** Only one backend runs at a time. The frontend's `VITE_API_URL` determines which backend is active.

### Frontend Architecture

**Theme System:**
- 5 distinct themes: Cyberpunk (default), Corporate, Windows 95, RGB Gamer, Zen Mode
- CSS custom properties in `src/index.css` with `body[data-theme='...']` selectors
- Theme state managed in `App.tsx`, changed via `ThemeSwitcher.tsx`
- Each theme defines: colors, fonts, border-radius, shadows

**Component Structure:**
- **`App.tsx`**: Main router, theme state, global layout
- **`components/`**: Reusable UI components
  - `Dock.tsx`: macOS-style navigation dock
  - `MobileNav.tsx`: Mobile-responsive bottom navigation
  - `ThemeSwitcher.tsx`: Theme selector with particle effects
  - `AIChat.tsx`: Chat interface for AI assistant
  - `BentoItem.tsx`, `TimelineItem.tsx`: Layout primitives
- **`components/AmtGPT/`**: Multi-tab "AmtGPT" project workbench (simulator, research, dashboard, chat)
- **`components/fluidum/`**: "Fluidum" project components (logistics, training, shift planning, staff management)
- **`pages/`**: Full-page route components
  - `FluidumDashboard.tsx`: Dedicated dashboard for Fluidum project

**Lazy Loading:**
Large components are lazy-loaded via `React.lazy()` to optimize initial bundle size:
- `FluidumDashboard`, `AIChat`, `StartupAnimation`, `HACCPScanner`, `InventoryTwin`

**Routing:**
Uses `react-router-dom` v7 with routes defined in `App.tsx`:
- `/`: Main portfolio page
- `/fluidum`: Fluidum project dashboard

### Build Configuration

**Vite (`vite.config.ts`):**
- **Manual Code Splitting**: Chunks for `react-vendor`, `framer-motion`, `icons`, `qr-scanner`
- **Tailwind CSS v4**: Using `@tailwindcss/vite` plugin
- **Dev Server Warmup**: Pre-loads `main.tsx`, `App.tsx`, `index.css` for faster HMR

**TypeScript:**
- Three configs: `tsconfig.json` (base), `tsconfig.app.json` (app code), `tsconfig.node.json` (Vite config)
- Builds with `tsc -b` before Vite bundling

**ESLint (`eslint.config.js`):**
- Flat config format (ESLint 9+)
- Ignores: `dist`, `node_modules`, `backend/venv`, logs
- Rules: TypeScript, React Hooks, React Refresh

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Backend API URL
VITE_API_URL=http://localhost:5000

# HuggingFace API Token (backend only - never exposed to frontend)
HF_TOKEN=hf_your_token_here

# HuggingFace Model
HF_MODEL=HuggingFaceTB/SmolLM3-3B
```

**Security:** `HF_TOKEN` is only used by backend services, never sent to browser.

## Deployment

### Quick Deploy (Vercel) - Recommended ⭐

**Prerequisites:** Vercel account and CLI installed

```bash
# 1. Login to Vercel (opens browser)
vercel login

# 2. Deploy to preview
vercel

# 3. Deploy to production
vercel --prod
```

**Configuration:** `vercel.json` already configured with:
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Custom headers for service worker and manifest caching
- Auto-deployment on git push (when connected to GitHub)

**Post-deployment:**
- Add `HF_TOKEN` environment variable in Vercel dashboard
- Connect custom domain in Vercel settings
- Update domain URLs in `index.html`, `public/manifest.json`, `public/sitemap.xml`

### Automated Deployment Script

Use the included `deploy.sh` script for automated builds and deployment:

```bash
./deploy.sh
```

**Script performs:**
1. Cleans previous builds (`node_modules/.vite`, `dist/`)
2. Installs dependencies (`npm ci`)
3. Builds production bundle
4. Verifies build success
5. Shows bundle sizes
6. Commits and pushes to GitHub (triggers Vercel auto-deploy)

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Build settings:**
- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages

1. Push repository to GitHub
2. Go to repository Settings → Pages
3. Source: Deploy from branch
4. Branch: Select your main branch
5. Folder: `/` (root)
6. Save

**Note:** May require build step in GitHub Actions for SPA routing

### Docker Deployment

**Frontend Container:**
```bash
# Build frontend image
docker build -t portfolio-frontend .

# Run container
docker run -p 80:80 portfolio-frontend
```

**Frontend Dockerfile** (`./Dockerfile`):
- Stage 1: Build with Node.js 20 Alpine
- Stage 2: Serve with Nginx
- Includes SPA routing config
- Proxies `/api` requests to backend service

**Backend Container (Flask):**
```bash
# Build backend image
cd backend
docker build -t portfolio-backend .

# Run container with environment variables
docker run -p 5000:5000 \
  -e HF_TOKEN=your_token_here \
  -e HF_MODEL=HuggingFaceTB/SmolLM3-3B \
  portfolio-backend
```

**Backend Dockerfile** (`backend/Dockerfile`):
- Python 3.11 slim base
- Installs OpenCV system dependencies
- Exposes port 5000

### Kubernetes Deployment (GKE)

**Prerequisites:**
- Google Cloud project with GKE cluster
- Artifact Registry configured
- `kubectl` configured to cluster

**Configuration files:**
- `k8s-deployment.yaml`: Deployment manifests for frontend and backend
- `k8s-secret.yaml`: Secret for HuggingFace token

**Deploy to GKE:**

```bash
# 1. Create secret with your HF token
kubectl create secret generic hf-secret --from-literal=token=YOUR_HF_TOKEN_HERE

# 2. Build and push images (using Cloud Build)
gcloud builds submit --config cloudbuild.yaml

# Build backend separately
cd backend
docker build -t europe-west3-docker.pkg.dev/bdobdo/portfolio-repo/backend:latest .
docker push europe-west3-docker.pkg.dev/bdobdo/portfolio-repo/backend:latest

# 3. Apply Kubernetes manifests
kubectl apply -f k8s-deployment.yaml

# 4. Check deployment status
kubectl get pods
kubectl get services

# 5. Get external IP
kubectl get service frontend-service
```

**K8s Architecture:**
- **Frontend:** Nginx serving static files, LoadBalancer service (port 80)
- **Backend:** Flask API, ClusterIP service (port 5000)
- **Resource Limits:** Frontend (100m-500m CPU, 128Mi-512Mi RAM), Backend (250m-1000m CPU, 512Mi-1Gi RAM)
- **Cost Optimization:** Uses GKE Spot instances (60-90% savings)
- **Routing:** Frontend proxies `/api/*` to backend service

### Traditional Hosting (Static)

```bash
# Build the project
npm run build

# Upload dist/ folder to your hosting provider
# (e.g., cPanel, FTP, S3, etc.)
```

**Requirements:**
- Web server with SPA routing support (redirect all routes to `index.html`)
- HTTPS enabled for PWA functionality

### Environment Variables by Platform

**Vercel/Netlify:**
Add in dashboard:
- `HF_TOKEN` (backend API token)
- `HF_MODEL` (optional, defaults to SmolLM3-3B)

**Docker:**
Pass via `-e` flag:
```bash
docker run -e HF_TOKEN=xxx -e HF_MODEL=xxx
```

**Kubernetes:**
Managed via `k8s-secret.yaml` and ConfigMaps

**GitHub Pages/Static:**
Backend features (AI chat, image compare) will not work without separate backend deployment

### Post-Deployment Checklist

- [ ] Test site accessibility on deployed URL
- [ ] Verify theme switching works
- [ ] Test AI chat functionality (if backend deployed)
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit on production: `lighthouse https://your-domain.com --view`
- [ ] Test PWA install prompt (requires HTTPS)
- [ ] Verify service worker registration
- [ ] Update OpenGraph image URLs in `index.html` to production domain
- [ ] Update `public/manifest.json` with production URLs
- [ ] Update `public/sitemap.xml` with production domain
- [ ] Test offline functionality (PWA)

### Deployment Bundle Size

Typical production build (~450KB gzipped):
```
dist/
├── index.html (4.4KB)
├── assets/
│   ├── index-*.js (225KB)
│   ├── react-vendor-*.js (135KB)
│   ├── icons-*.js (27KB)
│   ├── AIChat-*.js (2.4KB)
│   ├── index-*.css (54KB)
│   └── AIChat-*.css (3.7KB)
├── manifest.json
├── sw.js
└── [SVG assets]
```

**Lighthouse Scores (as of last audit):**
- Performance: 99/100
- Accessibility: 96/100
- Best Practices: 100/100
- SEO: 100/100
- PWA: Ready

## Project-Specific Knowledge

**Projects Showcased:**
- **Live Demos:** Bar Inventory System, HACCP Checklist, AI Image Compare
- **Concept Projects:** K8s Auto-Healer, Sentient Firewall, Global CDN Manager
- **Research Projects:** AmtGPT (AI-powered diagnostics), Fluidum (hospitality management platform)

**Interactive Features:**
- Startup animation on first load
- Framer Motion animations throughout
- QR code scanning for HACCP demo
- Mock firewall simulation
- GitHub stats integration

## Common Patterns

**Theme-Aware Styling:**
Always use CSS custom properties for theme-dependent values:
```css
color: var(--text-primary);
background: var(--bg-card);
border-color: var(--accent-color);
```

**Framer Motion Animations:**
Use `whileHover`, `whileTap`, `initial`, `animate` props for interactive elements. See `ThemeSwitcher.tsx` for particle effects pattern.

**Responsive Design:**
- Desktop: Full Dock navigation
- Mobile: `MobileNav` bottom bar
- Breakpoints handled via Tailwind CSS utilities

## Development Notes

- **Hot Module Replacement (HMR):** Configured for localhost in `vite.config.ts`
- **Python Backend Setup:** Flask backend requires Python 3.12+ with virtualenv at `backend/venv/`
- **Image Compare Demo:** Uses OpenCV, scikit-image (SSIM), requires `backend/requirements.txt` installation
- **Port Conflicts:** Both backends use port 5000 - ensure only one is running
- **Bundle Size:** Chunk size warning limit is 500KB, monitor with `npm run build`
