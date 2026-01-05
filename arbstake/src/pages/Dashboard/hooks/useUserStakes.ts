import { useWallet } from '@/hooks/useWallet';
import { useReadContract } from 'wagmi';
import { getStakingContractAddress } from '@/config/contracts';
import StakingABI from '@/contracts/StarYieldStaking.json';

export const useUserStakes = () => {
  const { wallet } = useWallet();
  const contractAddress = wallet.chainId ? getStakingContractAddress(wallet.chainId) : undefined;

  const { data: userStakesData, refetch, isLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: StakingABI.abi,
    functionName: 'getUserStakes',
    args: [wallet.address],
    query: {
      enabled: !!wallet.address && !!contractAddress && wallet.isConnected,
      refetchInterval: 3000, // Auto-refresh every 3 seconds
    },
  });

  return {
    userStakesData,
    refetch,
    isLoading,
  };
};
