import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { requireAuth, AuthedRequest } from '../middleware/auth';

const router = Router();

router.get('/feed', requireAuth(), async (req: AuthedRequest, res) => {
  const following = await prisma.follow.findMany({
    where: { followerId: req.user!.id },
    select: { followingId: true }
  });
  const ids = following.map(f => f.followingId).concat(req.user!.id);
  const posts = await prisma.post.findMany({
    where: { authorId: { in: ids } },
    include: { author: { include: { profile: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(posts);
});

router.get('/explore', async (_req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: { include: { profile: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(posts);
});

const postSchema = z.object({
  body: z.string().min(1).max(500),
  tags: z.array(z.string()).default([]),
  mediaUrl: z.string().url().nullable().optional()
});

router.post('/', requireAuth(), async (req: AuthedRequest, res) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const post = await prisma.post.create({
    data: {
      body: parsed.data.body,
      authorId: req.user!.id,
      tags: parsed.data.tags,
      mediaUrl: parsed.data.mediaUrl ?? null
    }
  });
  res.status(201).json(post);
});

router.get('/:id', async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
    include: {
      author: { include: { profile: true } },
      comments: { include: { author: { include: { profile: true } } } }
    }
  });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

export default router;
