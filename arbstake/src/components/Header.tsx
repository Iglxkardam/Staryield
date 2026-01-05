import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '@/hooks/useWallet';
import { bscTestnet, baseSepolia } from '@/config/wagmi';

interface HeaderProps {
  isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { 
    switchToBscTestnet, 
    switchToBaseSepolia, 
    chainId 
  } = useWallet();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleNetworkSwitch = (network: 'bnb' | 'base') => {
    if (network === 'bnb') {
      switchToBscTestnet();
    } else {
      switchToBaseSepolia();
    }
  };

  return (
    <header>
      <div className="container">
        <div className="header-container d-flex justify-content-between align-items-center">
          <Link to="/" className="logo">
            <img src={isAdmin ? "/images/logo.png" : "/images/logo.svg"} alt="StarYield" />
          </Link>
          
          <ul className={`main-menu clearfix ${menuOpen ? 'd-block' : ''}`}>
            {isAdmin ? (
              <>
                <li className={isActive('/dashboard')}><Link to="/dashboard" className="link">Stake</Link></li>
                <li className={isActive('/referral')}><Link to="/referral" className="link">Affiliate</Link></li>
                <li className={isActive('/transactions')}><Link to="/transactions" className="link">History</Link></li>
                <li><a href="#" className="link">Referral Banners</a></li>
                <li><a href="#" className="link">Documentation</a></li>
              </>
            ) : (
              <>
                <li><a href="#" className="link">Stake</a></li>
                <li><a href="#" className="link">Affiliate</a></li>
                <li><a href="#" className="link">Guide</a></li>
                <li><a href="#" className="link">Roadmap</a></li>
                <li><a href="#" className="link">Documentation</a></li>
              </>
            )}
            <li className="menu-enter">
              <Link to="/dashboard" className="btn btn-blue">Enter App</Link>
            </li>
          </ul>

          <ul className="header-buttons clearfix">
            {isAdmin && (
              <li className="switch d-flex align-items-center">
                <a 
                  className={chainId === bscTestnet.id ? 'active' : ''} 
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleNetworkSwitch('bnb'); }}
                >
                  <img src="/images/bnb.png" alt="BNB" />BNB Testnet
                </a>
                <a 
                  className={chainId === baseSepolia.id ? 'active' : ''}
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleNetworkSwitch('base'); }}
                >
                  <img src="/images/base.svg" alt="Base" />Base Sepolia
                </a>
              </li>
            )}
            <li>
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button className="btn btn-green" onClick={openConnectModal} type="button">
                              Connect now
                            </button>
                          );
                        }

                        return (
                          <button 
                            className="btn btn-green" 
                            onClick={openAccountModal} 
                            type="button"
                            title={account.address}
                          >
                            {account.displayName}
                          </button>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </li>
            {!isAdmin && (
              <li className="enter-app">
                <Link to="/dashboard" className="btn btn-blue">Enter App</Link>
              </li>
            )}
            <li className="menu-toggle">
              <a 
                href="javascript:void(0);" 
                id="menu-toggle" 
                className="btn btn-skyblue"
                onClick={toggleMenu}
              >
                <i className={`fas fa-${menuOpen ? 'times' : 'bars'}`}></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
