import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV ?? 'development'}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'super-secret',
  sessionTtlHours: Number(process.env.SESSION_TTL_HOURS ?? 24),
  siwe: {
    domain: process.env.SIWE_DOMAIN ?? 'localhost',
    uri: process.env.SIWE_URI ?? 'http://localhost:3000',
    statement: process.env.SIWE_STATEMENT ?? 'Sign in with your wallet'
  }
};
