import { Router } from 'express';

const router = Router();

router.get('/', async (_req, res) => {
  res.json([
    { id: 'evt-1', type: 'tip', title: 'Tip 120 USDC → @ogban', txHash: '0xabc...1234', status: 'confirmed', timestamp: new Date().toISOString() },
    { id: 'evt-2', type: 'post', title: '@builder posted about the drop', txHash: '0xdef...4567', status: 'pending', timestamp: new Date().toISOString() }
  ]);
});

export default router;
