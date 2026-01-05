import React from 'react';
import AnimatedNumber from '@components/AnimatedNumber';
import { useHomeStats } from '../hooks/useHomeStats';

const StatsSection: React.FC = () => {
  const { stats } = useHomeStats();

  return (
    <div className="arb-stats">
      <ul className="clearfix">
        <li>
          <h4>Total value locked</h4>
          <h3>$<AnimatedNumber value={stats.totalValueLocked} /></h3>
        </li>
        <li>
          <h4>Total stakers</h4>
          <h3><AnimatedNumber value={stats.totalStakers} /></h3>
        </li>
        <li>
          <h4>Total payouts</h4>
          <h3>$<AnimatedNumber value={stats.totalPayouts} /></h3>
        </li>
      </ul>
    </div>
  );
};

export default StatsSection;
