import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export type JwtPayload = {
  sub: string;
  role: string;
};

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: `${config.sessionTtlHours}h`
  });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
