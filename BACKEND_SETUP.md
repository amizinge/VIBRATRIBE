# Backend API Setup Guide

This guide will walk you through setting up the VIBRATRIBE Express + Prisma API backend.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL database (local or cloud-hosted)
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
cd apps/api
npm install
```

This will install all required dependencies including Prisma, Express, and other packages.

## Step 2: Set Up Database

### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```bash
   createdb vibratribe
   ```
3. Update your `.env.development` file with:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/vibratribe"
   ```

### Option B: Cloud Database (Recommended for Production)

#### Using Neon (Free tier available)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in your environment variables

#### Using Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Update `DATABASE_URL` in your environment variables

## Step 3: Environment Variables

Create a `.env.development` file in `apps/api/` directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/vibratribe

# Server
PORT=4000
NODE_ENV=development
WEB_ORIGIN=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
SESSION_TTL_HOURS=24

# SIWE (Sign-In with Ethereum) Configuration
SIWE_DOMAIN=localhost
SIWE_URI=http://localhost:3000
SIWE_STATEMENT=Sign in with your wallet
```

**Important**: 
- Generate a strong `JWT_SECRET` (minimum 32 characters)
- Use a secure random string (see Security Notes below)
- Update `WEB_ORIGIN` to match your frontend URL
- Update `SIWE_DOMAIN` and `SIWE_URI` to match your frontend domain

## Step 4: Generate Prisma Client

```bash
cd apps/api
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

## Step 5: Run Database Migrations

### For Development:
```bash
cd apps/api
npm run prisma:migrate
```

This will:
- Create migration files
- Apply them to your database
- Create all tables, relationships, and indexes

### For Production:
```bash
cd apps/api
npx prisma migrate deploy
```

This applies pending migrations without creating new ones.

## Step 6: Seed Database (Optional)

Populate your database with sample data:

```bash
cd apps/api
npm run prisma:seed
```

This creates a test user and a sample post.

## Step 7: Start the Development Server

```bash
cd apps/api
npm run start:dev
```

The API will be running at `http://localhost:4000`

You can verify it's working by visiting:
- Health check: `http://localhost:4000/health`
- API routes: `http://localhost:4000/api`

## Step 8: Test the API

### Health Check
```bash
curl http://localhost:4000/health
```

Should return:
```json
{"status": "ok"}
```

### Test Authentication Flow

1. **Request a challenge**:
   ```bash
   curl -X POST http://localhost:4000/api/auth/challenge \
     -H "Content-Type: application/json" \
     -d '{"address": "0x1234567890123456789012345678901234567890"}'
   ```

2. **Verify signature** (after signing with wallet):
   ```bash
   curl -X POST http://localhost:4000/api/auth/verify \
     -H "Content-Type: application/json" \
     -d '{"message": "...", "signature": "..."}'
   ```

## Build for Production

```bash
cd apps/api
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

## Production Deployment Checklist

### 1. Environment Variables

Set these in your hosting platform (Railway, Render, Fly.io):

- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `JWT_SECRET` - Strong secret key (32+ chars)
- ✅ `PORT` - Server port (usually 4000)
- ✅ `NODE_ENV` - Set to `production`
- ✅ `WEB_ORIGIN` - Your frontend URL (e.g., `https://your-app.vercel.app`)
- ✅ `SIWE_DOMAIN` - Your frontend domain
- ✅ `SIWE_URI` - Your frontend full URL
- ✅ `SIWE_STATEMENT` - Custom SIWE message (optional)

### 2. Build Step

Most platforms auto-detect, but configure:
- **Build Command**: `npm install && npm run build && npm run prisma:generate`
- **Start Command**: `npm start`

### 3. Database Migrations

Run migrations after deployment:
```bash
npx prisma migrate deploy
```

### 4. Prisma Generate

Ensure Prisma Client is generated:
```bash
npm run prisma:generate
```

Or add to build command: `npm run build && npm run prisma:generate`

## API Endpoints Overview

### Authentication
- `POST /api/auth/challenge` - Get SIWE challenge
- `POST /api/auth/verify` - Verify SIWE signature and get JWT
- `POST /api/auth/logout` - Logout (clears cookie)

### Profile
- `GET /api/me` - Get current user profile (requires auth)
- `PUT /api/me` - Update profile (requires auth)
- `GET /api/profiles/:handle` - Get profile by handle

### Posts
- `GET /api/posts/feed` - Get user feed (requires auth)
- `GET /api/posts/explore` - Explore posts
- `POST /api/posts` - Create post (requires auth)
- `GET /api/posts/:id` - Get post by ID

### Social
- `POST /api/social/follow/:handle` - Follow user (requires auth)
- `POST /api/social/unfollow/:handle` - Unfollow user (requires auth)
- `GET /api/social/followers/:handle` - Get followers
- `GET /api/social/following/:handle` - Get following

### Moderation
- `POST /api/moderation/report/:postId` - Report post (requires auth)
- `GET /api/moderation/queue` - Get moderation queue (requires staff)
- `POST /api/moderation/resolve/:reportId` - Resolve report (requires staff)

### Notifications
- `GET /api/notifications` - Get user notifications (requires auth)

### Activity
- `GET /api/chain/activity` - Get on-chain activity

## Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solutions**:
- Verify `DATABASE_URL` is correct
- Check database is running (if local)
- Verify network access (if cloud)
- Check SSL mode if required: `?sslmode=require`

### Prisma Migration Issues

**Error**: `Migration failed`

**Solutions**:
- Check database connection
- Ensure you have write permissions
- Try resetting: `npx prisma migrate reset` (⚠️ deletes all data)
- Check for schema errors: `npx prisma validate`

### Port Already in Use

**Error**: `Port 4000 is already in use`

**Solutions**:
- Change `PORT` in `.env.development`
- Kill process using port 4000:
  ```bash
  # Mac/Linux
  lsof -ti:4000 | xargs kill
  
  # Windows
  netstat -ano | findstr :4000
  taskkill /PID <PID> /F
  ```

### CORS Errors

**Error**: CORS policy blocks requests

**Solutions**:
- Verify `WEB_ORIGIN` matches frontend URL exactly
- Check `apps/api/src/main.ts` CORS configuration
- Ensure credentials are included in requests

## Security Notes

### Generate Secure JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### Environment Variable Security

- ✅ Never commit `.env` files to git
- ✅ Use different secrets for development and production
- ✅ Rotate secrets periodically
- ✅ Use secrets management (platform secrets, Vault, etc.)

### Database Security

- ✅ Use SSL/TLS connections in production
- ✅ Use connection pooling
- ✅ Regular backups
- ✅ Limit database user permissions
- ✅ Use strong passwords

## Next Steps

1. ✅ Backend API is running
2. 🔄 Connect frontend to API (set `NEXT_PUBLIC_API_BASE`)
3. 🔄 Test authentication flow end-to-end
4. 🔄 Deploy to production (see DEPLOYMENT.md)

## Support

- Prisma Docs: https://www.prisma.io/docs
- Express Docs: https://expressjs.com/
- SIWE Docs: https://docs.login.xyz/

