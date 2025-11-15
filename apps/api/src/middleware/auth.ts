import type { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { verifyJwt } from '../utils/jwt';

export interface AuthedRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

export function authenticate(req: AuthedRequest, _res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.replace('Bearer ', '') ?? null;
  const cookieToken = req.cookies?.vt_jwt as string | undefined;
  const token = bearer ?? cookieToken;

  if (!token) return next();

  try {
    const payload = verifyJwt(token);
    req.user = { id: payload.sub, role: payload.role as Role };
  } catch (err) {
    console.warn('Invalid JWT', err);
  }
  next();
}

export function requireAuth(roles: Role[] = [Role.USER, Role.MODERATOR, Role.ADMIN]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
}
