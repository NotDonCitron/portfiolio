#!/bin/bash

# ========================================
# Auto-Deployment Script
# ========================================

set -e

echo "🚀 Starting Auto-Deployment..."

# 1. Clean previous builds
echo "📦 Cleaning..."
rm -rf node_modules/.vite
rm -rf dist

# 2. Install dependencies
echo "📥 Installing dependencies..."
npm ci --prefer-offline --no-audit

# 3. Build
echo "🔨 Building..."
npm run build

# 4. Verify build
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist folder not created"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📦 Bundle sizes:"
du -h dist/assets/*.js | sort -h

# 5. Git status
echo ""
echo "📝 Git status:"
git status --short

# 6. Commit and push
if [ -n "$(git status --porcelain)" ]; then
    echo "📤 Changes detected, committing..."
    git add .
    git commit -m "Auto-deploy: $(date +%Y-%m-%d)"

    echo "🚀 Pushing to GitHub..."
    git push origin master
else
    echo "✅ No changes to commit"
fi

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Vercel will auto-deploy from GitHub"
echo "2. Check: https://vercel.com/dashboard"
echo "3. Monitor deployment logs"
