import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { getStakingContractAddress } from '@/config/contracts';
import StakingABI from '@/contracts/StarYieldStaking.json';

export const useStakingContract = (chainId?: number) => {
  const contractAddress = chainId ? getStakingContractAddress(chainId) : undefined;

  // Read total staked by user
  const { data: totalStakedByUser } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'totalStakedByUser',
    args: [],
  });

  // Read user stakes
  const { data: userStakes } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'getUserStakes',
    args: [],
  });

  // Write functions
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Stake BNB/ETH
  const stakeBNB = async (tier: number, amount: string) => {
    if (!contractAddress) return;
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: StakingABI.abi,
      functionName: 'stakeBNB',
      args: [tier],
      value: parseEther(amount),
    });
  };

  // Claim rewards
  const claimRewards = async (stakeId: number) => {
    if (!contractAddress) return;
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: StakingABI.abi,
      functionName: 'claimRewards',
      args: [stakeId],
    });
  };

  // Withdraw stake
  const withdraw = async (stakeId: number) => {
    if (!contractAddress) return;
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: StakingABI.abi,
      functionName: 'withdraw',
      args: [stakeId],
    });
  };

  return {
    contractAddress,
    totalStakedByUser,
    userStakes,
    stakeBNB,
    claimRewards,
    withdraw,
    isLoading: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
  };
};

// Hook to get stake details
export const useStakeDetails = (userAddress?: string, stakeId?: number, chainId?: number) => {
  const contractAddress = chainId ? getStakingContractAddress(chainId) : undefined;

  const { data: stakeDetails } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'getStakeDetails',
    args: [userAddress, stakeId],
    query: {
      enabled: !!userAddress && stakeId !== undefined && !!contractAddress,
    },
  });

  return {
    stakeDetails,
  };
};

// Hook to calculate rewards
export const useCalculateRewards = (userAddress?: string, stakeId?: number, chainId?: number) => {
  const contractAddress = chainId ? getStakingContractAddress(chainId) : undefined;

  const { data: rewards, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'calculateRewards',
    args: [userAddress, stakeId],
    query: {
      enabled: !!userAddress && stakeId !== undefined && !!contractAddress,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  return {
    rewards,
    refetchRewards: refetch,
  };
};

// Hook to check if user can withdraw
export const useCanWithdraw = (userAddress?: string, stakeId?: number, chainId?: number) => {
  const contractAddress = chainId ? getStakingContractAddress(chainId) : undefined;

  const { data: canWithdraw } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'canWithdraw',
    args: [userAddress, stakeId],
    query: {
      enabled: !!userAddress && stakeId !== undefined && !!contractAddress,
    },
  });

  return {
    canWithdraw,
  };
};
