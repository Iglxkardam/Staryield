# StarYield Staking Smart Contract

## Overview

Secure multi-tier staking contract supporting BNB and ERC20 tokens with three staking tiers.

## Features

- ✅ Three staking tiers (Comet, Meteor, Supernova)
- ✅ Support for BNB and any ERC20 token
- ✅ Multi-signature admin control (requires 3 approvals)
- ✅ ReentrancyGuard protection
- ✅ Pausable for emergency situations
- ✅ Separate tracking for each token
- ✅ Automatic reward calculations based on APY
- ✅ Emergency withdrawal option

## Tier Structure

### COMET Tier

- **Locking Period**: 14 days
- **Min Investment**: 0.1 BNB/ETH
- **APY**: 6%
- **Daily Rate**: ~0.016%

### METEOR Tier

- **Locking Period**: 21 days
- **Min Investment**: 1 BNB/ETH
- **APY**: 11%
- **Daily Rate**: ~0.030%

### SUPERNOVA Tier

- **Locking Period**: 30 days
- **Min Investment**: 5 BNB/ETH
- **APY**: 14%
- **Daily Rate**: ~0.038%

## Security Features

1. **ReentrancyGuard**: Prevents reentrancy attacks on all withdrawal functions
2. **AccessControl**: Role-based permissions (Owner, Admin)
3. **SafeERC20**: Safe token transfers using OpenZeppelin's SafeERC20
4. **Pausable**: Emergency stop mechanism
5. **Multi-sig**: 3 admin approvals required for fund movement
6. **Input Validation**: Comprehensive checks on all user inputs

## Installation

```bash
cd contracts
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Fill in your details in `.env`:

```
PRIVATE_KEY=your_wallet_private_key
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545
BASE_SEPOLIA_RPC=https://sepolia.base.org
BSCSCAN_API_KEY=your_bscscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
```

## Compilation

```bash
npm run compile
```

## Testing

```bash
npm run test
```

## Deployment

### BSC Testnet

```bash
npm run deploy:bsc-testnet
```

### Base Sepolia

```bash
npm run deploy:base-sepolia
```

## Contract Verification

After deployment, verify the contract:

### BSC Testnet

```bash
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS>
```

### Base Sepolia

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

## User Functions

### Staking BNB

```solidity
function stakeBNB(Tier _tier) external payable
```

Stake BNB in specified tier (0=COMET, 1=METEOR, 2=SUPERNOVA)

### Staking ERC20 Tokens

```solidity
function stakeToken(address _token, uint256 _amount, Tier _tier) external
```

**Note**: User must approve token spending before calling this function

### Claim Rewards

```solidity
function claimRewards(uint256 _stakeId) external
```

Claim accumulated rewards without withdrawing principal

### Withdraw Stake

```solidity
function withdraw(uint256 _stakeId) external
```

Withdraw principal + rewards after locking period ends

### Emergency Withdraw

```solidity
function emergencyWithdraw(uint256 _stakeId) external
```

Withdraw principal immediately (forfeits all rewards)

### View Functions

```solidity
function getUserStakes(address _user) external view returns (Stake[] memory)
function calculateRewards(address _user, uint256 _stakeId) public view returns (uint256)
function canWithdraw(address _user, uint256 _stakeId) external view returns (bool)
```

## Admin Functions

### Add Admin

```solidity
function addAdmin(address _admin) external
```

Add new admin (requires OWNER_ROLE)

### Request Withdrawal

```solidity
function requestWithdrawal(address _token, address _to, uint256 _amount) external
```

Create withdrawal request (requires ADMIN_ROLE)

### Approve Withdrawal

```solidity
function approveWithdrawal(uint256 _requestId) external
```

Approve pending withdrawal (requires ADMIN_ROLE, auto-executes at 3 approvals)

### Pause/Unpause

```solidity
function pause() external
function unpause() external
```

Emergency pause controls (requires OWNER_ROLE)

## Integration Guide

### 1. User Approves Token (Frontend)

```javascript
// For ERC20 staking
const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
const tx = await tokenContract.approve(stakingContractAddress, amount);
await tx.wait();
```

### 2. Stake BNB

```javascript
const stakingContract = new ethers.Contract(
  stakingContractAddress,
  STAKING_ABI,
  signer
);
const tx = await stakingContract.stakeBNB(0, {
  value: ethers.parseEther("0.5"),
}); // COMET tier
await tx.wait();
```

### 3. Stake ERC20 Token

```javascript
const tx = await stakingContract.stakeToken(
  tokenAddress,
  ethers.parseEther("1"),
  1 // METEOR tier
);
await tx.wait();
```

### 4. Check Rewards

```javascript
const rewards = await stakingContract.calculateRewards(userAddress, stakeId);
console.log("Pending rewards:", ethers.formatEther(rewards));
```

### 5. Withdraw

```javascript
const tx = await stakingContract.withdraw(stakeId);
await tx.wait();
```

## Gas Estimates (BSC Testnet)

- Stake BNB: ~150,000 gas
- Stake Token: ~180,000 gas
- Claim Rewards: ~120,000 gas
- Withdraw: ~140,000 gas
- Emergency Withdraw: ~100,000 gas

## License

MIT

## Audit Status

⚠️ **Not yet audited** - Recommended to get professional audit before mainnet deployment

## Support

For issues or questions, please open an issue on GitHub.
