import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    from: { type: String, required: true }, // handle
    body: { type: String, required: true },
    media: { type: String }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
