# Reward Pool Deployment Guide

## Overview

The new architecture separates user funds and reward liquidity:

- **StarYieldStaking**: Tracks stakes, calculates rewards, manages tiers
- **RewardPool**: Holds your liquidity, pays out claims and withdrawals

## Flow

1. **User stakes** → Funds go directly to RewardPool
2. **You deposit liquidity** → RewardPool (your capital for payouts)
3. **User claims rewards** → RewardPool pays from your liquidity
4. **User withdraws** → RewardPool pays principal + rewards

## Deployment Steps

### Step 1: Deploy RewardPool

```bash
# BSC Testnet
npx hardhat run scripts/deployRewardPool.js --network bscTestnet

# Base Sepolia
npx hardhat run scripts/deployRewardPool.js --network baseSepolia
```

**Save the RewardPool address!**

### Step 2: Deploy StarYieldStaking with RewardPool

```bash
# BSC Testnet
REWARD_POOL_ADDRESS=0x... npx hardhat run scripts/deployStakingWithPool.js --network bscTestnet

# Base Sepolia
REWARD_POOL_ADDRESS=0x... npx hardhat run scripts/deployStakingWithPool.js --network baseSepolia
```

### Step 3: Authorize StarYieldStaking in RewardPool

```bash
# BSC Testnet
REWARD_POOL_ADDRESS=0x... STAKING_ADDRESS=0x... npx hardhat run scripts/authorizeStaking.js --network bscTestnet

# Base Sepolia
REWARD_POOL_ADDRESS=0x... STAKING_ADDRESS=0x... npx hardhat run scripts/authorizeStaking.js --network baseSepolia
```

### Step 4: Fund the RewardPool

You need to deposit liquidity into the reward pool to pay user claims/withdrawals.

**Via Console:**

```javascript
const rewardPool = await ethers.getContractAt("RewardPool", "0x...");

// Deposit BNB/ETH
await rewardPool.depositBNB({ value: ethers.parseEther("10") });

// Deposit ERC20 tokens (approve first)
const token = await ethers.getContractAt("IERC20", "0x...");
await token.approve(rewardPoolAddress, ethers.parseEther("1000"));
await rewardPool.depositToken(tokenAddress, ethers.parseEther("1000"));
```

**Or send directly:**

```bash
# Send BNB/ETH directly to reward pool address
# It has a receive() function that accepts direct transfers
```

## RewardPool Functions

### Admin Functions

- `depositBNB()` - Add BNB/ETH liquidity
- `depositToken(address, amount)` - Add ERC20 liquidity
- `addStakingContract(address)` - Authorize a staking contract
- `removeStakingContract(address)` - Revoke authorization
- `emergencyWithdrawBNB(recipient, amount)` - Emergency withdraw
- `emergencyWithdrawToken(token, recipient, amount)` - Emergency withdraw

### View Functions

- `getBalance(token)` - Check pool balance for a token
- `totalPayouts(token)` - Total paid out for a token
- `getUserPayouts(user, token)` - Total user received

## Important Notes

### Security

✅ **User funds are safe**: Staked amounts immediately go to your reward pool
✅ **Only authorized contracts**: Only StarYieldStaking can request payouts
✅ **Accurate tracking**: Reward calculations match exactly what pool pays
✅ **Emergency controls**: Admin can withdraw in emergencies

### Liquidity Management

You need to maintain sufficient liquidity in the reward pool to cover:

- **Staked principal**: All user stakes (automatically transferred on stake)
- **Rewards payout**: Calculated rewards based on APY and time
- **Buffer**: Extra liquidity for high-volume periods

### Example Liquidity Calculation

If you expect:

- 100 BNB total staked
- 55,000% APY on COMET tier
- Average 7 days before withdrawal

**Required liquidity:**

- Principal: 100 BNB (user deposits)
- Rewards (7 days at 55,000%): ~105 BNB
- **Total needed: ~205 BNB**

### Monitoring

Check pool balances regularly:

```javascript
const bnbBalance = await rewardPool.getBalance(ethers.ZeroAddress);
const totalPaidOut = await rewardPool.totalPayouts(ethers.ZeroAddress);
console.log("BNB Balance:", ethers.formatEther(bnbBalance));
console.log("Total Paid:", ethers.formatEther(totalPaidOut));
```

## Contract Addresses (To be filled after deployment)

### BSC Testnet

- RewardPool: `0x...`
- StarYieldStaking: `0x...`

### Base Sepolia

- RewardPool: `0x...`
- StarYieldStaking: `0x...`

## Frontend Integration

Update `src/config/contracts.ts` with new addresses:

```typescript
export const REWARD_POOL_ADDRESS = {
  97: "0x...", // BSC Testnet
  84532: "0x...", // Base Sepolia
} as const;

export const STAKING_CONTRACT_ADDRESS = {
  97: "0x...", // BSC Testnet
  84532: "0x...", // Base Sepolia
} as const;
```

## Testing Checklist

- [ ] Deploy RewardPool
- [ ] Deploy StarYieldStaking with RewardPool address
- [ ] Authorize StarYieldStaking in RewardPool
- [ ] Fund RewardPool with test liquidity
- [ ] Test stake (verify funds go to pool)
- [ ] Test claim rewards (verify pool pays out)
- [ ] Test withdraw (verify pool pays principal + rewards)
- [ ] Test emergency withdraw (verify pool pays principal only)
- [ ] Verify pool balance tracking
- [ ] Update frontend contract addresses
