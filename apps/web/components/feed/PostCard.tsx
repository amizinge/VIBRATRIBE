import type { Post } from '@/types';
import { MessageCircle, Repeat2, Heart, Coins } from 'lucide-react';
import dayjs from 'dayjs';

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-surface border border-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-accent/30" />
        <div>
          <p className="text-sm font-semibold">{post.author.displayName}</p>
          <p className="text-xs text-gray-400">
            {post.author.handle} • {dayjs(post.createdAt).fromNow()}
          </p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-gray-100">{post.body}</p>
      {post.media ? (
        <div className="rounded-xl overflow-hidden border border-white/5">
          <img src={post.media} alt="media" className="w-full object-cover max-h-96" />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        {post.tags.map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full bg-white/5">
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <button className="flex items-center gap-2 hover:text-white">
          <Heart className="w-4 h-4" /> {post.stats.likes}
        </button>
        <button className="flex items-center gap-2 hover:text-white">
          <MessageCircle className="w-4 h-4" /> {post.stats.comments}
        </button>
        <button className="flex items-center gap-2 hover:text-white">
          <Repeat2 className="w-4 h-4" /> {post.stats.reposts}
        </button>
        <button className="flex items-center gap-2 hover:text-accent">
          <Coins className="w-4 h-4" /> {post.stats.tipsCount}
        </button>
      </div>
    </article>
  );
}
