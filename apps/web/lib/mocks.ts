import type { ActivityEvent, Post, Space } from '@/types';

export const mockPosts: Post[] = [
  {
    id: '1',
    body: 'GM VIBRATRIBE fam. Shipping the wallet graph today.',
    author: {
      handle: '@builder',
      displayName: 'Protocol Builder',
      avatar: '/avatars/builder.png'
    },
    createdAt: new Date().toISOString(),
    media: null,
    tags: ['shipping', 'devlog'],
    stats: { likes: 128, comments: 14, reposts: 8, tipsCount: 23 }
  },
  {
    id: '2',
    body: 'Hosting a token-gated Space at 5pm UTC. BYO alpha.',
    author: {
      handle: '@ogban',
      displayName: 'Ogban',
      avatar: '/avatars/ogban.png'
    },
    createdAt: new Date().toISOString(),
    media: null,
    tags: ['spaces'],
    stats: { likes: 77, comments: 9, reposts: 4, tipsCount: 5 }
  }
];

export const mockSpaces: Space[] = [
  {
    id: 'space-1',
    title: 'Pulse of Builders',
    hostHandle: '@protocol',
    description: 'Deep dive into L2 infra and vibez.',
    startTime: new Date().toISOString(),
    status: 'live',
    gatingRule: {
      type: 'erc20',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      minBalance: '100'
    }
  },
  {
    id: 'space-2',
    title: 'Creators AMA',
    hostHandle: '@vibes',
    description: 'Discuss tokenized fandom tooling.',
    startTime: new Date(Date.now() + 3600 * 1000).toISOString(),
    status: 'scheduled',
    gatingRule: {
      type: 'erc721',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      minBalance: '1'
    }
  }
];

export const mockActivity: ActivityEvent[] = [
  {
    id: 'evt-1',
    type: 'tip',
    title: 'Tip: 250 USDC → @builder',
    txHash: '0x1234...abcd',
    status: 'confirmed',
    timestamp: new Date().toISOString()
  },
  {
    id: 'evt-2',
    type: 'post',
    title: '@ogban minted a governance proposal',
    txHash: '0x9876...1122',
    status: 'pending',
    timestamp: new Date().toISOString()
  }
];
