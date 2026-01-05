import { formatEther } from 'viem';
import { useClaimRewards } from '../hooks/useClaimRewards';
import { useWithdraw } from '../hooks/useWithdraw';
import { useUserStakes } from '../hooks/useUserStakes';
import { useStakingTiers } from '../hooks/useStakingTiers';
import Card, { CardTitle } from '@components/Card';
import { useChainId } from 'wagmi';

interface Stake {
  amount: bigint;
  startTime: bigint;
  endTime: bigint;
  tier: number;
  token: string;
  withdrawn: boolean;
  rewardsClaimed: bigint;
}

export const ActiveStakes = () => {
  const { userStakesData } = useUserStakes();
  const { tiers } = useStakingTiers();
  const { claimRewards, isClaiming } = useClaimRewards();
  const { withdraw, isWithdrawing } = useWithdraw();
  const chainId = useChainId();

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const SECONDS_PER_YEAR = 31536000n;
  const BASIS_POINTS_DIVISOR = 10000n;

  // Get native token symbol based on chain
  const getNativeTokenSymbol = (): string => {
    if (chainId === 97 || chainId === 56) return 'BNB'; // BSC Testnet or Mainnet
    if (chainId === 84532 || chainId === 8453) return 'ETH'; // Base Sepolia or Mainnet
    return 'ETH'; // Default
  };

  const calculateUnclaimedRewards = (stake: Stake): bigint => {
    if (stake.withdrawn || !tiers?.length) {
      return 0n;
    }

    const tierData = tiers[stake.tier];
    if (!tierData) {
      return 0n;
    }

    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    const stakingDuration = currentTime - stake.startTime;
    const apyRate = BigInt(tierData.apyRateBasisPoints || 600);

    const totalRewardsWei = (stake.amount * apyRate * stakingDuration) / (SECONDS_PER_YEAR * BASIS_POINTS_DIVISOR);
    const unclaimedRewards = totalRewardsWei - stake.rewardsClaimed;

    return unclaimedRewards > 0n ? unclaimedRewards : 0n;
  };

  const isUnlocked = (endTime: bigint): boolean => {
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    return currentTime >= endTime;
  };

  const getTimeRemaining = (endTime: bigint): string => {
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    if (currentTime >= endTime) {
      return 'Unlocked';
    }

    const secondsRemaining = Number(endTime - currentTime);
    const days = Math.floor(secondsRemaining / 86400);
    const hours = Math.floor((secondsRemaining % 86400) / 3600);

    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
  };

  const getTierName = (tierIndex: number): string => {
    const tierNames = ['COMET', 'METEOR', 'SUPERNOVA'];
    return tierNames[tierIndex] || 'Unknown';
  };

  const handleClaim = async (stakeId: number) => {
    await claimRewards(stakeId);
  };

  const handleWithdraw = async (stakeId: number) => {
    await withdraw(stakeId);
  };

  // Filter out withdrawn stakes
  const stakes = userStakesData as Stake[] | undefined;
  const activeStakes = stakes?.filter((stake: Stake) => !stake.withdrawn) || [];

  if (!activeStakes.length) {
    return (
      <Card>
        <CardTitle title="Active Stakes" />
        <div className="text-center py-5" style={{ opacity: 0.7 }}>
          <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3">No Active Stakes</h5>
          <p>Start staking to see your active positions here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle 
        title="Active Stakes" 
        actions={
          <span className="badge bg-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            {activeStakes.length} {activeStakes.length === 1 ? 'Position' : 'Positions'}
          </span>
        }
      />
      <div style={{ marginTop: '1.5rem' }}>
        {activeStakes.map((stake: Stake, index: number) => {
          const unclaimedRewards = calculateUnclaimedRewards(stake);
          const unlocked = isUnlocked(stake.endTime);
          const timeRemaining = getTimeRemaining(stake.endTime);
          const tierData = tiers?.[stake.tier];
          const apyDisplay = tierData?.apyRateBasisPoints 
            ? (tierData.apyRateBasisPoints / 100).toFixed(0)
            : '0';

          return (
            <div 
              key={index}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                padding: '1.25rem',
                marginBottom: '1rem',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                {/* Left Section - Stake Info */}
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', flex: 1 }}>
                  {/* Stake ID */}
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.25rem' }}>Stake ID</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>#{index}</div>
                  </div>

                  {/* Amount */}
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.25rem' }}>Amount</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                      {parseFloat(formatEther(stake.amount)).toFixed(4)}
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, marginLeft: '0.25rem' }}>
                        {stake.token === ZERO_ADDRESS ? getNativeTokenSymbol() : 'TOKEN'}
                      </span>
                    </div>
                  </div>

                  {/* Tier */}
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.25rem' }}>Tier</div>
                    <div>
                      <span className={`badge ${
                        stake.tier === 0 ? 'bg-info' :
                        stake.tier === 1 ? 'bg-warning' :
                        'bg-danger'
                      }`}>
                        {getTierName(stake.tier)}
                      </span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.7, marginLeft: '0.5rem' }}>
                        {apyDisplay}% APY
                      </span>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.25rem' }}>Unclaimed Rewards</div>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 600,
                      color: unclaimedRewards > 0n ? '#4CAF50' : 'inherit'
                    }}>
                      {parseFloat(formatEther(unclaimedRewards)).toFixed(6)}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.25rem' }}>Status</div>
                    <div>
                      {unlocked ? (
                        <span className="badge bg-success">
                          <i className="bi bi-unlock me-1"></i>
                          Unlocked
                        </span>
                      ) : (
                        <span className="badge" style={{ background: '#FFA500', color: '#000' }}>
                          <i className="bi bi-lock me-1"></i>
                          {timeRemaining}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {unclaimedRewards > 0n && (
                    <button
                      className="btn btn-green"
                      onClick={() => handleClaim(index)}
                      disabled={isClaiming}
                      style={{ 
                        minWidth: '100px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      {isClaiming ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Claiming...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cash-coin me-1"></i>
                          CLAIM
                        </>
                      )}
                    </button>
                  )}
                  <button
                    className={`btn ${unlocked ? 'btn-blue' : 'btn'}`}
                    onClick={() => handleWithdraw(index)}
                    disabled={isWithdrawing || !unlocked}
                    style={{ 
                      minWidth: '100px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      opacity: unlocked ? 1 : 0.5,
                      cursor: unlocked ? 'pointer' : 'not-allowed'
                    }}
                    title={unlocked ? 'Withdraw principal + rewards' : 'Stake is still locked'}
                  >
                    {isWithdrawing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-up me-1"></i>
                        UNSTAKE
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: '0.875rem', padding: '1rem', opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1rem' }}>
        <i className="bi bi-info-circle me-2"></i>
        <strong>Claim:</strong> Withdraw rewards anytime • <strong>Unstake:</strong> Withdraw principal + remaining rewards (available when unlocked)
      </div>
    </Card>
  );
};
