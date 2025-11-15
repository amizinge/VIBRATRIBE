import mongoose from 'mongoose';
import crypto from 'crypto';

const socialGraphSchema = new mongoose.Schema({
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    blocked: { type: [String], default: [] }
}, { _id: false });

const userSchema = new mongoose.Schema({
    wallet: { type: String, required: true, unique: true },
    handle: { type: String, required: true, unique: true },
    displayName: { type: String, default: 'Anon' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    graph: { type: socialGraphSchema, default: () => ({}) },
    nonce: { type: String, default: () => crypto.randomUUID() }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
