# Backend Quick Setup Checklist

## What You Need to Set Up the Backend

### ✅ Already Configured
- [x] Prisma schema fixed and validated
- [x] Prisma Client generated
- [x] API routes defined
- [x] Authentication middleware
- [x] CORS configured
- [x] Express server setup
- [x] TypeScript configuration

### 🔧 What You Still Need to Do

#### 1. **MongoDB Database** (✅ Configured)
   - [x] MongoDB Atlas connection string provided
   - [x] Connection string: `mongodb+srv://ogban:w2j3pn7a15XQAGjF@vibratribe-db.3pypgrb.mongodb.net/vibratribe`
   - [x] Environment variable set in `.env.development`

#### 2. **Environment Variables** (✅ Configured)
   `.env.development` file created with MongoDB connection:
   ```bash
   DATABASE_URL=mongodb+srv://ogban:w2j3pn7a15XQAGjF@vibratribe-db.3pypgrb.mongodb.net/vibratribe
   JWT_SECRET=super-secret-change-this-to-a-strong-random-string
   WEB_ORIGIN=http://localhost:3000
   SIWE_DOMAIN=localhost
   SIWE_URI=http://localhost:3000
   ```
   
   ⚠️ **Important**: Generate a secure `JWT_SECRET` for production!

#### 3. **Push Database Schema** (Required)
   ```bash
   cd apps/api
   npm run prisma:push
   ```
   This syncs your Prisma schema to MongoDB (creates collections and indexes).

#### 4. **Generate Prisma Client** (Done ✅)
   Already completed - Prisma Client is generated.

#### 5. **Seed Database** (Optional)
   ```bash
   cd apps/api
   npm run prisma:seed
   ```

#### 6. **Start Development Server**
   ```bash
   cd apps/api
   npm run start:dev
   ```

## Quick Setup Steps

### For Local Development:

```bash
# 1. Install dependencies (if not done)
cd apps/api
npm install

# 2. Environment file already created with MongoDB connection
# Check apps/api/.env.development

# 3. Push schema to MongoDB
npm run prisma:push

# 4. Generate a secure JWT secret (optional, but recommended)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Update JWT_SECRET in .env.development with the generated value

# 5. Start server
npm run start:dev
```

### For Production Deployment:

1. **Set up cloud database** (Neon/Supabase)
2. **Deploy to Railway/Render/Fly.io**
3. **Set environment variables** in hosting platform
4. **Run migrations**: `npx prisma migrate deploy`
5. **Update frontend** with API URL

## Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | ✅ Yes | Secret for JWT tokens (32+ chars) | Generated random string |
| `WEB_ORIGIN` | ✅ Yes | Frontend URL for CORS | `http://localhost:3000` |
| `SIWE_DOMAIN` | ✅ Yes | Domain for SIWE | `localhost` or your domain |
| `SIWE_URI` | ✅ Yes | Full URI for SIWE | `http://localhost:3000` |
| `PORT` | ❌ No | Server port (default: 4000) | `4000` |
| `SESSION_TTL_HOURS` | ❌ No | Session TTL (default: 24) | `24` |
| `SIWE_STATEMENT` | ❌ No | Custom SIWE message | Optional |

## Next Steps

1. **Set up database** → See BACKEND_SETUP.md for detailed instructions
2. **Run migrations** → Creates all tables
3. **Start API server** → Backend will be running
4. **Connect frontend** → Update `NEXT_PUBLIC_API_BASE` in frontend
5. **Test authentication** → Try wallet sign-in flow

## Need Help?

- **Detailed Setup**: See [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Environment Variables**: See [ENV_VARIABLES.md](./ENV_VARIABLES.md)

