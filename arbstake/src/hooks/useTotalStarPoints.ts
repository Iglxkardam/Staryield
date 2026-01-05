import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { getStarPointsAddress } from '@/config/contracts';
import StarPointsABI from '@/contracts/StarPoints.json';

const BSC_TESTNET = 97;
const BASE_SEPOLIA = 84532;

export function useTotalStarPoints() {
  const { address, isConnected } = useAccount();
  const [totalPoints, setTotalPoints] = useState<bigint>(BigInt(0));

  // Fetch points from BSC Testnet
  const { data: bscPoints } = useReadContract({
    address: getStarPointsAddress(BSC_TESTNET) as `0x${string}`,
    abi: StarPointsABI.abi,
    functionName: 'getUserTotalPoints',
    args: address ? [address] : undefined,
    chainId: BSC_TESTNET,
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Fetch points from Base Sepolia
  const { data: basePoints } = useReadContract({
    address: getStarPointsAddress(BASE_SEPOLIA) as `0x${string}`,
    abi: StarPointsABI.abi,
    functionName: 'getUserTotalPoints',
    args: address ? [address] : undefined,
    chainId: BASE_SEPOLIA,
    query: {
      enabled: isConnected && !!address,
    },
  });

  useEffect(() => {
    const bsc = (bscPoints as bigint) || BigInt(0);
    const base = (basePoints as bigint) || BigInt(0);
    const total = bsc + base;
    
    setTotalPoints(total);
  }, [bscPoints, basePoints]);

  return {
    totalPoints,
    bscPoints: (bscPoints as bigint) || BigInt(0),
    basePoints: (basePoints as bigint) || BigInt(0),
  };
}
