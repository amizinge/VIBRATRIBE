# VIBRATRIBE Monorepo

Web3-native social network where wallets are identities. This monorepo contains the Next.js frontend, Express + Prisma API, and Solidity/Hardhat contracts powering tipping and Spaces.

## Directory Layout

```
apps/
  web/        # Next.js 14 App Router frontend styled with Tailwind
  api/        # Express + Prisma backend exposing REST endpoints
contracts/    # Hardhat workspace with TipJar contract + tests
infra/        # Docker Compose and deployment assets
scripts/      # Utility scripts (seed, etc.)
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   npm --workspace apps/web install
   npm --workspace apps/api install
   npm --workspace contracts install
   ```
2. **Environment variables**
   - Copy `apps/api/.env.example` → `.env.development` and set:
     - `DATABASE_URL` (Postgres/Neon/etc.)
     - `JWT_SECRET`
     - `SIWE_*` fields for domain/URI/statement
     - `WEB_ORIGIN` to `http://localhost:3000` for dev
   - Frontend expects:
     - `NEXT_PUBLIC_API_BASE` (e.g. `http://localhost:4000/api`)
     - `NEXT_PUBLIC_CHAIN_ID` (default `56` BNB Chain)
     - `NEXT_PUBLIC_RPC_URL`
     - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - Contracts use `RPC_URL` and `DEPLOYER_KEY` when deploying.
3. **Database**
   ```bash
   cd apps/api
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
4. **Development servers**
   ```bash
   # Run API (http://localhost:4000)
   npm run dev:api

   # In another terminal run web (http://localhost:3000)
   npm run dev:web
   ```
   Or concurrently: `npm run dev` (uses `concurrently`).

## Testing & Builds

- API build: `npm run build:api`
- Web build: `npm run build:web`
- Hardhat tests: `cd contracts && npm run test`

## Docker

`infra/docker-compose.yml` spins up Postgres + API + Web ready for local review:
```bash
cd infra
docker compose up --build
```

## Smart Contracts

- `contracts/contracts/TipJar.sol` handles ERC-20 tipping.
- Deploy locally: `cd contracts && npx hardhat run scripts/deploy.ts --network localhost`.
- Listen for `TipSent` events to populate on-chain activity feed.

## Scripts

- `scripts/seed.sh` seeds the development database via Prisma script inside API app.

## Deployment

**Ready for Vercel deployment!** 🚀

This project is configured for easy deployment to Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure root directory: `apps/web`
4. Add environment variables (see DEPLOYMENT.md)
5. Deploy!

The project includes:
- ✅ `vercel.json` configuration
- ✅ Optimized Next.js config for Vercel
- ✅ Security headers configured
- ✅ Monorepo build support

### Environment Variables Needed

**Frontend (Vercel):**
- `NEXT_PUBLIC_API_BASE` - Your API URL
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - `fec85250c884733a5110f2aa3d6c9429`

**Backend (Separate deployment):**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT
- `WEB_ORIGIN` - Frontend domain
- `SIWE_*` - Sign-In with Ethereum configuration

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete setup instructions.

## Backend Setup

**Quick Start**: See [BACKEND_QUICKSTART.md](./BACKEND_QUICKSTART.md) for a checklist of what's needed.

**Detailed Guide**: See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for step-by-step backend setup instructions.

### What's Needed:
1. ✅ MongoDB database (configured with Atlas)
2. ✅ Environment variables configured
3. ✅ Database schema pushed to MongoDB
4. ⏳ API server start (`npm run start:dev`)

**MongoDB Connection**: Already configured and schema pushed successfully! 🎉

## Next Steps

- Expand API modules (DMs, Spaces gating checks, notifications fan-out).
- Wire frontend React Query hooks to live endpoints.
- Add workers to index TipJar events and push notifications.
