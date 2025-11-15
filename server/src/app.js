import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { config } from './config.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import socialRouter from './routes/social.js';
import dmRouter from './routes/dm.js';
import moderationRouter from './routes/moderation.js';
import analyticsRouter from './routes/analytics.js';
import mediaRouter from './routes/media.js';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', network: 'BSC', timestamp: Date.now() });
});

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/social', socialRouter);
app.use('/api/dm', dmRouter);
app.use('/api/moderation', moderationRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/media', mediaRouter);

mongoose.connect(config.mongoUri).then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
        console.log(`PulseChain API listening on ${config.port}`);
    });
}).catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
});
