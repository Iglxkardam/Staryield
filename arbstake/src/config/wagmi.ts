import { http, createConfig } from 'wagmi'
import { bscTestnet, baseSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// WalletConnect Project ID (get from https://cloud.walletconnect.com/)
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'eb3e15083e541eb5e2a6181c8154421b'

console.log('🔧 Wagmi Config - Project ID:', projectId ? '✅ Set' : '❌ Missing');

export const config = createConfig({
  chains: [bscTestnet, baseSepolia],
  connectors: [
    injected({ 
      shimDisconnect: true 
    }),
    walletConnect({ 
      projectId,
      showQrModal: true 
    }),
  ],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})

console.log('✅ Wagmi config initialized');

// Chain metadata for display
export const chainMetadata = {
  [bscTestnet.id]: {
    name: 'BNB Testnet',
    icon: '🟡',
    explorer: 'https://testnet.bscscan.com',
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia',
    icon: '🔵',
    explorer: 'https://sepolia.basescan.org',
  },
}

// Export chains for easy access
export { bscTestnet, baseSepolia }
