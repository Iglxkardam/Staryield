import React, { useState } from 'react';
import StakingTierCard from './StakingTierCard';
import { useStakingTiers } from '../hooks/useStakingTiers';

interface StakingTabsProps {
  selectedToken: string;
}

const StakingTabs: React.FC<StakingTabsProps> = ({ selectedToken }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const { tiers } = useStakingTiers();

  return (
    <div className="staking-container">
      <div className="staking-tabs tabs">
        <ul className="tab-links clearfix">
          {tiers.map((tier) => (
            <li key={tier.id} className={activeTab === tier.id ? 'active' : ''}>
              <a 
                href={`#tab${tier.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tier.id);
                }}
              >
                {tier.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              className={`tab ${activeTab === tier.id ? 'active' : ''}`} 
              id={`tab${tier.id}`}
            >
              <StakingTierCard tier={tier} selectedToken={selectedToken} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StakingTabs;
