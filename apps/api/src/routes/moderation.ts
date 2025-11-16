import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthedRequest, requireAuth } from '../middleware/auth';
import { STAFF_ROLES } from '../types/roles';

const router = Router();

const reasonSchema = z.object({ reason: z.string().min(3) });

router.post('/report/:postId', requireAuth(), async (req: AuthedRequest, res) => {
  const parsed = reasonSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  await prisma.report.create({
    data: {
      postId: req.params.postId,
      reporterId: req.user!.id,
      reason: parsed.data.reason
    }
  });

  res.status(201).send();
});

router.get('/queue', requireAuth(STAFF_ROLES), async (_req, res) => {
  const queue = await prisma.report.findMany({
    where: { status: 'pending' }
  });
  res.json(queue);
});

router.post('/resolve/:reportId', requireAuth(STAFF_ROLES), async (req, res) => {
  const parsed = z
    .object({ status: z.enum(['approved', 'removed']) })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const report = await prisma.report.update({ where: { id: req.params.reportId }, data: { status: parsed.data.status } });
  res.json(report);
});

export default router;
