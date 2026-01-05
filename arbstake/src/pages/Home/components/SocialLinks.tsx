import React from 'react';

const SocialLinks: React.FC = () => {
  return (
    <div className="arb-socials">
      <ul className="clearfix">
        <li>
          <a href="#" target="_blank" className="btn btn-social" rel="noreferrer">
            <i className="fab fa-twitter"></i> Twitter
          </a>
        </li>
        <li>
          <a href="#" target="_blank" className="btn btn-social" rel="noreferrer">
            <i className="fas fa-paper-plane"></i> Telegram
          </a>
        </li>
        <li>
          <a href="#" target="_blank" className="btn btn-social" rel="noreferrer">
            <i className="fab fa-discord"></i> Discord
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SocialLinks;
