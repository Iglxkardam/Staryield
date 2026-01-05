import React from 'react';
import Card, { CardTitle } from '@components/Card';
import AnimatedNumber from '@components/AnimatedNumber';
import { PortfolioStats } from '@/types';

interface PortfolioOverviewProps {
  stats: PortfolioStats;
  token: string;
  isLoading?: boolean;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ stats, token }) => {
  return (
    <Card>
      <CardTitle 
        title="Overall Portfolio"
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
          <h4>Total Staked</h4>
          <h3>{token} <AnimatedNumber value={stats.totalStaked} /></h3>
        </li>
        <li>
          <h4>Total Earned</h4>
          <h3>{token} <AnimatedNumber value={stats.totalEarned} /></h3>
        </li>
        <li>
          <h4>Active Staking</h4>
          <h3>{token} <AnimatedNumber value={stats.activeStaking} /></h3>
        </li>
        <li>
          <h4>Withdrawn Earning</h4>
          <h3>{token} <AnimatedNumber value={stats.withdrawnEarning} /></h3>
        </li>
      </ul>
    </Card>
  );
};

export default PortfolioOverview;
