import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain, useChainId } from 'wagmi';
import { WalletConnection, Token } from '@/types';
import { bscTestnet, baseSepolia, chainMetadata } from '@/config/wagmi';
import { formatEther } from 'viem';

export const useWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const { data: balanceData } = useBalance({
    address: address,
  });

  const [selectedToken, setSelectedToken] = useState<Token>({
    symbol: 'BNB',
    name: 'Binance Coin',
    icon: '/images/bnb.png'
  });

  const wallet: WalletConnection = {
    address: address || null,
    isConnected,
    balance: balanceData ? parseFloat(formatEther(balanceData.value)) : 0,
    selectedToken,
    chainId,
    chainName: chainMetadata[chainId as keyof typeof chainMetadata]?.name || 'Unknown Network'
  };

  const connectWallet = async () => {
    try {
      console.log('🔌 Attempting to connect wallet...');
      console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));
      
      // Try MetaMask first (injected connector)
      const injectedConnector = connectors.find(c => c.id === 'injected' || c.id === 'metaMask');
      
      if (injectedConnector) {
        console.log('✅ Found injected connector:', injectedConnector.name);
        await connect({ connector: injectedConnector });
      } else if (connectors[0]) {
        console.log('⚠️ No injected connector, using first available:', connectors[0].name);
        await connect({ connector: connectors[0] });
      } else {
        console.error('❌ No connectors available!');
        alert('No wallet connectors available. Please install MetaMask.');
      }
    } catch (error) {
      console.error('❌ Error connecting wallet:', error);
      alert('Failed to connect wallet. Check console for details.');
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const switchToken = (token: Token) => {
    setSelectedToken(token);
  };

  const switchNetwork = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  const switchToBscTestnet = () => switchNetwork(bscTestnet.id);
  const switchToBaseSepolia = () => switchNetwork(baseSepolia.id);

  const getBalance = async (): Promise<number> => {
    return wallet.balance;
  };

  // Auto-update selected token based on chain
  useEffect(() => {
    if (chainId === bscTestnet.id) {
      setSelectedToken({
        symbol: 'BNB',
        name: 'Binance Coin',
        icon: '/images/bnb.png'
      });
    } else if (chainId === baseSepolia.id) {
      setSelectedToken({
        symbol: 'ETH',
        name: 'Ethereum',
        icon: '/images/eth.png'
      });
    }
  }, [chainId]);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    switchToken,
    getBalance,
    switchNetwork,
    switchToBscTestnet,
    switchToBaseSepolia,
    isConnected,
    address,
    chainId
  };
};
