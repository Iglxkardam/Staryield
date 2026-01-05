import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { useWallet } from './useWallet';
import { useReadContract } from 'wagmi';
import { getStakingContractAddress } from '@/config/contracts';
import StakingABI from '@/contracts/StarYieldStaking.json';
import { formatEther } from 'viem';

const BSC_TESTNET = 97;
const BASE_SEPOLIA = 84532;

// Store claim times in memory (resets on page reload, but better than nothing)
const claimTimestamps: { [key: string]: number } = {};

export const useTransactions = () => {
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prevRewardsClaimed, setPrevRewardsClaimed] = useState<{ [key: string]: number }>({});

  // Fetch stakes from BSC
  const bscAddress = getStakingContractAddress(BSC_TESTNET);
  const { data: bscStakes, isLoading: bscLoading } = useReadContract({
    address: bscAddress as `0xUTF8{string}`,
    abi: StakingABI.abi,
    functionName: 'getUserStakes',
    args: [wallet.address],
    chainId: BSC_TESTNET,
    query: {
      enabled: !!wallet.address,
      refetchInterval: 5000,
    },
  });

  // Fetch stakes from Base
  const baseAddress = getStakingContractAddress(BASE_SEPOLIA);
  const { data: baseStakes, isLoading: baseLoading } = useReadContract({
    address: baseAddress as `0xUTF8{string}`,
    abi: StakingABI.abi,
    functionName: 'getUserStakes',
    args: [wallet.address],
    chainId: BASE_SEPOLIA,
    query: {
      enabled: !!wallet.address,
      refetchInterval: 5000,
    },
  });

  // Convert stakes to transactions
  useEffect(() => {
    console.log('🔍 Transaction Hook - BSC Stakes:', bscStakes);
    console.log('🔍 Transaction Hook - Base Stakes:', baseStakes);
    console.log('🔍 Loading states - BSC:', bscLoading, 'Base:', baseLoading);

    if (bscLoading || baseLoading) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    const txs: Transaction[] = [];

    // Process BSC stakes
    if (bscStakes && Array.isArray(bscStakes)) {
      bscStakes.forEach((stake: any, stakeIndex: number) => {
        console.log(`BSC Stake ${stakeIndex}:`, stake);
        
        const amount = parseFloat(formatEther(stake.amount));
        const rewardsClaimed = parseFloat(formatEther(stake.rewardsClaimed || 0n));
        const startTime = Number(stake.startTime);
        const date = new Date(startTime * 1000).toLocaleDateString();
        const claimKey = `bsc-${stakeIndex}`;

        // Check if rewards increased (new claim detected)
        if (prevRewardsClaimed[claimKey] !== undefined && rewardsClaimed > prevRewardsClaimed[claimKey]) {
          claimTimestamps[claimKey] = Date.now();
        }

        // Add stake transaction
        txs.push({
          id: `bsc-stake-${stakeIndex}`,
          type: 'Stake',
          amount: amount,
          token: 'BNB',
          date: date,
          isPositive: false
        });

        // Add claimed rewards as transactions (always show if > 0, even in All view)
        if (rewardsClaimed > 0) {
          // Use tracked claim time if available, otherwise use stake start time
          const claimDate = claimTimestamps[claimKey] 
            ? new Date(claimTimestamps[claimKey]).toLocaleDateString()
            : date;
          txs.push({
            id: `bsc-claim-${stakeIndex}`,
            type: 'Claimed Earning',
            amount: rewardsClaimed,
            token: 'BNB',
            date: claimDate,
            isPositive: true
          });
        }

        // Add withdrawal transaction if withdrawn
        if (stake.withdrawn) {
          // Use stake start time for withdrawn stakes
          txs.push({
            id: `bsc-unstake-${stakeIndex}`,
            type: 'Unstake',
            amount: amount,
            token: 'BNB',
            date: date,
            isPositive: true
          });
        }
      });
    }

    // Process Base stakes
    if (baseStakes && Array.isArray(baseStakes)) {
      baseStakes.forEach((stake: any, stakeIndex: number) => {
        console.log(`Base Stake ${stakeIndex}:`, stake);
        
        const amount = parseFloat(formatEther(stake.amount));
        const rewardsClaimed = parseFloat(formatEther(stake.rewardsClaimed || 0n));
        const startTime = Number(stake.startTime);
        const date = new Date(startTime * 1000).toLocaleDateString();
        const claimKey = `base-${stakeIndex}`;

        // Check if rewards increased (new claim detected)
        if (prevRewardsClaimed[claimKey] !== undefined && rewardsClaimed > prevRewardsClaimed[claimKey]) {
          claimTimestamps[claimKey] = Date.now();
        }

        // Add stake transaction
        txs.push({
          id: `base-stake-${stakeIndex}`,
          type: 'Stake',
          amount: amount,
          token: 'ETH',
          date: date,
          isPositive: false
        });

        // Add claimed rewards as transactions (always show if > 0, even in All view)
        if (rewardsClaimed > 0) {
          // Use tracked claim time if available, otherwise use stake start time
          const claimDate = claimTimestamps[claimKey]
            ? new Date(claimTimestamps[claimKey]).toLocaleDateString()
            : date;
          txs.push({
            id: `base-claim-${stakeIndex}`,
            type: 'Claimed Earning',
            amount: rewardsClaimed,
            token: 'ETH',
            date: claimDate,
            isPositive: true
          });
        }

        // Add withdrawal transaction if withdrawn
        if (stake.withdrawn) {
          // Use stake start time for withdrawn stakes
          txs.push({
            id: `base-unstake-${stakeIndex}`,
            type: 'Unstake',
            amount: amount,
            token: 'ETH',
            date: date,
            isPositive: true
          });
        }
      });
    }

    // Sort by date descending (newest first)
    txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log('✅ Total transactions created:', txs.length);
    console.log('📊 Transactions:', txs);

    // Update previous rewards claimed for next comparison
    const newPrevRewards: { [key: string]: number } = {};
    if (bscStakes && Array.isArray(bscStakes)) {
      bscStakes.forEach((stake: any, idx: number) => {
        newPrevRewards[`bsc-${idx}`] = parseFloat(formatEther(stake.rewardsClaimed || 0n));
      });
    }
    if (baseStakes && Array.isArray(baseStakes)) {
      baseStakes.forEach((stake: any, idx: number) => {
        newPrevRewards[`base-${idx}`] = parseFloat(formatEther(stake.rewardsClaimed || 0n));
      });
    }
    setPrevRewardsClaimed(newPrevRewards);

    setTransactions(txs);
  }, [bscStakes, baseStakes, bscLoading, baseLoading, prevRewardsClaimed]);

  const getTransactions = async (_userAddress: string, _forceRefresh: boolean = false): Promise<Transaction[]> => {
    return transactions;
  };

  const getFilteredTransactions = async (
    userAddress: string,
    filterType: string
  ): Promise<Transaction[]> => {
    const allTransactions = await getTransactions(userAddress);
    
    if (filterType === 'All Transaction') {
      return allTransactions;
    }
    
    return allTransactions.filter(tx => {
      switch (filterType) {
        case 'Stake':
          return tx.type === 'Stake';
        case 'Unstake':
          return tx.type === 'Unstake';
        case 'Claimed Earning':
          return tx.type === 'Claimed Earning';
        case 'Referral Reward':
          return tx.type === 'Referral Commission';
        default:
          return true;
      }
    });
  };

  return {
    getTransactions,
    getFilteredTransactions,
    isLoading,
    transactions // Expose the transactions array directly
  };
};
