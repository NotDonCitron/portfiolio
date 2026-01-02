# 🔑 GitHub Token Authentication Issue

## Problem

```
Permission to NotDonCitron/portfiolio.git denied to NotDonCitron.
fatal: unable to access 'https://github.com/NotDonCitron/portfiolio.git/'
The requested URL returned error: 403
```

---

## Root Cause

Your personal access token was created with insufficient permissions or by the wrong GitHub account.

---

## 🎯 Solutions

### Solution 1: Regenerate Token with Correct Permissions

**Step 1: Go to GitHub Token Settings**
- Visit: https://github.com/settings/tokens

**Step 2: Create New Token (Classic)**
1. Click "Generate new token (classic)"
2. Note: Write this down - you won't see it again!
3. **Token name:** "Portfolio Deploy"
4. **Expiration:** Select "No expiration" or future date
5. **Select scopes (IMPORTANT!):**
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows) - optional
6. Click "Generate token"

**Step 3: Copy Token**
- Copy the token immediately (starts with `github_pat_...`)

**Step 4: Use Token**
```bash
# Replace YOUR_NEW_TOKEN with your new token
git push https://YOUR_NEW_TOKEN@github.com/NotDonCitron/portfiolio.git master
```

---

### Solution 2: Check GitHub Account Ownership

**Verify repository owner:**
1. Visit: https://github.com/NotDonCitron/portfiolio
2. Check if you are logged in as `NotDonCitron` in GitHub
3. If not, logout and login as correct account

**If repository is forked:**
- You need to push to your fork, not original repository

---

### Solution 3: Use GitHub Desktop (GUI)

**Easier method:**
1. Download GitHub Desktop: https://desktop.github.com/
2. Login to GitHub Desktop
3. Clone repository
4. Make changes
5. Push using GUI (no token needed)

---

### Solution 4: Manual Upload via GitHub Web Interface

**If all else fails:**

1. Visit: https://github.com/NotDonCitron/portfiolio
2. Click "Add file" → "Upload files"
3. Drag and drop all files from `/home/kek/Schreibtisch/portfolio-website/dist/`
4. Commit message: "Manual production deploy"
5. Click "Commit changes"

**Then enable GitHub Pages:**
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `master`
4. Save

Your site will be available at: `https://notdoncitron.github.io/portfiolio/`

---

## 📋 Quick Fix Summary

| Method | Difficulty | Notes |
|--------|------------|--------|
| Regenerate Token | ⭐⭐ Medium | Must have `repo` permissions |
| Check Account | ⭐ Easy | Verify logged in as NotDonCitron |
| GitHub Desktop | ⭐ Easy | No tokens needed |
| Manual Upload | ⭐⭐⭐ Hard | Works for GitHub Pages |

---

## ✅ Recommended Path

**1. Regenerate token with `repo` scope**
   - Visit: https://github.com/settings/tokens
   - Generate with `repo` permissions

**2. Run:**
```bash
git push https://YOUR_NEW_TOKEN@github.com/NotDonCitron/portfiolio.git master
```

**3. Vercel will auto-deploy**

---

## 🚀 Alternative: GitHub Pages (No Vercel)

If Vercel doesn't work, you can host on GitHub Pages for free:

```bash
# GitHub Pages will serve from:
https://notdoncitron.github.io/portfiolio/
```

Just upload `dist/` folder to repository and enable Pages in settings.

---

## 📞 Need Help?

1. Verify token permissions at: https://github.com/settings/tokens
2. Check repository access at: https://github.com/NotDonCitron/portfiolio/settings
3. Ensure you're logged into correct GitHub account
