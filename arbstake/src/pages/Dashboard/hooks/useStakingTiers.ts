import { StakingTier } from '@/types';
import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { getStakingContractAddress } from '@/config/contracts';
import StakingABI from '@/contracts/StarYieldStaking.json';
import { useWallet } from '@/hooks/useWallet';
import { formatEther } from 'viem';

export const useStakingTiers = () => {
  const { wallet } = useWallet();
  const [tiers, setTiers] = useState<StakingTier[]>([]);

  const contractAddress = wallet.chainId ? getStakingContractAddress(wallet.chainId) : undefined;

  // Read tier 0 (COMET) - refetch every 3 seconds
  const { data: tier0Data } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'tierInfo',
    args: [0],
    query: {
      enabled: !!contractAddress,
      refetchInterval: 3000, // Auto-refresh when admin updates tiers
    },
  });

  // Read tier 1 (METEOR)
  const { data: tier1Data } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'tierInfo',
    args: [1],
    query: {
      enabled: !!contractAddress,
      refetchInterval: 3000,
    },
  });

  // Read tier 2 (SUPERNOVA)
  const { data: tier2Data } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'tierInfo',
    args: [2],
    query: {
      enabled: !!contractAddress,
      refetchInterval: 3000,
    },
  });

  // Read user stakes to calculate "You Staked" for each tier
  const { data: userStakesData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'getUserStakes',
    args: [wallet.address],
    query: {
      enabled: !!wallet.address && !!contractAddress && wallet.isConnected,
      refetchInterval: 3000, // Auto-refresh when user stakes or withdraws
    },
  });

  useEffect(() => {
    if (!tier0Data || !tier1Data || !tier2Data) {
      return;
    }

    // Calculate how much user has staked in each tier
    let tier0Staked = 0;
    let tier1Staked = 0;
    let tier2Staked = 0;

    if (userStakesData && Array.isArray(userStakesData)) {
      userStakesData.forEach((stake: { tier: bigint; amount: bigint; withdrawn: boolean }) => {
        if (!stake.withdrawn) {
          const amount = parseFloat(formatEther(stake.amount));
          if (stake.tier === 0n) tier0Staked += amount;
          else if (stake.tier === 1n) tier1Staked += amount;
          else if (stake.tier === 2n) tier2Staked += amount;
        }
      });
    }

    const parseTierData = (tierData: readonly [bigint, bigint, bigint], tierId: number, name: string, tierNum: string, youStaked: number): StakingTier => {
      // tierData is a tuple: [lockingPeriod, minInvestment, apyRate]
      const lockingPeriod = Number(tierData[0]) / 86400; // Convert seconds to days
      const minInvestment = parseFloat(formatEther(tierData[1]));
      const apyRate = Number(tierData[2]) / 100; // Convert basis points to percentage
      const dailyRate = (apyRate / 365).toFixed(2); // Calculate daily rate

      console.log(`🔧 Tier ${tierId} (${name}) parsed:`, {
        lockingPeriod: `${lockingPeriod} days`,
        minInvestment: `${minInvestment} tokens`,
        apyRate: `${apyRate}%`,
        rawData: {
          lockingPeriod: tierData[0].toString(),
          minInvestment: tierData[1].toString(),
          apyRate: tierData[2].toString()
        }
      });

      return {
        id: tierId,
        name,
        tier: tierNum,
        youStaked,
        apy: `${apyRate.toFixed(0)}%`,
        apyRateBasisPoints: Number(tierData[2]), // Store raw basis points for calculations
        lockedPeriod: Math.round(lockingPeriod),
        minInvestment,
        dailyRate: `${dailyRate}%`
      };
    };

    setTiers([
      parseTierData(tier0Data as readonly [bigint, bigint, bigint], 0, 'Comet Tier', '1', tier0Staked),
      parseTierData(tier1Data as readonly [bigint, bigint, bigint], 1, 'Meteor Tier', '2', tier1Staked),
      parseTierData(tier2Data as readonly [bigint, bigint, bigint], 2, 'Supernova Tier', '3', tier2Staked),
    ]);
  }, [tier0Data, tier1Data, tier2Data, userStakesData]);

  const fetchTiersData = async () => {
    // Data is automatically fetched by wagmi hooks
    console.log('Tier data is auto-fetched from contract');
  };

  return {
    tiers,
    refetch: fetchTiersData,
  };
};
