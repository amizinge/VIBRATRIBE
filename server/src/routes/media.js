import express from 'express';
import { requireAuth } from '../utils/auth.js';

const router = express.Router();

router.post('/upload', requireAuth, async (req, res) => {
    const { contentType } = req.body;
    // In production we would generate a pre-signed URL.
    res.json({
        uploadUrl: 'https://example.com/upload',
        contentType
    });
});

export default router;
