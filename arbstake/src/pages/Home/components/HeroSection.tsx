import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="main-caption text-center">
      <h1>Navigate the Financial Cosmos <br/>with StarYield Staking</h1>
      <p>
        Journey through the financial galaxy with StarYield's premier staking experience. 
        Unlock the potential of your digital assets as you traverse through a universe of rewards. 
        With StarYield, your crypto ventures beyond the ordinary, charting a course through the 
        stars of DeFi space. Secure.
      </p>
      <div className="button-set text-center">
        <Link to="/dashboard" className="btn btn-skyblue normal">Begin Staking</Link>
        <a href="#" className="btn btn-green normal" style={{marginLeft:'10px'}}>read Document</a>
      </div>
    </div>
  );
};

export default HeroSection;
