# Environment Variables Reference

This document lists all required and optional environment variables for the VIBRATRIBE project.

## Frontend (Next.js / Vercel)

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE` | Full URL to your API backend | `https://api.example.com/api` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud Project ID | Get from [cloud.walletconnect.com](https://cloud.walletconnect.com) |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_CHAIN_ID` | Blockchain chain ID | `56` (BNB Chain) |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint URL | `https://bsc-dataseed.binance.org` |
| `NODE_ENV` | Environment mode | `production` |

### Example `.env.local` (Frontend)

```bash
NEXT_PUBLIC_API_BASE=https://your-api.railway.app/api
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org
```

## Backend (Express API)

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | Generate a strong random string |
| `WEB_ORIGIN` | Frontend origin URL | `https://your-app.vercel.app` |
| `SIWE_DOMAIN` | Domain for Sign-In with Ethereum | `your-app.vercel.app` |
| `SIWE_URI` | Full URI for SIWE | `https://your-app.vercel.app` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment mode | `production` |
| `SESSION_TTL_HOURS` | Session TTL in hours | `24` |
| `SIWE_STATEMENT` | Custom SIWE statement | `Sign in with your wallet` |

### Example `.env` (Backend)

```bash
DATABASE_URL=postgresql://user:password@host:5432/vibratribe
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
PORT=4000
WEB_ORIGIN=https://your-app.vercel.app
SIWE_DOMAIN=your-app.vercel.app
SIWE_URI=https://your-app.vercel.app
SIWE_STATEMENT=Sign in with your wallet
SESSION_TTL_HOURS=24
```

## How to Set Environment Variables

### Vercel (Frontend)

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select which environments (Production, Preview, Development) it applies to
5. Redeploy after adding variables

### Railway / Render / Fly.io (Backend)

Each platform has its own environment variable settings:

- **Railway**: Project Settings → Variables
- **Render**: Environment → Environment Variables
- **Fly.io**: `fly secrets set KEY=value` or dashboard

## Security Notes

- ✅ Never commit `.env` files to git
- ✅ Use strong, random values for `JWT_SECRET` (32+ characters)
- ✅ Keep `DATABASE_URL` secure and rotate credentials regularly
- ✅ Use different secrets for production vs development
- ✅ Enable HTTPS in production (Vercel does this automatically)

## Generating Secrets

### JWT Secret (32+ characters)

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### Database URL Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

For managed databases (Neon, Supabase), they provide the connection string directly.

