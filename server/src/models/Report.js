import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    reporter: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'removed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
