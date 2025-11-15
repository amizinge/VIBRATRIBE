import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { http, createConfig } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import { bsc } from 'wagmi/chains';

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? bsc.id);
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL ?? bsc.rpcUrls.public.http[0];

const dynamicChain: Chain = {
  ...bsc,
  id: chainId,
  rpcUrls: {
    public: { http: [rpcUrl] },
    default: { http: [rpcUrl] }
  }
};

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo';

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains: [dynamicChain] }),
      metaMaskWallet({ projectId, chains: [dynamicChain] }),
      walletConnectWallet({ projectId, chains: [dynamicChain] }),
      coinbaseWallet({ appName: 'VIBRATRIBE', chains: [dynamicChain] })
    ]
  }
]);

export const wagmiConfig = createConfig({
  chains: [dynamicChain],
  connectors,
  transports: {
    [dynamicChain.id]: http(rpcUrl)
  }
});

export const supportedChains = [dynamicChain];
