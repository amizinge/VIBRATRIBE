import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, maxlength: 280 },
    media: { type: String },
    visibility: { type: String, enum: ['public', 'token-gated', 'followers'], default: 'public' },
    tags: { type: [String], default: [] },
    mentions: { type: [String], default: [] },
    stats: {
        comments: { type: Number, default: 0 },
        reposts: { type: Number, default: 0 },
        tips: { type: Number, default: 0 }
    }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
