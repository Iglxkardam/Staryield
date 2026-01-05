# Wagmi Wallet Integration Guide

## ✅ Implementation Complete

Your StarYield app now has **wagmi v2** wallet integration with support for:

- 🟡 **BNB Smart Chain Testnet**
- 🔵 **Base Sepolia Testnet**

## 🎯 What's Been Implemented

### 1. **Wagmi Configuration** (`src/config/wagmi.ts`)

```typescript
- Configured BSC Testnet (Chain ID: 97)
- Configured Base Sepolia (Chain ID: 84532)
- MetaMask connector (injected)
- WalletConnect v2 support
- Custom RPC endpoints
```

### 2. **Wallet Provider** (`src/providers/WagmiProvider.tsx`)

```typescript
- WagmiProvider wrapper
- QueryClientProvider for React Query
- RainbowKit integration with dark theme
- Custom accent color (#00ff88)
```

### 3. **Updated useWallet Hook** (`src/hooks/useWallet.ts`)

```typescript
✅ Real wallet connection via wagmi
✅ Balance fetching with useBalance
✅ Network switching (BNB ↔ Base)
✅ Auto-update token based on chain
✅ All functions now use actual blockchain data
```

### 4. **Updated Header Component** (`src/components/Header.tsx`)

```typescript
✅ RainbowKit ConnectButton integrated
✅ Network switcher (BNB Testnet / Base Sepolia)
✅ Shows current chain with active state
✅ One-click network switching
```

### 5. **Custom Styles** (`src/styles/wallet.css`)

```css
✅ Styled ConnectButton to match design
✅ Network switcher button styles
✅ Custom RainbowKit modal theme
```

## 🚀 How to Use

### Step 1: Get WalletConnect Project ID

1. Go to: https://cloud.walletconnect.com/
2. Create a free account
3. Create a new project
4. Copy your Project ID

### Step 2: Update Environment Variables

Edit `.env` file:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

### Step 3: Test the Integration

#### Start Development Server

```bash
npm run dev
```

#### Open Browser

Navigate to: http://localhost:5173

#### Test Wallet Connection

1. Click "Connect Wallet" button in header
2. Select MetaMask (or other wallet)
3. Approve connection
4. You should see your wallet address

#### Test Network Switching (on admin pages)

1. Go to `/dashboard`
2. Click "BNB Testnet" or "Base Sepolia" buttons
3. MetaMask will prompt to switch networks
4. Approve the network switch

## 🔧 Available Wallet Functions

### Connect Wallet

```typescript
import { useWallet } from "@/hooks/useWallet";

const { connectWallet, isConnected, address } = useWallet();

// Connect
await connectWallet();

// Check status
if (isConnected) {
  console.log("Connected:", address);
}
```

### Get Balance

```typescript
const { wallet } = useWallet();

// Balance is automatically updated
console.log("Balance:", wallet.balance);
```

### Switch Network

```typescript
const { switchToBscTestnet, switchToBaseSepolia, chainId } = useWallet();

// Switch to BSC Testnet
await switchToBscTestnet();

// Switch to Base Sepolia
await switchToBaseSepolia();

// Check current network
console.log("Current Chain ID:", chainId);
```

### Disconnect Wallet

```typescript
const { disconnectWallet } = useWallet();

await disconnectWallet();
```

## 📱 Supported Wallets

### MetaMask (Recommended)

- Browser extension
- Mobile app
- Most popular wallet

### WalletConnect

- Mobile wallets
- Trust Wallet, Rainbow, etc.
- QR code connection

## 🌐 Supported Networks

### BSC Testnet

```
Chain ID: 97
RPC: https://data-seed-prebsc-1-s1.binance.org:8545
Explorer: https://testnet.bscscan.com
Faucet: https://testnet.binance.org/faucet-smart
```

### Base Sepolia

```
Chain ID: 84532
RPC: https://sepolia.base.org
Explorer: https://sepolia.basescan.org
Faucet: https://www.alchemy.com/faucets/base-sepolia
```

## 🎨 UI Components

### Header with Wallet

The Header component now includes:

- **ConnectButton**: Shows address when connected
- **Network Switcher**: Toggle between BNB/Base (admin pages only)
- **Chain Icon**: Visual indicator of current network

### Admin Pages

On `/dashboard`, `/referral`, `/transactions`:

- Network switcher visible
- Active network highlighted
- One-click switching

### Public Pages

On `/` (home):

- Only connect button visible
- "Enter App" button to navigate

## 🔐 Security Features

### Automatic Disconnect

- User can disconnect anytime via RainbowKit modal
- Wallet state resets on disconnect

### Network Validation

- Smart contracts will only work on correct networks
- UI shows current network clearly

### Balance Updates

- Real-time balance updates
- Automatic refresh on transactions

## 📝 Next Steps for Smart Contract Integration

### 1. Add Contract ABIs

Create `src/contracts/` folder:

```typescript
// src/contracts/StakingABI.json
export default [
  // Your staking contract ABI
];
```

### 2. Update Contract Addresses

Edit `.env`:

```env
# BSC Testnet
VITE_BSC_STAKING_CONTRACT=0xYourContractAddress
VITE_BSC_REFERRAL_CONTRACT=0xYourContractAddress
VITE_BSC_TOKEN_CONTRACT=0xYourContractAddress

# Base Sepolia
VITE_BASE_STAKING_CONTRACT=0xYourContractAddress
VITE_BASE_REFERRAL_CONTRACT=0xYourContractAddress
VITE_BASE_TOKEN_CONTRACT=0xYourContractAddress
```

### 3. Use in Page Hooks

Example for `Dashboard/hooks/useStakeToken.ts`:

```typescript
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import StakingABI from "@/contracts/StakingABI.json";

export const useStakeToken = () => {
  const { address } = useAccount();
  const { writeContract, data: hash } = useWriteContract();

  const stake = async (amount: string, tierId: number) => {
    const contractAddress = import.meta.env.VITE_BSC_STAKING_CONTRACT;

    await writeContract({
      address: contractAddress,
      abi: StakingABI,
      functionName: "stake",
      args: [tierId, parseEther(amount)],
    });
  };

  return { stake };
};
```

### 4. Read Contract Data

Example for `Home/hooks/useHomeStats.ts`:

```typescript
import { useReadContract } from "wagmi";
import StakingABI from "@/contracts/StakingABI.json";

export const useHomeStats = () => {
  const { data: tvl } = useReadContract({
    address: import.meta.env.VITE_BSC_STAKING_CONTRACT,
    abi: StakingABI,
    functionName: "getTotalValueLocked",
  });

  return { totalValueLocked: tvl };
};
```

## 🐛 Troubleshooting

### MetaMask Not Connecting

1. Make sure MetaMask is installed
2. Try refreshing the page
3. Check if wallet is locked
4. Clear browser cache

### Wrong Network

1. Click network switcher in header
2. Approve network switch in MetaMask
3. If network not in MetaMask, it will be added automatically

### Balance Not Showing

1. Make sure you have testnet tokens
2. Get testnet BNB from faucet
3. Wait for balance to update (few seconds)

### Transaction Fails

1. Check you're on correct network
2. Make sure you have enough gas
3. Verify contract address is correct
4. Check contract is deployed on that network

## 📚 Resources

- **Wagmi Docs**: https://wagmi.sh/
- **RainbowKit Docs**: https://www.rainbowkit.com/
- **Viem Docs**: https://viem.sh/
- **BSC Testnet**: https://testnet.bscscan.com/
- **Base Sepolia**: https://sepolia.basescan.org/

## ✨ Features Summary

✅ Multi-chain support (BSC Testnet + Base Sepolia)
✅ MetaMask integration
✅ WalletConnect support
✅ Real-time balance updates
✅ Network switching
✅ TypeScript type safety
✅ Custom branded UI
✅ Responsive design
✅ Ready for smart contract integration

Your wallet integration is complete and ready to use! 🎉
