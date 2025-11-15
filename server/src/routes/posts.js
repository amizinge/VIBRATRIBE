import express from 'express';
import Post from '../models/Post.js';
import { requireAuth } from '../utils/auth.js';

const router = express.Router();

router.get('/feed', async (_req, res) => {
    const posts = await Post.find()
        .populate('author', 'handle displayName avatar')
        .sort({ createdAt: -1 })
        .limit(50);
    res.json(posts);
});

router.post('/', requireAuth, async (req, res) => {
    const { body, media, visibility } = req.body;
    const post = await Post.create({
        author: req.user._id,
        body,
        media,
        visibility
    });
    await post.populate('author', 'handle displayName avatar');
    res.status(201).json(post);
});

export default router;
