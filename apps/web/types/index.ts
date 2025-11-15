export type ProfileSummary = {
  handle: string;
  displayName: string;
  avatar: string | null;
};

export type PostStats = {
  likes: number;
  comments: number;
  reposts: number;
  tipsCount: number;
};

export type Post = {
  id: string;
  body: string;
  author: ProfileSummary;
  media: string | null;
  tags: string[];
  stats: PostStats;
  createdAt: string;
};

export type Space = {
  id: string;
  title: string;
  hostHandle: string;
  description: string;
  startTime: string;
  status: 'live' | 'scheduled' | 'ended';
  gatingRule: {
    type: 'erc20' | 'erc721';
    tokenAddress: string;
    minBalance: string;
  };
};

export type ActivityEvent = {
  id: string;
  type: 'tip' | 'post' | 'governance';
  title: string;
  txHash: string;
  status: 'pending' | 'confirmed';
  timestamp: string;
};
