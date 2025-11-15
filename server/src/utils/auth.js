import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'missing token' });
    const [, token] = header.split(' ');
    try {
        const payload = jwt.verify(token, config.jwtSecret);
        req.user = await User.findById(payload.sub);
        if (!req.user) throw new Error('user missing');
        next();
    } catch (err) {
        res.status(401).json({ error: 'invalid token' });
    }
}
