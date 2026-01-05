# Active Stakes Feature Implementation

## Overview

Implemented functional claim and unstake buttons for user stakes with a dedicated Active Stakes component.

## New Components & Hooks

### 1. useUserStakes.ts

**Location**: `src/pages/Dashboard/hooks/useUserStakes.ts`

Hook to fetch user's stakes from the contract:

- Auto-refreshes every 3 seconds
- Returns: `userStakesData`, `refetch`, `isLoading`

### 2. useWithdraw.ts

**Location**: `src/pages/Dashboard/hooks/useWithdraw.ts`

Hook for withdrawing/unstaking:

- Calls `contract.withdraw(stakeId)`
- Returns: `withdraw`, `isWithdrawing`, `isSuccess`, `hash`
- Similar pattern to existing `useClaimRewards` hook

### 3. ActiveStakes.tsx

**Location**: `src/pages/Dashboard/components/ActiveStakes.tsx`

Main component displaying all active stakes with actions:

**Features**:

- Displays each stake in a table format
- Shows: Stake ID, Amount, Tier, Token Type, Unclaimed Rewards, Status
- Per-stake action buttons:
  - **Claim Button**: Available when unclaimed rewards > 0
  - **Unstake Button**: Available when stake is unlocked
  - **Emergency Withdraw**: Available when stake is still locked (principal only, no rewards)
- Real-time reward calculations using exact BigInt precision
- Lock status indicator with time remaining
- Color-coded tier badges (COMET/METEOR/SUPERNOVA)

**Reward Calculation**:

```typescript
const totalRewardsWei =
  (stake.amount * apyRate * stakingDuration) /
  (SECONDS_PER_YEAR * BASIS_POINTS_DIVISOR);
const unclaimedRewards = totalRewardsWei - stake.rewardsClaimed;
```

This matches the contract formula exactly using BigInt arithmetic.

## Dashboard Integration

**Location**: `src/pages/Dashboard/index.tsx`

Added ActiveStakes component in a new row below the StakingTabs:

```tsx
<div className="row mt-4">
  <div className="col-lg-12">
    <ActiveStakes />
  </div>
</div>
```

## User Flow

### Claiming Rewards

1. User sees active stakes with unclaimed rewards amount
2. Clicks "Claim" button on specific stake
3. Hook calls `contract.claimRewards(stakeId)`
4. Transaction processes with loading indicator
5. Rewards transferred to user's wallet
6. Stake updates with new `rewardsClaimed` amount

### Unstaking (Unlocked)

1. Stake shows "Unlocked" status when lock period ends
2. User clicks "Unstake" button
3. Hook calls `contract.withdraw(stakeId)`
4. Contract transfers:
   - Principal amount back to user
   - Any unclaimed rewards to user
5. Stake marked as `withdrawn = true`
6. Stake disappears from active stakes list

### Emergency Withdraw (Locked)

1. Stake shows "Locked" status with time remaining
2. User clicks "Emergency" button (red, warning icon)
3. Hook calls `contract.withdraw(stakeId)` (same function)
4. Contract checks lock period:
   - If still locked: Only returns principal, NO rewards
   - Penalty: All rewards forfeited
5. Stake marked as `withdrawn = true`

## Technical Details

### Contract Integration

- **RewardPool Architecture**: Funds come from RewardPool contract
- **Staking Contract**: Tracks stakes, calculates rewards, authorizes payouts
- **withdraw() function**: Single function handles both normal and emergency withdrawals based on lock period

### State Management

- Real-time updates via wagmi hooks
- Auto-refresh every 3 seconds
- Transaction state tracking (pending, confirming, success)
- Loading indicators on buttons during transactions

### Type Safety

```typescript
interface Stake {
  amount: bigint;
  startTime: bigint;
  endTime: bigint;
  tier: number;
  token: string;
  withdrawn: boolean;
  rewardsClaimed: bigint;
}
```

## Styling

- Bootstrap 5 table with hover effects
- Color-coded badges for tiers and status
- Icons from Bootstrap Icons
- Responsive design
- Loading spinners during transactions
- Informational footer with usage notes

## Testing Checklist

### Before Testing

✅ Contracts deployed on both chains
✅ RewardPools authorized
✅ Frontend updated with new addresses
✅ Admin panel updated

### To Test

1. **Claim Rewards**:

   - [ ] Stake some tokens (wait for rewards to accumulate)
   - [ ] See unclaimed rewards in Active Stakes table
   - [ ] Click "Claim" button
   - [ ] Confirm transaction in wallet
   - [ ] Verify rewards received in wallet
   - [ ] Check stake shows updated rewardsClaimed amount

2. **Unstake (Normal)**:

   - [ ] Wait for lock period to end
   - [ ] See "Unlocked" status
   - [ ] Click "Unstake" button
   - [ ] Confirm transaction
   - [ ] Verify principal + remaining rewards received
   - [ ] Stake disappears from list

3. **Emergency Withdraw**:

   - [ ] Create new stake
   - [ ] See "Locked" status with time remaining
   - [ ] Click "Emergency" button
   - [ ] Confirm transaction
   - [ ] Verify only principal received (no rewards)
   - [ ] Stake disappears from list

4. **UI/UX**:
   - [ ] Auto-refresh works (rewards update every 3 seconds)
   - [ ] Loading indicators show during transactions
   - [ ] Buttons disabled during transactions
   - [ ] Multiple stakes display correctly
   - [ ] Empty state shows when no stakes

## Important Notes

⚠️ **Fund RewardPools**: Before users can claim/withdraw, RewardPools must have liquidity:

```javascript
// BSC Testnet RewardPool: 0x259f2AC8BB77E575ADD1B859D7AFc57Eb5CD05D0
// Base Sepolia RewardPool: 0x1018Ea97C3540d9dB123392705096f5B93cD46C9

// Deposit BNB/ETH via admin panel or:
await rewardPool.depositBNB({ value: ethers.parseEther("10.0") });
```

⚠️ **Emergency Withdraw Penalty**: Users lose ALL rewards when emergency withdrawing locked stakes. This should be clearly communicated.

⚠️ **Transaction Fees**: Users pay gas fees for claim and withdraw transactions.

## Next Steps

1. **Fund RewardPools** with BNB/ETH for testing
2. **Test all flows** on both BSC and Base Sepolia
3. **Add toast notifications** for transaction success/failure
4. **Add transaction history** view (optional)
5. **Add confirmation modals** for emergency withdraws
6. **Update documentation** with user guides

## Files Modified

- `src/pages/Dashboard/hooks/useUserStakes.ts` (NEW)
- `src/pages/Dashboard/hooks/useWithdraw.ts` (NEW)
- `src/pages/Dashboard/components/ActiveStakes.tsx` (NEW)
- `src/pages/Dashboard/index.tsx` (UPDATED)
