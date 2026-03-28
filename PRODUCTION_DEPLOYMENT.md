# 🚀 Production Deployment Guide

## Architecture Stack

```
Frontend: Vercel (React/Vite)
         ↓
Backend: Vercel Serverless Functions (Express)
         ↓
Database: Supabase (PostgreSQL + Auth)
         ↓
Payments: Stripe (Billing)
         ↓
AI Service: Google Cloud Run (FastAPI)
```

---

## Step 1: Deploy Frontend to Vercel

### Option A: Git Push (Recommended)
```bash
# 1. Create GitHub repo
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Import to Vercel
# Go to vercel.com → Import Project → Select your repo

# 3. Set environment variables
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

### Option B: CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

---

## Step 2: Deploy Backend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd backend
vercel
```

Add environment variables in Vercel dashboard:
- `STRIPE_SECRET_KEY`
- `DATABASE_URL` (if needed)

---

## Step 3: Setup Supabase

1. Go to https://supabase.com
2. Create new project
3. Run SQL from `backend/sql/schema.sql`
4. Enable Auth providers
5. Copy API keys to Vercel env vars

---

## Step 4: Configure Stripe

1. Go to https://stripe.com
2. Create account
3. Get API keys (Publishable + Secret)
4. Add webhook endpoint: `https://your-backend.vercel.app/webhook/stripe`
5. Add keys to environment variables

---

## Step 5: Deploy AI Service

Option A: Google Cloud Run
```bash
# Build Docker image
docker build -t car-customizer-ai .

# Deploy to Cloud Run
gcloud run deploy car-customizer-ai --image car-customizer-ai
```

Option B: Railway/Heroku
```bash
# Push to Railway
railway up

# Or Heroku
git push heroku main
```

---

## Environment Variables Needed

### Frontend (.env.local)
```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://your-backend.vercel.app
VITE_STRIPE_KEY=pk_live_...
```

### Backend (.env)
```
STRIPE_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...supabase.co
SUPABASE_KEY=...
```

---

## Verification Checklist

- [ ] Frontend loads at custom domain
- [ ] Login works (Supabase)
- [ ] Save customizations works
- [ ] API calls successful
- [ ] Stripe payment works
- [ ] AI detection responds
- [ ] HTTPS enabled
- [ ] CORS configured

---

## Post-Deployment

1. Monitor logs: Vercel Dashboard → Logs
2. Set up error tracking (Sentry)
3. Configure domain DNS
4. Enable caching
5. Setup CI/CD pipeline

**Estimated time**: 30-45 minutes from start to live
