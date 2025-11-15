'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletStatus() {
  return (
    <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
      <p className="text-sm text-gray-400 mb-2">Wallet login</p>
      <ConnectButton showBalance={false} accountStatus="address" label="Connect Wallet" chainStatus="icon" />
    </div>
  );
}
