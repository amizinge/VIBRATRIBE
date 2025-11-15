import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

router.get('/trending', async (_req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(100);
    const counts = {};
    posts.forEach(post => {
        post.tags.forEach(tag => {
            counts[tag] = (counts[tag] || 0) + 1;
        });
    });
    const trending = Object.entries(counts).map(([tag, volume]) => ({
        tag,
        volume: `${volume} posts`,
        sentiment: volume > 10 ? 'Bullish' : 'Neutral'
    }));
    res.json(trending.slice(0, 5));
});

router.get('/chain/activity', async (_req, res) => {
    res.json([
        { title: 'Creator staking activated', hash: '0x12ab', status: 'Success' },
        { title: 'Pulse DAO vote live', hash: '0x98ff', status: 'Pending' }
    ]);
});

router.get('/spaces/live', async (_req, res) => {
    res.json([
        { title: 'Web3 social funding', host: '@pulse', listeners: 320 },
        { title: 'Music NFT showcase', host: '@sound', listeners: 140 }
    ]);
});

export default router;
