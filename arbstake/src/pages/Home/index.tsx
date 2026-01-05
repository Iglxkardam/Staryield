import React from 'react';
import Header from '@components/Header';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import SocialLinks from './components/SocialLinks';
import AnimationBackgrounds from './components/AnimationBackgrounds';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <div className="main-wrapper">
        <div className="container">
          <div className="inner-wrapper d-flex align-items-center justify-content-center">
            <HeroSection />
            <StatsSection />
            <SocialLinks />
            <AnimationBackgrounds />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
