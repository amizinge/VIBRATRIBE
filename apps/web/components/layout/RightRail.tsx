import ActivityWidget from '@/components/onchain/ActivityWidget';
import SpacesRail from '@/components/spaces/SpacesRail';
import type { ActivityEvent, Space } from '@/types';

const trendingTopics = ['modular', 'restaking', 'community drops', 'dao ops'];

export default function RightRail({
  spaces,
  events
}: {
  spaces: Space[];
  events: ActivityEvent[];
}) {
  return (
    <aside className="space-y-4">
      <div className="bg-surface border border-white/5 rounded-2xl p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Trending</p>
        <div className="mt-3 space-y-2 text-sm text-gray-300">
          {trendingTopics.map(topic => (
            <span key={topic} className="block px-3 py-2 rounded-xl bg-black/30 border border-white/5">
              #{topic}
            </span>
          ))}
        </div>
      </div>
      <SpacesRail spaces={spaces} />
      <ActivityWidget events={events} />
    </aside>
  );
}
