import { useState, useEffect } from 'react';
import { PortfolioStats, LoyaltyPoints } from '@/types';
import { useWallet } from '@/hooks/useWallet';
import { useReadContract } from 'wagmi';
import { getStakingContractAddress } from '@/config/contracts';
import StakingABI from '@/contracts/StarYieldStaking.json';
import { formatEther } from 'viem';
import { useStakingTiers } from './useStakingTiers';
import { useTotalStarPoints } from '@/hooks/useTotalStarPoints';

export const useDashboard = () => {
  const { wallet } = useWallet();
  const [selectedToken, setSelectedToken] = useState<string>('BNB');
  const [isLoading, setIsLoading] = useState(false);
  const { tiers } = useStakingTiers(); // Get real tier data with actual APY rates
  
  const contractAddress = wallet.chainId ? getStakingContractAddress(wallet.chainId) : undefined;

  // Read user stakes from contract - refetch more frequently
  const { data: userStakesData, refetch: refetchStakes } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'getUserStakes',
    args: [wallet.address],
    query: {
      enabled: !!wallet.address && !!contractAddress && wallet.isConnected,
      refetchInterval: 3000, // Refetch every 3 seconds for real-time updates
    },
  });

  // Total staked is calculated from userStakesData
  
  // Calculate portfolio stats from real contract data
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalStaked: 0,
    totalEarned: 0,
    activeStaking: 0,
    withdrawnEarning: 0,
  });

  // Calculate unclaimed earnings from all active stakes
  const [unclaimedEarnings, setUnclaimedEarnings] = useState<number>(0);

  // Get star points from both chains
  const { totalPoints } = useTotalStarPoints();
  
  const loyaltyPoints: LoyaltyPoints = {
    totalStars: Number(totalPoints),
    starsFromStaking: Number(totalPoints), // All points come from staking for now
    starsFromReferrals: 0, // TODO: Implement referral points
    referrals: 0, // TODO: Implement referral tracking
  };

  // Calculate unclaimed earnings
  useEffect(() => {
    if (!userStakesData || !Array.isArray(userStakesData)) {
      setUnclaimedEarnings(0);
      return;
    }

    const calculateTotalRewards = () => {
      try {
        let totalRewards = 0;

        console.log('📊 Calculating rewards for', userStakesData?.length || 0, 'stakes');
        console.log('🔗 Chain ID:', wallet.chainId, '| Tiers loaded:', tiers.length);

        // Iterate through all active stakes and calculate pending rewards
        userStakesData.forEach((stake: any, index: number) => {
          console.log(`Stake ${index}:`, {
            withdrawn: stake.withdrawn,
            amount: formatEther(stake.amount),
            tier: stake.tier?.toString(),
            startTime: stake.startTime?.toString(),
            rewardsClaimed: formatEther(stake.rewardsClaimed || 0n)
          });

          if (!stake.withdrawn) {
            const startTime = Number(stake.startTime);
            const now = Math.floor(Date.now() / 1000);
            const stakingDuration = BigInt(now - startTime);
            
            // Get tier APY from actual contract data (stored in basis points)
            const tierIndex = Number(stake.tier);
            const tierData = tiers[tierIndex];
            const apyRate = BigInt(tierData?.apyRateBasisPoints || 600); // Use real contract APY or fallback to 600
            
            // Calculate rewards using EXACT contract formula with BigInt precision
            // Formula: (amount * apyRate * stakingDuration) / (365 days * 10000)
            const SECONDS_PER_YEAR = 365n * 24n * 60n * 60n; // 31536000
            const BASIS_POINTS_DIVISOR = 10000n;
            
            const totalRewardsWei = (stake.amount * apyRate * stakingDuration) / (SECONDS_PER_YEAR * BASIS_POINTS_DIVISOR);
            const rewardsClaimedWei = stake.rewardsClaimed || 0n;
            const pendingRewardsWei = totalRewardsWei > rewardsClaimedWei ? totalRewardsWei - rewardsClaimedWei : 0n;
            
            // Convert to float for display and summation
            const pendingRewards = parseFloat(formatEther(pendingRewardsWei));
            
            console.log(`💰 Stake ${index} rewards:`, {
              amount: formatEther(stake.amount),
              apyRate: apyRate.toString(),
              stakingDuration: `${stakingDuration}s (${(Number(stakingDuration)/86400).toFixed(2)} days)`,
              totalRewardsWei: totalRewardsWei.toString(),
              rewardsClaimedWei: rewardsClaimedWei.toString(),
              pendingRewardsWei: pendingRewardsWei.toString(),
              pendingRewards: pendingRewards.toFixed(8)
            });
            
            totalRewards += pendingRewards;
          }
        });

        console.log('✅ Total unclaimed earnings:', totalRewards.toFixed(8));
        setUnclaimedEarnings(totalRewards);
      } catch (error) {
        console.error('❌ Error calculating rewards:', error);
        setUnclaimedEarnings(0);
      }
    };

    calculateTotalRewards();
    
    // Recalculate every second for real-time updates
    const interval = setInterval(calculateTotalRewards, 1000);
    return () => clearInterval(interval);
  }, [userStakesData, tiers, wallet.chainId]);

  const handleTokenSwitch = (token: string) => {
    setSelectedToken(token);
    // Refetch data for new token
    fetchDashboardData(token);
  };

  const fetchDashboardData = async (token: string = selectedToken) => {
    try {
      setIsLoading(true);
      
      // TODO: Implement fetching dashboard data from smart contract
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const userAddress = await signer.getAddress();
      // 
      // const stakingContract = new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, provider);
      // const stats = await stakingContract.getUserStats(userAddress, token);
      // const unclaimed = await stakingContract.getUnclaimedRewards(userAddress);
      // const loyalty = await stakingContract.getLoyaltyPoints(userAddress);
      
      console.log('Fetching dashboard data for token:', token);
      
      // For now using static data
      // In production, replace with actual contract calls
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update portfolio stats when contract data changes
  useEffect(() => {
    if (!userStakesData || !Array.isArray(userStakesData)) {
      setPortfolioStats({
        totalStaked: 0,
        totalEarned: 0,
        activeStaking: 0,
        withdrawnEarning: 0,
      });
      return;
    }

    let totalStaked = 0;
    let totalEarned = 0;
    let activeStaking = 0;
    let withdrawnAmount = 0;

    // Calculate stats from user stakes
    userStakesData.forEach((stake: { withdrawn: boolean; amount: bigint; rewardsClaimed: bigint }) => {
      const amount = parseFloat(formatEther(stake.amount));
      const rewardsClaimed = parseFloat(formatEther(stake.rewardsClaimed || 0n));

      if (!stake.withdrawn) {
        activeStaking += amount;
        totalStaked += amount;
      } else {
        withdrawnAmount += amount;
      }

      totalEarned += rewardsClaimed;
    });

    setPortfolioStats({
      totalStaked,
      totalEarned,
      activeStaking,
      withdrawnEarning: totalEarned, // Total claimed rewards
    });
  }, [userStakesData]);

  // Auto-switch token based on connected chain
  useEffect(() => {
    if (wallet.chainId === 97 || wallet.chainId === 56) { // BSC Testnet or Mainnet
      setSelectedToken('BNB');
    } else if (wallet.chainId === 84532 || wallet.chainId === 8453) { // Base Sepolia or Mainnet
      setSelectedToken('ETH');
    }
  }, [wallet.chainId]);

  // Listen for window focus to refetch data
  useEffect(() => {
    const handleFocus = () => {
      if (wallet.isConnected) {
        refetchStakes();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [wallet.isConnected, refetchStakes]);

  useEffect(() => {
    if (wallet.isConnected) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.isConnected]);

  return {
    selectedToken,
    handleTokenSwitch,
    portfolioStats,
    unclaimedEarnings,
    loyaltyPoints,
    isLoading,
    refetch: () => {
      refetchStakes();
      fetchDashboardData();
    },
  };
};
