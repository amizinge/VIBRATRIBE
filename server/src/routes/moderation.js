import express from 'express';
import Report from '../models/Report.js';
import Post from '../models/Post.js';
import { requireAuth } from '../utils/auth.js';

const router = express.Router();

router.get('/queue', async (_req, res) => {
    const queue = await Report.find({ status: 'pending' })
        .populate('post', 'body')
        .limit(20);
    res.json(queue.map(report => ({
        _id: report.id,
        reason: report.reason,
        preview: report.post?.body?.slice(0, 120),
        author: { handle: report.reporter }
    })));
});

router.post('/report/:postId', requireAuth, async (req, res) => {
    const { reason = 'Abuse' } = req.body;
    await Report.create({
        post: req.params.postId,
        reporter: req.user.handle,
        reason
    });
    res.status(201).json({ ok: true });
});

router.post('/resolve/:id', requireAuth, async (req, res) => {
    const { approve } = req.body;
    const report = await Report.findById(req.params.id).populate('post');
    if (!report) return res.status(404).json({ error: 'report not found' });
    report.status = approve ? 'approved' : 'removed';
    await report.save();
    if (!approve && report.post) {
        await Post.findByIdAndDelete(report.post._id);
    }
    res.json({ ok: true });
});

export default router;
