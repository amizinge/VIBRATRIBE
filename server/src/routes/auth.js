import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';

import User from '../models/User.js';
import { config } from '../config.js';

const router = express.Router();

router.post('/challenge', async (req, res) => {
    const { wallet } = req.body;
    if (!wallet) return res.status(400).json({ error: 'wallet required' });
    const lower = wallet.toLowerCase();
    let user = await User.findOne({ wallet: lower });
    if (!user) {
        user = await User.create({
            wallet: lower,
            handle: `@${lower.slice(2, 8)}`,
            displayName: 'Pulse Citizen'
        });
    }
    user.nonce = `Sign to authenticate: ${crypto.randomUUID()}`;
    await user.save();
    res.json({ nonce: user.nonce });
});

router.post('/verify', async (req, res) => {
    const { wallet, signature } = req.body;
    if (!wallet || !signature) {
        return res.status(400).json({ error: 'wallet and signature required' });
    }
    const user = await User.findOne({ wallet: wallet.toLowerCase() });
    if (!user) {
        return res.status(400).json({ error: 'user not found' });
    }
    const recovered = ethers.utils.verifyMessage(user.nonce, signature).toLowerCase();
    if (recovered !== wallet.toLowerCase()) {
        return res.status(401).json({ error: 'signature mismatch' });
    }
    user.nonce = `Sign to authenticate: ${crypto.randomUUID()}`;
    await user.save();
    const token = jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: '7d' });
    res.json({
        token,
        profile: {
            handle: user.handle,
            displayName: user.displayName,
            avatar: user.avatar,
            bio: user.bio
        }
    });
});

export default router;
