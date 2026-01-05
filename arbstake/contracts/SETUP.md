# Quick Setup Guide

## Prerequisites

- Node.js v18+ installed
- MetaMask or similar wallet
- Test BNB from BSC Testnet faucet
- Test ETH from Base Sepolia faucet

## Step 1: Install Dependencies

```bash
cd contracts
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add:

- Your wallet private key (for deployment)
- RPC URLs (defaults provided)
- API keys for contract verification (optional)

## Step 3: Compile Contract

```bash
npm run compile
```

## Step 4: Run Tests

```bash
npm test
```

## Step 5: Deploy to Testnet

### BSC Testnet

```bash
npm run deploy:bsc-testnet
```

### Base Sepolia

```bash
npm run deploy:base-sepolia
```

## Step 6: Verify Contract (Optional)

```bash
# BSC Testnet
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS>

# Base Sepolia
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

## Step 7: Setup Admins

After deployment, you need to add 2 more admins (contract deployer is already admin 1):

```javascript
// Using ethers.js
const staking = new ethers.Contract(contractAddress, ABI, signer);

// Add admin 2
await staking.addAdmin("0xAdmin2Address");

// Add admin 3
await staking.addAdmin("0xAdmin3Address");
```

## Step 8: Fund Contract with Reward Pool

Send BNB/ETH to the contract address to create a reward pool:

```bash
# BSC Testnet
# Send BNB to contract address for reward distribution

# Base Sepolia
# Send ETH to contract address for reward distribution
```

## Getting Test Tokens

### BSC Testnet BNB

- https://testnet.bnbchain.org/faucet-smart

### Base Sepolia ETH

- https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- https://learnweb3.io/faucets/base_sepolia

## Contract Addresses (After Deployment)

Update these in your frontend:

```javascript
// src/config/contracts.ts
export const STAKING_CONTRACT = {
  bscTestnet: "YOUR_BSC_TESTNET_ADDRESS",
  baseSepolia: "YOUR_BASE_SEPOLIA_ADDRESS",
};
```

## Security Checklist

- [ ] Contract deployed successfully
- [ ] 3 admin addresses configured
- [ ] Test small stake first
- [ ] Verify tier configurations
- [ ] Test withdrawal approval process
- [ ] Ensure reward pool is funded
- [ ] Run full test suite
- [ ] Consider professional audit before mainnet

## Common Issues

### "Insufficient funds"

- Make sure you have enough test BNB/ETH for gas fees
- Get more from faucets listed above

### "Nonce too high"

- Reset your MetaMask account in Advanced Settings

### "Transaction reverted"

- Check if you're on the correct network
- Ensure you have enough balance
- Verify minimum investment requirements

## Next Steps

1. Integrate contract with frontend
2. Create ABI file for frontend
3. Test all functions thoroughly
4. Set up monitoring and alerts
5. Plan for mainnet deployment
