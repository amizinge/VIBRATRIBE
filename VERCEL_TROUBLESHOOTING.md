# Vercel Deployment Troubleshooting

## 404: DEPLOYMENT_NOT_FOUND Error

If you're seeing a 404 error after deploying to Vercel, follow these steps:

### 1. Verify Project Settings in Vercel Dashboard

Go to your Vercel project settings and verify:

- **Root Directory**: Set to `apps/web`
- **Framework Preset**: Next.js
- **Build Command**: Should be `cd ../.. && npm install && npm run build:web` (or leave empty to use vercel.json)
- **Output Directory**: `.next` (or leave empty)
- **Install Command**: Should be `cd ../.. && npm install` (or leave empty to use vercel.json)

### 2. Check Vercel Deployment Logs

1. Go to your Vercel project dashboard
2. Click on the failed deployment
3. Check the build logs for errors
4. Common issues:
   - Missing environment variables
   - Build command failing
   - TypeScript errors
   - Missing dependencies

### 3. Manual Configuration (If vercel.json isn't being used)

If Vercel isn't reading `vercel.json`, manually set these in the dashboard:

**Build Settings:**
- Root Directory: `apps/web`
- Build Command: `cd ../.. && npm install && npm run build:web`
- Output Directory: `.next`
- Install Command: `cd ../.. && npm install`

### 4. Required Environment Variables

Make sure these are set in Vercel:

- `NEXT_PUBLIC_API_BASE` - Your backend API URL (required)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - `fec85250c884733a5110f2aa3d6c9429`

Optional but recommended:
- `NEXT_PUBLIC_CHAIN_ID` - `56` (BNB Chain)
- `NEXT_PUBLIC_RPC_URL` - RPC endpoint URL

### 5. Test Build Locally

Before deploying, test the build locally:

```bash
# From project root
cd apps/web
npm install
npm run build
```

If this fails locally, it will fail on Vercel too.

### 6. Force Redeploy

After fixing configuration:

1. Go to Vercel dashboard
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger a new deployment

### 7. Check Deployment URL

Make sure you're accessing the correct URL:
- Production: `your-project-name.vercel.app`
- Preview: Check the deployment URL in Vercel dashboard

### Common Solutions

**If build fails:**
- Check that all workspace dependencies are installed
- Verify Node.js version (should be 20+)
- Check for TypeScript errors: `npm run build:web` locally

**If deployment succeeds but shows 404:**
- Verify root directory is set correctly
- Check that output directory matches Next.js build output
- Ensure `vercel.json` is in the repository root

**If environment variables are missing:**
- Add all required `NEXT_PUBLIC_*` variables in Vercel dashboard
- Redeploy after adding variables

### Still Having Issues?

1. Check Vercel logs in the dashboard
2. Test build command locally: `cd apps/web && npm run build`
3. Verify `vercel.json` is committed and pushed to GitHub
4. Try removing `rootDirectory` and using a custom build command from root

