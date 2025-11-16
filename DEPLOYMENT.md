# VIBRATRIBE Deployment Guide

This guide covers deploying the VIBRATRIBE monorepo to production.

## Architecture Overview

- **Frontend (Next.js)**: Deploy to Vercel
- **Backend API (Express)**: Deploy separately (Railway, Render, Fly.io, or similar)
- **Database**: PostgreSQL (Neon, Supabase, Railway, etc.)
- **Contracts**: Deploy to blockchain networks

## Prerequisites

1. Vercel account ([vercel.com](https://vercel.com))
2. Database hosting (Neon, Supabase, or similar)
3. WalletConnect Project ID ([cloud.walletconnect.com](https://cloud.walletconnect.com))
4. Node.js 20+ installed locally

## Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will auto-detect Next.js

### Step 2: Configure Project Settings

**Important**: Since this is a monorepo, configure:

- **Root Directory**: `apps/web`
- **Framework Preset**: Next.js
- **Build Command**: `cd ../.. && npm install && npm run build:web`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

Or use the `vercel.json` file included in the root.

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

#### Required Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_BASE=https://your-api-domain.com/api

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org

# WalletConnect (Required)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=fec85250c884733a5110f2aa3d6c9429
```

#### Optional Environment Variables

```bash
# For development/preview deployments
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Your app will be live at `your-app.vercel.app`

## Backend API Deployment

### Option 1: Railway

1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Set root directory to `apps/api`
5. Add environment variables:

```bash
DATABASE_URL=your-postgres-connection-string
JWT_SECRET=your-secret-key-min-32-chars
PORT=4000
WEB_ORIGIN=https://your-vercel-domain.vercel.app
SIWE_DOMAIN=your-vercel-domain.vercel.app
SIWE_URI=https://your-vercel-domain.vercel.app
SIWE_STATEMENT=Sign in with your wallet
```

6. Add PostgreSQL service
7. Run migrations: `npx prisma migrate deploy`
8. Deploy!

### Option 2: Render

1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add PostgreSQL database
6. Set environment variables (same as Railway)
7. Deploy!

### Option 3: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Create app: `fly launch` (from `apps/api` directory)
4. Add secrets:
   ```bash
   fly secrets set DATABASE_URL=your-db-url
   fly secrets set JWT_SECRET=your-secret
   fly secrets set WEB_ORIGIN=https://your-vercel-domain.vercel.app
   fly secrets set SIWE_DOMAIN=your-vercel-domain.vercel.app
   fly secrets set SIWE_URI=https://your-vercel-domain.vercel.app
   ```
5. Deploy: `fly deploy`

## Database Setup

### Using Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in your API deployment
5. Run migrations:
   ```bash
   cd apps/api
   npx prisma migrate deploy
   ```

### Using Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Update `DATABASE_URL` and run migrations

## Post-Deployment Steps

### 1. Update API URL in Frontend

After deploying the API, update the `NEXT_PUBLIC_API_BASE` environment variable in Vercel to point to your API URL.

### 2. Update CORS Settings

Make sure your API allows requests from your Vercel domain:
- Update `WEB_ORIGIN` in API environment variables
- Check CORS configuration in `apps/api/src/main.ts`

### 3. Run Database Migrations

```bash
cd apps/api
npx prisma migrate deploy
```

### 4. Seed Database (Optional)

```bash
cd apps/api
npm run prisma:seed
```

### 5. Update Vercel Rewrites

Update the `rewrites` section in `vercel.json` to point to your actual API URL if you want API routes proxied through Vercel.

## Environment Variables Reference

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE` | Yes | Full URL to your API (e.g., `https://api.example.com/api`) |
| `NEXT_PUBLIC_CHAIN_ID` | No | Blockchain chain ID (default: 56 for BNB Chain) |
| `NEXT_PUBLIC_RPC_URL` | No | RPC endpoint URL |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Yes | WalletConnect Cloud Project ID |

### Backend (API)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens (min 32 chars) |
| `PORT` | No | Server port (default: 4000) |
| `WEB_ORIGIN` | Yes | Frontend origin (e.g., `https://your-app.vercel.app`) |
| `SIWE_DOMAIN` | Yes | Domain for SIWE (should match frontend domain) |
| `SIWE_URI` | Yes | Full URI for SIWE |
| `SIWE_STATEMENT` | No | Custom SIWE statement |
| `SESSION_TTL_HOURS` | No | Session TTL in hours (default: 24) |

## Troubleshooting

### Build Failures

- **Monorepo issues**: Ensure root directory is set to `apps/web` in Vercel
- **Missing dependencies**: Check that all workspaces are installed
- **TypeScript errors**: Run `npm run build` locally first

### API Connection Issues

- **CORS errors**: Verify `WEB_ORIGIN` matches your Vercel domain exactly
- **Connection refused**: Check API URL and ensure API is deployed
- **Timeout**: Check API deployment logs

### Database Issues

- **Connection errors**: Verify `DATABASE_URL` format
- **Migration errors**: Run `npx prisma migrate deploy` manually
- **Schema mismatches**: Ensure migrations are up to date

## Monitoring

### Vercel Analytics

Enable Vercel Analytics in your project dashboard for performance monitoring.

### API Logging

Check deployment logs in your hosting provider for API errors and issues.

## Support

For issues, check:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

