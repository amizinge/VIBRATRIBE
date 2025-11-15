import type { Post } from '@/types';
import PostCard from '@/components/feed/PostCard';

export default function PostList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return (
      <div className="text-sm text-gray-400 text-center py-10 bg-surface border border-white/5 rounded-2xl">
        Nothing on your feed yet. Follow creators or explore trending tags.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
