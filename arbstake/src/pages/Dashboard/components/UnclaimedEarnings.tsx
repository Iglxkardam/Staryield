import React from 'react';
import Card from '@components/Card';
import Button from '@components/Button';
import AnimatedNumber from '@components/AnimatedNumber';
import { useClaimRewards } from '../hooks/useClaimRewards';

interface UnclaimedEarningsProps {
  amount: number;
  token: string;
}

const UnclaimedEarnings: React.FC<UnclaimedEarningsProps> = ({ amount, token }) => {
  const { claimRewards, isClaiming } = useClaimRewards();

  const handleClaim = async () => {
    await claimRewards();
  };

  return (
    <Card>
      <div className="claim-box d-flex align-items-center">
        <div className="claim-logo">
          <img src={token === 'ETH' ? '/images/eth.svg' : `/images/${token.toLowerCase()}.png`} alt={token} />
        </div>
        <div className="claim-box-details">
          <h4>Unclaimed Earning</h4>
          <h3><b className="ticker">{token}</b> <AnimatedNumber value={amount} /></h3>
          <Button variant="blue" onClick={handleClaim} disabled={isClaiming}>
            <i className="fa-regular fa-hand-pointer"></i> {isClaiming ? 'Claiming...' : 'Claim'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UnclaimedEarnings;
