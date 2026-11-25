# Runbook: Production Deployment Guide

## 1. Prerequisites

- Clean git working tree on `main`.
- All tests passing: `npm test`.
- Linter and typechecker passing: `npm run lint && npx tsc --noEmit`.
- Production environment variables populated in deployment dashboard.

---

## 2. Automated First-Deploy via Cloudflare / Vercel

1. Connect repository to Cloudflare Pages or Vercel.
2. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public` (or `dist`)
3. Add environment variables:
   - `VITE_APP_ENV`: `production`
   - `VITE_APP_URL`: `https://your-domain.edu`
   - `VITE_DEFAULT_INSTITUTION_ID`: `inst-college-1`
4. Deploy branch `main`.

---

## 3. Post-Deployment Verification

- [ ] Verify homepage loads with HTTPS enabled.
- [ ] Test Demo Teacher login and verify that sections load.
- [ ] Update a test student's internal mark and confirm total calculation is preserved after browser refresh.
- [ ] Test Demo Student login and verify student private transcript is read-only.
- [ ] Check browser console for zero unhandled errors or leaked secrets.
