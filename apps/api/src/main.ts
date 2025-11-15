import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import router from './routes';
import { authenticate } from './middleware/auth';
import { config } from './config/env';

const app = express();

app.use(cors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(authenticate);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', router);

app.listen(config.port, () => {
  console.log(`API listening on port ${config.port}`);
});
