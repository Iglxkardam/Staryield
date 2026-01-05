import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { getStarPointsAddress } from '@/config/contracts';
import StarPointsABI from '@/contracts/StarPoints.json';

export interface StakePointsInfo {
  totalPoints: bigint;
  pendingPoints: bigint;
  lastClaimTime: bigint;
  stakeAmount: bigint;
  stakeStartTime: bigint;
  active: boolean;
  nextClaimTime: bigint;
}

export function useStarPoints() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [totalPoints, setTotalPoints] = useState<bigint>(BigInt(0));

  const starPointsAddress = getStarPointsAddress(chainId);

  // Read user's total star points
  const { data: userPoints, refetch: refetchPoints } = useReadContract({
    address: starPointsAddress as `0x${string}`,
    abi: StarPointsABI.abi,
    functionName: 'getUserTotalPoints',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!starPointsAddress,
    },
  });

  useEffect(() => {
    if (userPoints) {
      setTotalPoints(userPoints as bigint);
    }
  }, [userPoints]);

  return {
    totalPoints,
    refetchPoints,
  };
}

export function useStakePoints(stakeId: number) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const starPointsAddress = getStarPointsAddress(chainId);

  // Read specific stake points info
  const { data: stakePointsInfo, refetch: refetchStakePoints } = useReadContract({
    address: starPointsAddress as `0x${string}`,
    abi: StarPointsABI.abi,
    functionName: 'getStakePointsInfo',
    args: address && stakeId !== undefined ? [address, BigInt(stakeId)] : undefined,
    query: {
      enabled: isConnected && !!address && stakeId !== undefined && !!starPointsAddress,
    },
  });

  const formatStakePoints = (): StakePointsInfo | null => {
    if (!stakePointsInfo || !Array.isArray(stakePointsInfo)) return null;

    return {
      totalPoints: stakePointsInfo[0] as bigint,
      pendingPoints: stakePointsInfo[1] as bigint,
      lastClaimTime: stakePointsInfo[2] as bigint,
      stakeAmount: stakePointsInfo[3] as bigint,
      stakeStartTime: stakePointsInfo[4] as bigint,
      active: stakePointsInfo[5] as boolean,
      nextClaimTime: stakePointsInfo[6] as bigint,
    };
  };

  return {
    stakePointsInfo: formatStakePoints(),
    refetchStakePoints,
  };
}

export function useAllStakesPoints(_activeStakeIds?: number[]) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [totalWithPending, setTotalWithPending] = useState<bigint>(BigInt(0));
  const starPointsAddress = getStarPointsAddress(chainId);

  // Read user's total points (already claimed)
  const { data: userPoints, refetch } = useReadContract({
    address: starPointsAddress as `0x${string}`,
    abi: StarPointsABI.abi,
    functionName: 'getUserTotalPoints',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !!starPointsAddress,
    },
  });

  // For now, return just the claimed points
  // Multi-contract reads would need to be done separately for each stake
  useEffect(() => {
    if (userPoints) {
      setTotalWithPending(userPoints as bigint);
    }
  }, [userPoints]);

  return {
    totalWithPending,
    totalClaimed: userPoints as bigint || BigInt(0),
    refetch,
  };
}

// Helper to format points for display (1000 points = 1 ETH worth)
export function formatPoints(points: bigint): string {
  const pointsNum = Number(points);
  if (pointsNum >= 1000000) {
    return `${(pointsNum / 1000000).toFixed(2)}M`;
  } else if (pointsNum >= 1000) {
    return `${(pointsNum / 1000).toFixed(2)}K`;
  }
  return pointsNum.toString();
}

// Calculate days until next point claim
export function getDaysUntilNextClaim(nextClaimTime: bigint): number {
  const now = Math.floor(Date.now() / 1000);
  const nextClaim = Number(nextClaimTime);
  
  if (nextClaim <= now) return 0;
  
  const secondsRemaining = nextClaim - now;
  return Math.ceil(secondsRemaining / (24 * 60 * 60));
}
