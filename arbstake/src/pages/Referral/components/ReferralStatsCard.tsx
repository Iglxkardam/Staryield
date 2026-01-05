import React from 'react';
import Card, { CardTitle } from '@components/Card';
import { ReferralStats } from '@/types';

interface ReferralStatsCardProps {
  stats: ReferralStats;
  token: string;
}

const ReferralStatsCard: React.FC<ReferralStatsCardProps> = ({ stats, token }) => {
  return (
    <Card>
      <CardTitle 
        title="Referral Stats"
        actions={
          <>
            <a href="#" className="btn btn-green">
              <i className="fa-solid fa-square-arrow-up-right"></i> Verified Contract
            </a>
            <a href="#" className="btn btn-blue">
              <i className="fa-solid fa-headset"></i> Support
            </a>
          </>
        }
      />
      <ul className="top-stats-ul clearfix">
        <li>
          <h4>Your Referrals</h4>
          <h3>{stats.yourReferrals}</h3>
        </li>
        <li>
          <h4>Total Commision</h4>
          <h3>{token} <span>{stats.totalCommission}</span></h3>
        </li>
        <li>
          <h4>Withdrawn Commission</h4>
          <h3>{token} <span>{stats.withdrawnCommission}</span></h3>
        </li>
        <li>
          <h4>Earned XPs</h4>
          <h3>{stats.earnedXP} <span>XP</span></h3>
        </li>
      </ul>
    </Card>
  );
};

export default ReferralStatsCard;
