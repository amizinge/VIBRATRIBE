import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { requireAuth } from '../utils/auth.js';

const router = express.Router();

router.post('/send', requireAuth, async (req, res) => {
    const { to, body } = req.body;
    let convo = await Conversation.findOne({ participants: { $all: [req.user.handle, to] } });
    if (!convo) {
        convo = await Conversation.create({ participants: [req.user.handle, to] });
    }
    const message = await Message.create({
        conversation: convo._id,
        from: req.user.handle,
        body
    });
    convo.lastMessageAt = new Date();
    await convo.save();
    res.status(201).json(message);
});

router.get('/conversations', requireAuth, async (req, res) => {
    const conversations = await Conversation.find({ participants: req.user.handle })
        .sort({ updatedAt: -1 })
        .limit(20);
    res.json(conversations);
});

export default router;
