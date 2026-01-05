import React from 'react';
import Card from '@components/Card';
import { LoyaltyPoints as LoyaltyPointsType } from '@/types';

interface LoyaltyPointsProps {
  points: LoyaltyPointsType;
}

const LoyaltyPoints: React.FC<LoyaltyPointsProps> = ({ points }) => {
  return (
    <Card variant="point-1">
      <ul className="stat-list">
        <li className="d-flex align-items-center">
          <div className="stat-icon"><img src="/images/stat-icon-1.png" alt="Stars" /></div>
          <div className="stat-details">
            <h4>Total Stars</h4>
            <h3>{points.totalStars.toLocaleString()}</h3>
          </div>
        </li>
        <li className="d-flex align-items-center">
          <div className="stat-icon"><img src="/images/stat-icon-2.png" alt="Staking" /></div>
          <div className="stat-details">
            <h4>Stars earned by staking</h4>
            <h3>{points.starsFromStaking.toLocaleString()}</h3>
          </div>
        </li>
        <li className="d-flex align-items-center">
          <div className="stat-icon"><img src="/images/stat-icon-3.png" alt="Referrals" /></div>
          <div className="stat-details">
            <h4>Stars earned by friend's staking</h4>
            <h3>{points.starsFromReferrals.toLocaleString()}</h3>
          </div>
        </li>
        <li className="d-flex align-items-center">
          <div className="stat-icon"><img src="/images/stat-icon-4.png" alt="Referrals Count" /></div>
          <div className="stat-details">
            <h4>Referrals</h4>
            <h3>{points.referrals.toLocaleString()}</h3>
          </div>
        </li>
      </ul>
    </Card>
  );
};

export default LoyaltyPoints;
