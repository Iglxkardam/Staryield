import React from 'react';
import Card from '@components/Card';
import Button from '@components/Button';
import { useClaimCommission } from '../hooks/useClaimCommission';

interface UnclaimedCommissionProps {
  amount: number;
  token: string;
}

const UnclaimedCommission: React.FC<UnclaimedCommissionProps> = ({ amount, token }) => {
  const { claimCommission, isClaiming } = useClaimCommission();

  const handleClaim = async () => {
    await claimCommission();
  };

  return (
    <Card>
      <div className="claim-box d-flex align-items-center">
        <div className="claim-logo">
          <img src={`/images/${token.toLowerCase()}.png`} alt={token} />
        </div>
        <div className="claim-box-details">
          <h4>Unclaimed Commission</h4>
          <h3><b className="ticker">{token}</b> <span>{amount}</span></h3>
          <Button variant="blue" onClick={handleClaim} disabled={isClaiming}>
            <i className="fa-regular fa-hand-pointer"></i> {isClaiming ? 'Claiming...' : 'Claim'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UnclaimedCommission;
