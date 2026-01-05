import React from 'react';
import { ReferralLevel } from '@/types';

interface ReferralLevelsProps {
  levels: ReferralLevel[];
}

const ReferralLevels: React.FC<ReferralLevelsProps> = ({ levels }) => {
  return (
    <ul className="level-list clearfix">
      {levels.map((level, index) => (
        <li key={index}>
          <div className={`level-box ${level.status}`}>
            <h3>
              {level.commission}
              <span>%</span>
              <b>Commission</b>
            </h3>
            <div className="turnover">{level.referralRange}</div>
            <div className={`level ${level.level.toLowerCase()}`}>
              {level.level}
            </div>
            <div className="ref-status">
              <div className={`finished-badge ${level.status}`}>
                {level.status === 'finished' && (
                  <><i className="fa-regular fa-circle-check"></i> Done</>
                )}
                {level.status === 'active' && (
                  <><i className="fa-regular fa-clock"></i> Current</>
                )}
                {level.status === 'locked' && (
                  <><i className="fa-solid fa-lock"></i> Locked</>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ReferralLevels;
