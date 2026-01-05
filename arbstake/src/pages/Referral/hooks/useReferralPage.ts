import { useEffect, useMemo } from 'react';
import { ReferralLevel } from '@/types';
import { useReferral } from '@/hooks/useReferral';
import { useChainId } from 'wagmi';

const BSC_TESTNET = 97;

export const useReferralPage = () => {
  const chainId = useChainId();
  const selectedToken = chainId === BSC_TESTNET ? 'BNB' : 'ETH';
  
  const { stats, referralLink, refetchStats } = useReferral();

  // Define referral level tiers
  const referralLevels: ReferralLevel[] = useMemo(() => {
    const levels = [
      { commission: 5, referralRange: '1-10 Referrals', level: 'Starter', status: 'locked' },
      { commission: 7, referralRange: '11-25 Referrals', level: 'Bronze', status: 'locked' },
      { commission: 10, referralRange: '26-50 Referrals', level: 'Silver', status: 'locked' },
      { commission: 12, referralRange: '51-100 Referrals', level: 'Gold', status: 'locked' },
      { commission: 15, referralRange: '100+ Referrals', level: 'Platinum', status: 'locked' }
    ];

    // Update status based on current referral count
    return levels.map((level, index) => {
      let status: 'locked' | 'active' | 'finished' = 'locked';

      if (level.level === stats.currentLevel) {
        status = 'active';
      } else if (index < levels.findIndex(l => l.level === stats.currentLevel)) {
        status = 'finished';
      }

      return { ...level, status };
    });
  }, [stats.totalReferrals, stats.currentLevel]);

  // Get current level details
  const currentLevel = stats.currentLevel;
  const unclaimedCommission = stats.unclaimedCommission;

  // Build referral stats object for display
  const referralStats = {
    yourReferrals: stats.totalReferrals,
    totalCommission: stats.totalCommission,
    withdrawnCommission: stats.totalCommission - stats.unclaimedCommission,
    earnedXP: stats.totalReferrals * 10, // Simple XP calculation: 10 XP per referral
    unclaimedCommission: stats.unclaimedCommission,
    currentLevel: stats.currentLevel,
    referralLink: referralLink
  };

  const isLoading = false; // useReadContract handles loading state internally

  useEffect(() => {
    // Refetch on mount and when token changes
    refetchStats();
  }, [chainId, refetchStats]);

  return {
    selectedToken,
    referralStats,
    unclaimedCommission,
    currentLevel,
    referralLevels,
    referralLink,
    isLoading,
    refetch: refetchStats,
  };
};
