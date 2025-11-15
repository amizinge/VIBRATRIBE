import Sidebar from '@/components/layout/Sidebar';
import RightRail from '@/components/layout/RightRail';
import Composer from '@/components/feed/Composer';
import PostList from '@/components/feed/PostList';
import { mockActivity, mockPosts, mockSpaces } from '@/lib/mocks';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="layout-grid">
        <Sidebar />
        <div className="space-y-4">
          <Composer />
          <PostList posts={mockPosts} />
        </div>
        <RightRail spaces={mockSpaces} events={mockActivity} />
      </div>
    </main>
  );
}
