import React from 'react';

interface VideoBackgroundProps {
  src: string;
  className?: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ src, className = '' }) => {
  return (
    <div className={className}>
      <video autoPlay loop muted playsInline>
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoBackground;
