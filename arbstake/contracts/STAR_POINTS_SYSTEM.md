# ⭐ Star Points System

## Overview

The Star Points system rewards users for staking ETH/BNB on the StarYield platform. Points are automatically awarded at the time of staking and continue to accumulate every 7 days based on the staked amount.

## How It Works

### Points Calculation

- **1 ETH or BNB = 1,000 points**
- **Proportional for any amount**: 0.5 ETH = 500 points, 2 ETH = 2,000 points, etc.

### Points Award Schedule

1. **Instant**: Points awarded immediately upon staking
2. **Recurring**: Additional points awarded every 7 days from the stake date
3. **Automatic**: Points accumulate automatically (no manual claiming required)

### Example Timeline

```
User stakes 1 ETH on Day 0:
- Day 0: +1,000 points (instant)
- Day 7: +1,000 points (first recurring)
- Day 14: +1,000 points (second recurring)
- Day 21: +1,000 points (third recurring)
- And so on...
```

### Unstaking Rules

- **Full Unstake**: All points earned are retained
- **Partial Unstake**: Points are deducted proportionally
  - Example: Unstake 50% = Lose 50% of points from that stake
- **Emergency Unstake**: All points from that stake are lost (penalty)

## Smart Contracts

### StarPoints.sol

Separate contract managing all points logic:

- Points tracking per user
- Points tracking per stake
- 7-day interval calculations
- Proportional deductions on partial unstakes

### StarYieldStaking.sol (Updated)

Integrated with StarPoints contract:

- Calls `initializeStake()` when user stakes
- Calls `claimPoints()` periodically
- Calls `handleUnstake()` on withdrawals
- Calls `handleEmergencyUnstake()` on emergency withdrawals

## Deployment

### Option 1: Deploy StarPoints Only

If you already have a deployed staking contract:

```bash
# BSC Testnet
cd contracts
npm run deploy:points:bsc

# Base Sepolia
npm run deploy:points:base
```

Then update your existing staking contract:

```solidity
stakingContract.updateStarPoints(newStarPointsAddress)
```

### Option 2: Deploy Full System (Recommended)

Deploy both contracts together:

```bash
# BSC Testnet
npm run deploy:full:bsc

# Base Sepolia
npm run deploy:full:base
```

This will:

1. Deploy StarPoints contract
2. Deploy new StarYieldStaking contract
3. Link them together
4. Authorize staking contract in both RewardPool and StarPoints

### Export ABIs

After deployment, export ABIs for frontend:

```bash
npm run compile
npm run export-abi
```

## Frontend Integration

### Hooks Available

#### useStarPoints

Get user's total points:

```typescript
import { useStarPoints } from "@/hooks";

const { totalPoints, refetchPoints } = useStarPoints();
```

#### useStakePoints

Get points info for a specific stake:

```typescript
import { useStakePoints } from "@/hooks";

const { stakePointsInfo, refetchStakePoints } = useStakePoints(stakeId);

// stakePointsInfo contains:
// - totalPoints: Points earned from this stake
// - pendingPoints: Points ready to be claimed
// - nextClaimTime: When next points will be available
// - active: Whether stake is still active
```

#### Helper Functions

```typescript
import { formatPoints, getDaysUntilNextClaim } from "@/hooks";

// Format large numbers: 1500 -> "1.5K", 2000000 -> "2M"
const formatted = formatPoints(totalPoints);

// Calculate days until next claim
const days = getDaysUntilNextClaim(nextClaimTime);
```

### UI Components

#### StarPointsCard

Display user's total points:

```typescript
import { StarPointsCard } from "@/pages/Dashboard/components/StarPointsCard";

<StarPointsCard />;
```

#### StakePointsDisplay

Show points info for individual stakes:

```typescript
import { StakePointsDisplay } from "@/pages/Dashboard/components/StakePointsDisplay";

<StakePointsDisplay stakeId={0} isActive={true} />;
```

## Configuration

Update contract addresses in `src/config/contracts.ts`:

```typescript
export const STAR_POINTS_ADDRESS = {
  97: "0x...", // BSC Testnet
  84532: "0x...", // Base Sepolia
} as const;
```

## Admin Functions

### Manual Points Adjustment

Admins can adjust user points for corrections or special events:

```solidity
starPoints.adjustUserPoints(
  userAddress,
  pointsChange, // positive to add, negative to deduct
  "Reason for adjustment"
)
```

### Add/Remove Staking Contracts

```solidity
starPoints.addStakingContract(newStakingContractAddress)
starPoints.removeStakingContract(oldStakingContractAddress)
```

## Testing

### Manual Testing Checklist

1. ✅ Stake ETH/BNB - verify instant points
2. ✅ Wait 7 days - verify recurring points
3. ✅ Claim rewards - verify points auto-claim
4. ✅ Partial unstake - verify proportional deduction
5. ✅ Full unstake - verify points retained
6. ✅ Emergency unstake - verify all points lost

### Hardhat Tests

```bash
cd contracts
npm test
```

## Gas Optimization

The StarPoints contract is designed for gas efficiency:

- Points calculations done off-chain (view functions)
- Only state updates on actual actions
- Batch operations where possible
- Minimal storage variables

## Security

### Access Control

- Only authorized staking contracts can modify points
- Admin functions protected by role-based access
- ReentrancyGuard on all state-changing functions

### Audit Recommendations

- ✅ Uses OpenZeppelin battle-tested libraries
- ✅ Follows Checks-Effects-Interactions pattern
- ✅ No external calls in critical sections
- ⚠️ Consider professional audit before mainnet

## Future Enhancements

Potential features to add:

- 🎁 Points redemption system
- 🏆 Leaderboards and competitions
- 🎯 Bonus multipliers for long-term stakers
- 🔄 Points transfer between users
- 💎 NFT rewards based on points milestones

## Support

For issues or questions:

1. Check the [main README](../../README.md)
2. Review contract documentation
3. Test on testnet first
4. Contact support team

## License

MIT License - See LICENSE file for details
