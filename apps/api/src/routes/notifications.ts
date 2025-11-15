import { Router } from 'express';
import { prisma } from '../config/prisma';
import { AuthedRequest, requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth(), async (req: AuthedRequest, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(notifications);
});

export default router;
