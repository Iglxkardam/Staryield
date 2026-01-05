import React from 'react';
import Card from '@components/Card';

interface CurrentLevelProps {
  level: string;
}

const CurrentLevel: React.FC<CurrentLevelProps> = ({ level }) => {
  return (
    <Card variant="current-level">
      <div className="claim-box d-flex align-items-center">
        <div className="claim-logo">
          <img src="/images/users.png" alt="Users" />
        </div>
        <div className="claim-box-details">
          <h4>Current Level</h4>
          <h3><b className="ticker">{level}</b></h3>
        </div>
      </div>
    </Card>
  );
};

export default CurrentLevel;
