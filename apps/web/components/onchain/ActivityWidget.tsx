import type { ActivityEvent } from '@/types';

export default function ActivityWidget({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-4 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">On-chain activity</p>
        <p className="text-sm text-gray-300">Live contract and tipping events</p>
      </div>
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="p-3 rounded-xl bg-black/30 border border-white/5">
            <p className="text-sm font-medium text-white">{event.title}</p>
            <div className="text-xs text-gray-400 flex items-center justify-between mt-1">
              <span>
                {event.txHash}
              </span>
              <span className="text-[10px] uppercase">{event.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
