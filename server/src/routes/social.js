import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../utils/auth.js';

const router = express.Router();

router.post('/follow/:handle', requireAuth, async (req, res) => {
    const target = await User.findOne({ handle: req.params.handle });
    if (!target) return res.status(404).json({ error: 'user not found' });
    const already = target.graph.followers.includes(req.user.handle);
    if (already) {
        target.graph.followers = target.graph.followers.filter(h => h !== req.user.handle);
        req.user.graph.following = req.user.graph.following.filter(h => h !== target.handle);
    } else {
        target.graph.followers.push(req.user.handle);
        req.user.graph.following.push(target.handle);
    }
    await target.save();
    await req.user.save();
    res.json({ following: !already });
});

export default router;
