'use client';

import Link from 'next/link';
import { Home, Compass, MessageCircle, Mic2, Bell, Shield, Settings } from 'lucide-react';
import WalletStatus from '@/components/layout/WalletStatus';
import LatencyPill from '@/components/layout/LatencyPill';

const nav = [
  { name: 'Feed', href: '/', icon: Home },
  { name: 'Explore', href: '/explore', icon: Compass },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Spaces', href: '/spaces', icon: Mic2 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Moderation', href: '/moderation', icon: Shield },
  { name: 'Console', href: '/console', icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="bg-surface/80 border border-white/5 rounded-2xl p-4 flex flex-col gap-6 h-fit sticky top-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Vibratribe</p>
        <h1 className="text-xl font-semibold mt-1">The wallet-native social graph</h1>
      </div>
      <WalletStatus />
      <nav className="flex flex-col gap-1">
        {nav.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition"
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>
      <LatencyPill />
    </aside>
  );
}
