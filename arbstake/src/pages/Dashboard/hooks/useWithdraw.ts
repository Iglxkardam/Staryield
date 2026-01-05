import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getStakingContractAddress } from '@/config/contracts';
import StakingABI from '@/contracts/StarYieldStaking.json';
import { useWallet } from '@/hooks/useWallet';

export const useWithdraw = (stakeId?: number) => {
  const { wallet } = useWallet();
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const contractAddress = wallet.chainId ? getStakingContractAddress(wallet.chainId) : undefined;

  const withdraw = async (targetStakeId?: number) => {
    try {
      if (!contractAddress) {
        throw new Error('Contract address not found for this network');
      }

      const idToUse = targetStakeId !== undefined ? targetStakeId : stakeId;
      
      if (idToUse === undefined) {
        throw new Error('Stake ID is required to withdraw');
      }

      console.log('Withdrawing stake ID:', idToUse);
      
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: StakingABI.abi,
        functionName: 'withdraw',
        args: [idToUse],
      });
      
      return true;
    } catch (error) {
      console.error('Error withdrawing:', error);
      return false;
    }
  };

  return {
    withdraw,
    isWithdrawing: isPending || isConfirming,
    isSuccess,
    hash,
  };
};
