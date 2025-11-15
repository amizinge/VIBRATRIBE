import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: { type: [String], required: true }, // handles
    lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
