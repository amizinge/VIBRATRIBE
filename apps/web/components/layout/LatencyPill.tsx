'use client';

import { useEffect, useState } from 'react';

export default function LatencyPill() {
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const ping = async () => {
      const start = performance.now();
      try {
        await fetch('/api/ping', { cache: 'no-store' });
        const duration = performance.now() - start;
        setLatency(Math.round(duration));
      } catch (err) {
        console.warn('ping failed', err);
        setLatency(null);
      }
    };
    ping();
    interval = setInterval(ping, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between text-xs bg-black/30 border border-white/10 rounded-full px-3 py-1">
      <span className="uppercase tracking-[0.3em] text-gray-500">Latency</span>
      <span className="font-semibold text-white">{latency ? `${latency}ms` : 'syncing'}</span>
    </div>
  );
}
