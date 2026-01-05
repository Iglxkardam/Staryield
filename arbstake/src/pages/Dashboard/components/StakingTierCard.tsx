import React, { useState } from 'react';
import Button from '@components/Button';
import { StakingTier } from '@/types';
import { useStakeToken } from '../hooks/useStakeToken';
import { useWallet } from '@/hooks/useWallet';

interface StakingTierCardProps {
  tier: StakingTier;
  selectedToken: string;
}

const StakingTierCard: React.FC<StakingTierCardProps> = ({ tier, selectedToken }) => {
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const { approveToken, stake, isApproving, isStaking } = useStakeToken();
  const { wallet } = useWallet();

  const handleMaxClick = () => {
    // Use actual wallet balance
    setStakeAmount(wallet.balance.toString());
  };

  const handleApprove = async () => {
    await approveToken(stakeAmount);
  };

  const handleStake = async () => {
    await stake(stakeAmount, tier.id);
    setStakeAmount('');
  };

  // For native currency (ETH/BNB), no approval needed
  const isNativeCurrency = selectedToken === 'ETH' || selectedToken === 'BNB';

  return (
    <div className="staking-wrap">
      <div className="staking-top">
        <div className="s-title">
          <i>{tier.tier}</i>
          <span>{tier.name}</span>
          <b>Stake ${selectedToken}</b>
        </div>
        <div className="s-data">
          <h4>You Staked</h4>
          <h5>{tier.youStaked} <b>{selectedToken}</b></h5>
        </div>
        <div className="s-data">
          <h4>APY/APR</h4>
          <h5>{tier.apy}</h5>
        </div>
        <div className="s-data">
          <h4>Locked Period</h4>
          <h5>{tier.lockedPeriod} <b>Days</b></h5>
        </div>
        <div className="s-data">
          <h4>Min Investment</h4>
          <h5>{tier.minInvestment} <b>{selectedToken}</b></h5>
        </div>
        <div className="s-data">
          <h4>Daily</h4>
          <h5>{tier.dailyRate}</h5>
        </div>
      </div>
      <div className="staking-field">
        <div className="staking-form">
          <div className="token-ticker">
            <img src={selectedToken === 'ETH' ? '/images/eth.svg' : `/images/${selectedToken.toLowerCase()}.png`} alt={selectedToken} />&nbsp; {selectedToken}
          </div>
          <div className="input-box">
            <input 
              type="text" 
              placeholder="0" 
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
            <span className="max" onClick={handleMaxClick}>Max</span>
          </div>
        </div>
        <div className="staking-titles">
          <div id="balance">Balance: {wallet.balance.toFixed(4)} {selectedToken}</div>
          <div>Enter Amount Above</div>
        </div>
        <div className={`staking-button ${isNativeCurrency ? 'single' : 'half'} clearfix`}>
          {!isNativeCurrency && (
            <div className="s-button">
              <Button 
                variant="white" 
                size="normal" 
                className="full" 
                onClick={handleApprove}
                disabled={isApproving || !stakeAmount}
              >
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
            </div>
          )}
          <div className="s-button">
            <Button 
              variant="skyblue" 
              size="normal" 
              className="full" 
              onClick={handleStake}
              disabled={isStaking || !stakeAmount}
            >
              {isStaking ? 'Staking...' : 'Stake Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingTierCard;
