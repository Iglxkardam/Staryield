import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getStakingContractAddress } from '@/config/contracts';
import StakingABI from '@/contracts/StarYieldStaking.json';
import { useWallet } from '@/hooks/useWallet';

export const useClaimRewards = (stakeId?: number) => {
  const { wallet } = useWallet();
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const contractAddress = wallet.chainId ? getStakingContractAddress(wallet.chainId) : undefined;

  const claimRewards = async (targetStakeId?: number) => {
    try {
      if (!contractAddress) {
        throw new Error('Contract address not found for this network');
      }

      const idToUse = targetStakeId !== undefined ? targetStakeId : stakeId;
      
      if (idToUse === undefined) {
        throw new Error('Stake ID is required to claim rewards');
      }

      console.log('Claiming rewards for stake ID:', idToUse);
      
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: StakingABI.abi,
        functionName: 'claimRewards',
        args: [idToUse],
      });
      
      return true;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      return false;
    }
  };

  return {
    claimRewards,
    isClaiming: isPending || isConfirming,
    isSuccess,
    hash,
  };
};
