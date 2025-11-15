import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { requireAuth, AuthedRequest } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth(), async (req: AuthedRequest, res) => {
  const me = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { profile: true } });
  res.json(me);
});

const profileSchema = z.object({
  handle: z.string().min(2).optional(),
  displayName: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(280).optional()
});

router.put('/me', requireAuth(), async (req: AuthedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { profile: true } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const payload = { ...parsed.data };
  if (payload.handle && !payload.handle.startsWith('@')) {
    payload.handle = `@${payload.handle}`;
  }

  const profile = user.profile
    ? await prisma.profile.update({ where: { id: user.profile.id }, data: payload })
    : await prisma.profile.create({
        data: {
          ...payload,
          handle: payload.handle ?? `@${user.walletAddress.slice(2, 8)}`,
          userId: user.id,
          displayName: payload.displayName ?? user.walletAddress.slice(0, 10)
        }
      });

  res.json({ ...user, profile });
});

router.get('/profiles/:handle', async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { handle: req.params.handle } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const posts = await prisma.post.count({ where: { author: { profile: { is: { handle: req.params.handle } } } } });
  res.json({ profile, posts });
});

export default router;
