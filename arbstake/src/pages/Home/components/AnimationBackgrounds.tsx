import React from 'react';
import VideoBackground from '@components/VideoBackground';

const AnimationBackgrounds: React.FC = () => {
  return (
    <>
      <VideoBackground src="/images/blue-globe.mp4" className="blue-globe" />
      <VideoBackground src="/images/ai.mp4" className="ai" />
      <VideoBackground src="/images/ship.mp4" className="ship" />
      <div className="white-globe">
        <img src="/images/white-globe.png" className="fluid-img" alt="Globe" />
      </div>
    </>
  );
};

export default AnimationBackgrounds;
