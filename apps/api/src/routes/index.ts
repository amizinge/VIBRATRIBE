import { Router } from 'express';
import authRouter from './auth';
import profileRouter from './profile';
import postsRouter from './posts';
import socialRouter from './social';
import moderationRouter from './moderation';
import notificationsRouter from './notifications';
import activityRouter from './activity';

const router = Router();

router.use('/auth', authRouter);
router.use('/', profileRouter);
router.use('/posts', postsRouter);
router.use('/social', socialRouter);
router.use('/moderation', moderationRouter);
router.use('/notifications', notificationsRouter);
router.use('/chain/activity', activityRouter);

export default router;
