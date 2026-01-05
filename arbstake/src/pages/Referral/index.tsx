import React from 'react';
import Header from '@components/Header';
import VideoBackground from '@components/VideoBackground';
import FeaturesMenu from '../Dashboard/components/FeaturesMenu';
import ReferralStatsCard from './components/ReferralStatsCard';
import UnclaimedCommission from './components/UnclaimedCommission';
import ReferralLinkCard from './components/ReferralLinkCard';
import CurrentLevel from './components/CurrentLevel';
import ReferralLevels from './components/ReferralLevels';
import { useReferralPage } from './hooks/useReferralPage';

const Referral: React.FC = () => {
  const { 
    selectedToken,
    referralStats,
    unclaimedCommission,
    currentLevel,
    referralLevels,
    referralLink
  } = useReferralPage();

  return (
    <div className="admin">
      {/* Admin Header */}
      <div className="admin-header">
        <VideoBackground src="/images/galaxy-bg-2.mp4" className="hesder-video" />
        <Header isAdmin={true} />
      </div>

      {/* Dashboard Main */}
      <div className="top-stats">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <FeaturesMenu />
            </div>

            <div className="col-lg-8">
              <ReferralStatsCard stats={referralStats} token={selectedToken} />
            </div>

            <div className="col-lg-4">
              <UnclaimedCommission amount={unclaimedCommission} token={selectedToken} />
            </div>

            <div className="col-lg-8">
              <ReferralLinkCard referralLink={referralLink} />
            </div>

            <div className="col-lg-4">
              <CurrentLevel level={currentLevel} />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Body - Referral Levels */}
      <div className="dashboard-body">
        <div className="container">
          <ReferralLevels levels={referralLevels} />
        </div>
      </div>
    </div>
  );
};

export default Referral;
