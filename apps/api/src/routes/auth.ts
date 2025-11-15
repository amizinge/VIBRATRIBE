import { Router } from 'express';
import { randomUUID } from 'crypto';
import { SiweMessage } from 'siwe';
import { z } from 'zod';
import { isAddress } from 'viem';
import { prisma } from '../config/prisma';
import { config } from '../config/env';
import { signJwt } from '../utils/jwt';
import { Role } from '@prisma/client';

const router = Router();

const challengeSchema = z.object({
  address: z.string().refine(isAddress, 'Invalid EVM address')
});

router.post('/challenge', async (req, res) => {
  const parseResult = challengeSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.message });
  }

  const { address } = parseResult.data;
  const nonce = randomUUID();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.authNonce.create({
    data: {
      address: address.toLowerCase(),
      nonce,
      expiresAt
    }
  });

  res.json({
    nonce,
    statement: config.siwe.statement,
    domain: config.siwe.domain,
    uri: config.siwe.uri
  });
});

const verifySchema = z.object({
  message: z.string(),
  signature: z.string()
});

router.post('/verify', async (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  const { message, signature } = parsed.data;

  try {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature, domain: config.siwe.domain, nonce: siweMessage.nonce });

    if (!fields.success) {
      return res.status(401).json({ error: 'Invalid SIWE signature' });
    }

    const nonceRecord = await prisma.authNonce.findUnique({ where: { nonce: siweMessage.nonce } });
    if (!nonceRecord || nonceRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Nonce expired' });
    }

    const wallet = siweMessage.address.toLowerCase();

    const user = await prisma.user.upsert({
      where: { walletAddress: wallet },
      update: { updatedAt: new Date() },
      create: {
        walletAddress: wallet
      },
      include: {
        profile: true
      }
    });

    if (!user.profile) {
      const defaultHandle = `@${wallet.slice(2, 8)}`;
      await prisma.profile.create({
        data: {
          handle: defaultHandle,
          displayName: wallet.slice(0, 10),
          userId: user.id
        }
      });
    }

    await prisma.authNonce.delete({ where: { nonce: siweMessage.nonce } });

    const token = signJwt({ sub: user.id, role: user.role });
    res
      .cookie('vt_jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: config.sessionTtlHours * 60 * 60 * 1000
      })
      .json({ token, user: await prisma.user.findUnique({ where: { id: user.id }, include: { profile: true } }) });
  } catch (err) {
    console.error('SIWE verify failed', err);
    res.status(500).json({ error: 'Unable to verify signature' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('vt_jwt').status(204).send();
});

export default router;
