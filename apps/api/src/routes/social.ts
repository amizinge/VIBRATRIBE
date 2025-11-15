import { Router } from 'express';
import { prisma } from '../config/prisma';
import { AuthedRequest, requireAuth } from '../middleware/auth';

const router = Router();

router.post('/follow/:handle', requireAuth(), async (req: AuthedRequest, res) => {
  const profile = await prisma.profile.findUnique({ where: { handle: req.params.handle } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  if (profile.userId === req.user!.id) return res.status(400).json({ error: 'Cannot follow yourself' });

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: req.user!.id, followingId: profile.userId } },
    update: {},
    create: { followerId: req.user!.id, followingId: profile.userId }
  });

  res.status(204).send();
});

router.post('/unfollow/:handle', requireAuth(), async (req: AuthedRequest, res) => {
  const profile = await prisma.profile.findUnique({ where: { handle: req.params.handle } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  await prisma.follow.deleteMany({ where: { followerId: req.user!.id, followingId: profile.userId } });
  res.status(204).send();
});

router.get('/followers/:handle', async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { handle: req.params.handle } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const followers = await prisma.follow.findMany({
    where: { followingId: profile.userId },
    include: { follower: { include: { profile: true } } }
  });
  res.json(followers);
});

router.get('/following/:handle', async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { handle: req.params.handle } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const following = await prisma.follow.findMany({
    where: { followerId: profile.userId },
    include: { following: { include: { profile: true } } }
  });
  res.json(following);
});

export default router;
