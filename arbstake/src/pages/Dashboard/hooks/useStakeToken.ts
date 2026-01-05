import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { getStakingContractAddress } from '@/config/contracts';
import StakingABI from '@/contracts/StarYieldStaking.json';
import { useWallet } from '@/hooks/useWallet';

export const useStakeToken = () => {
  const { wallet } = useWallet();
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const contractAddress = wallet.chainId ? getStakingContractAddress(wallet.chainId) : undefined;

  const approveToken = async (_amount: string) => {
    try {
      // For BNB/ETH staking, no approval needed (native currency)
      // For ERC20 tokens, implement approval here
      console.log('Token approval for BNB/ETH not needed');
      return true;
    } catch (error) {
      console.error('Error approving token:', error);
      return false;
    }
  };

  const stake = async (amount: string, tierId: number) => {
    try {
      if (!contractAddress) {
        throw new Error('Contract address not found for this network');
      }

      console.log('Staking:', amount, 'in tier', tierId);
      
      // Stake BNB/ETH (native currency)
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: StakingABI.abi,
        functionName: 'stakeBNB',
        args: [tierId],
        value: parseEther(amount),
      });
      
      return true;
    } catch (error) {
      console.error('Error staking:', error);
      return false;
    }
  };

  return {
    approveToken,
    stake,
    isApproving: false, // No approval needed for BNB/ETH
    isStaking: isPending || isConfirming,
    isSuccess,
    hash,
  };
};
