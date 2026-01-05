import { useState } from 'react';
import { useWallet } from './useWallet';
import { useWriteContract, useReadContract, useChainId } from 'wagmi';
import { getReferralSystemAddress } from '@/config/contracts';
import ReferralSystemABI from '@/contracts/ReferralSystem.json';
import { formatEther } from 'viem';
import { isAddress } from 'viem';

const BSC_TESTNET = 97;

export const useReferral = () => {
  const { wallet } = useWallet();
  const chainId = useChainId();
  const [isClaimingCommission, setIsClaimingCommission] = useState(false);
  const [isSettingReferrer, setIsSettingReferrer] = useState(false);

  const { writeContractAsync } = useWriteContract();

  // Get referral contract address for current chain
  const referralAddress = getReferralSystemAddress(chainId);

  // Set referrer (one-time only)
  const setReferrer = async (referrerAddress: string) => {
    if (!referralAddress) {
      throw new Error('Referral system not deployed on this network');
    }

    if (!isAddress(referrerAddress)) {
      throw new Error('Invalid referrer address');
    }

    try {
      setIsSettingReferrer(true);

      const hash = await writeContractAsync({
        address: referralAddress as `0x${string}`,
        abi: ReferralSystemABI.abi,
        functionName: 'setReferrer',
        args: [referrerAddress],
      });

      console.log('✅ Referrer set transaction:', hash);
      return { success: true, hash };
    } catch (error: any) {
      console.error('❌ Error setting referrer:', error);
      throw new Error(error.message || 'Failed to set referrer');
    } finally {
      setIsSettingReferrer(false);
    }
  };

  // Check if user has referrer
  const { data: hasReferrerData, refetch: refetchHasReferrer } = useReadContract({
    address: referralAddress as `0x${string}`,
    abi: ReferralSystemABI.abi,
    functionName: 'hasReferrer',
    args: [wallet.address],
    query: {
      enabled: !!wallet.address && !!referralAddress,
    },
  });

  // Get user's referrer
  const { data: referrerData } = useReadContract({
    address: referralAddress as `0x${string}`,
    abi: ReferralSystemABI.abi,
    functionName: 'getReferrer',
    args: [wallet.address],
    query: {
      enabled: !!wallet.address && !!referralAddress,
    },
  });

  // Get referral stats for current token (BNB or ETH)
  const tokenAddress = chainId === BSC_TESTNET ? '0x0000000000000000000000000000000000000000' : '0x0000000000000000000000000000000000000000';
  
  const { data: referralStatsData, refetch: refetchStats } = useReadContract({
    address: referralAddress as `0x${string}`,
    abi: ReferralSystemABI.abi,
    functionName: 'getReferralStats',
    args: [wallet.address, tokenAddress],
    query: {
      enabled: !!wallet.address && !!referralAddress,
      refetchInterval: 5000,
    },
  });

  // Claim commission
  const claimCommission = async () => {
    if (!referralAddress) {
      throw new Error('Referral system not deployed on this network');
    }

    try {
      setIsClaimingCommission(true);

      const hash = await writeContractAsync({
        address: referralAddress as `0x${string}`,
        abi: ReferralSystemABI.abi,
        functionName: 'claimCommission',
        args: [tokenAddress],
      });

      console.log('✅ Commission claimed transaction:', hash);
      
      // Refetch stats after claiming
      setTimeout(() => {
        refetchStats();
      }, 2000);

      return { success: true, hash };
    } catch (error: any) {
      console.error('❌ Error claiming commission:', error);
      throw new Error(error.message || 'Failed to claim commission');
    } finally {
      setIsClaimingCommission(false);
    }
  };

  // Parse referral stats
  const parseReferralStats = () => {
    if (!referralStatsData) {
      return {
        totalReferrals: 0,
        currentLevel: 'None',
        commissionRate: 0,
        totalCommission: 0,
        unclaimedCommission: 0,
        referredUsers: [],
      };
    }

    const [totalReferrals, currentLevel, commissionRate, totalCommission, unclaimedCommission, referredUsers] = referralStatsData as [
      bigint,
      string,
      bigint,
      bigint,
      bigint,
      string[]
    ];

    return {
      totalReferrals: Number(totalReferrals),
      currentLevel,
      commissionRate: Number(commissionRate) / 100, // Convert basis points to percentage
      totalCommission: parseFloat(formatEther(totalCommission)),
      unclaimedCommission: parseFloat(formatEther(unclaimedCommission)),
      referredUsers,
    };
  };

  // Generate referral link
  const getReferralLink = (): string => {
    if (!wallet.address) return '';
    return `${window.location.origin}?ref=${wallet.address}`;
  };

  return {
    setReferrer,
    claimCommission,
    hasReferrer: Boolean(hasReferrerData),
    referrer: referrerData as string | undefined,
    stats: parseReferralStats(),
    referralLink: getReferralLink(),
    isClaimingCommission,
    isSettingReferrer,
    refetchStats,
    refetchHasReferrer,
  };
};
