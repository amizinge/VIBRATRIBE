import type { Space } from '@/types';

export default function SpacesRail({ spaces }: { spaces: Space[] }) {
  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-4 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Spaces</p>
        <p className="text-sm text-gray-300">Token-gated rooms curated for you</p>
      </div>
      <div className="space-y-3">
        {spaces.map(space => (
          <div key={space.id} className="p-3 rounded-xl bg-black/30 border border-white/5">
            <p className="text-sm font-semibold text-white">{space.title}</p>
            <p className="text-xs text-gray-400">Hosted by {space.hostHandle}</p>
            <p className="text-xs text-gray-500 mt-1">{space.description}</p>
            <div className="text-[10px] uppercase text-gray-500 mt-2">
              {space.status} • {space.gatingRule.type} gate
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
