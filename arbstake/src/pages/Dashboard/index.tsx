import React from 'react';
import Header from '@components/Header';
import VideoBackground from '@components/VideoBackground';
import FeaturesMenu from './components/FeaturesMenu';
import PortfolioOverview from './components/PortfolioOverview';
import UnclaimedEarnings from './components/UnclaimedEarnings';
import StakingTabs from './components/StakingTabs';
import LoyaltyPoints from './components/LoyaltyPoints';
import { ActiveStakes } from './components/ActiveStakes';
import { useDashboard } from './hooks/useDashboard';

const Dashboard: React.FC = () => {
  const { 
    selectedToken, 
    portfolioStats,
    unclaimedEarnings,
    loyaltyPoints,
    isLoading
  } = useDashboard();

  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  React.useEffect(() => {
    setLastUpdate(new Date());
  }, [portfolioStats, unclaimedEarnings]);

  return (
    <div className="admin">
      {/* Admin Header */}
      <div className="admin-header">
        <VideoBackground src="/images/galaxy-bg-2.mp4" className="hesder-video" />
        <Header 
          isAdmin={true}
        />
        {/* Real-time update indicator */}
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: '#4CAF50',
          padding: '8px 15px',
          borderRadius: '20px',
          fontSize: '12px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            background: '#4CAF50',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></span>
          Auto-updating • Last: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Dashboard Main */}
      <div className="top-stats">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <FeaturesMenu />
            </div>

            <div className="col-lg-8">
              <PortfolioOverview 
                stats={portfolioStats} 
                token={selectedToken}
                isLoading={isLoading}
              />
            </div>

            <div className="col-lg-4">
              <UnclaimedEarnings 
                amount={unclaimedEarnings}
                token={selectedToken}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="dashboard-body">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <StakingTabs selectedToken={selectedToken} />
            </div>

            <div className="col-lg-4">
              <h3 className="box-o-title">Loyalty Points (Stars)</h3>
              <LoyaltyPoints points={loyaltyPoints} />
            </div>
          </div>

          {/* Active Stakes Section */}
          <div className="row mt-4">
            <div className="col-lg-12">
              <ActiveStakes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
