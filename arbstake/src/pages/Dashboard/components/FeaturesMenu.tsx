import React from 'react';

const FeaturesMenu: React.FC = () => {
  const features = [
    {
      title: 'Cross-chain',
      heading: 'Interstellar Transfers (Coming Soon)',
      description: 'To maximize the potential of our platform, we are working towards facilitating operations across multiple blockchain networks.'
    },
    {
      title: 'Governance',
      heading: 'Staryield Governance (Coming Soon)',
      description: 'In the spirit of decentralized finance, we plan to introduce a governance token.'
    },
    {
      title: 'Star Art Vault',
      heading: 'NFT Staking(Coming Soon)',
      description: 'In keeping up with the explosive growth of Non-Fungible Tokens (NFTs), we aim to incorporate NFT staking into our platform.'
    },
    {
      title: 'StarYieldSwap',
      heading: 'DEX(Coming Soon)',
      description: 'We envision establishing our own dedicated DeFi exchange, StarYieldSwap. This platform will facilitate seamless swaps between different cryptocurrencies, driving further utility and making asset management even more flexible for our users.'
    },
    {
      title: 'Space Radar',
      heading: 'Advanced Portfolio Analytics (Coming Soon)',
      description: 'To provide our users with deep insights into their investments, we aim to develop an advanced portfolio analytics tool.'
    },
    {
      title: 'Comet Club',
      heading: 'Loyalty and Rewards Program (Coming Soon)',
      description: 'Our plan includes the launch of a loyalty and rewards program to show appreciation for our loyal users.'
    }
  ];

  return (
    <ul className="features-menu d-flex justify-content-center">
      {features.map((feature, index) => (
        <li key={index}>
          <a href="#">{feature.title}</a>
          <div className="feature-pop">
            <h4>{feature.heading}</h4>
            <p>{feature.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FeaturesMenu;
