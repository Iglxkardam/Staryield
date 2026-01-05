import { useReferral } from '@/hooks/useReferral';
import { useNotification } from '@/hooks/useNotification';

export const useClaimCommission = () => {
  const { claimCommission: claimFromContract, isClaimingCommission } = useReferral();
  const { showNotification } = useNotification();

  const claimCommission = async () => {
    try {
      const result = await claimFromContract();
      if (result.success) {
        showNotification('Commission claimed successfully! 🎉', 'success');
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to claim commission';
      showNotification(errorMessage, 'error');
      return false;
    }
  };

  return {
    claimCommission,
    isClaiming: isClaimingCommission,
  };
};
