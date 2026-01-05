export interface StatData {
  totalValueLocked: number;
  totalStakers: number;
  totalPayouts: number;
}

export interface StakingTier {
  id: number;
  name: string;
  tier: string;
  youStaked: number;
  apy: string;
  apyRateBasisPoints: number; // Raw APY rate in basis points (e.g., 600 = 6%, 1090000 = 10900%)
  lockedPeriod: number;
  minInvestment: number;
  dailyRate: string;
}

export interface PortfolioStats {
  totalStaked: number;
  totalEarned: number;
  activeStaking: number;
  withdrawnEarning: number;
}

export interface LoyaltyPoints {
  totalStars: number;
  starsFromStaking: number;
  starsFromReferrals: number;
  referrals: number;
}

export interface ReferralStats {
  yourReferrals: number;
  totalCommission: number;
  withdrawnCommission: number;
  earnedXP: number;
  unclaimedCommission: number;
  currentLevel: string;
  referralLink: string;
}

export interface ReferralLevel {
  commission: number;
  referralRange: string;
  level: string;
  status: 'finished' | 'active' | 'locked';
}

export interface Transaction {
  id: string;
  amount: number;
  token: string;
  type: 'Stake' | 'Unstake' | 'Referral Commission' | 'Withdrawal' | 'Earnings' | 'Claimed Earning';
  date: string;
  isPositive: boolean;
}

export type TransactionFilter = 'All Transaction' | 'Stake' | 'Unstake' | 'Claimed Earning' | 'Referral Reward';

export interface Token {
  symbol: string;
  name: string;
  icon: string;
}

export interface WalletConnection {
  address: string | null;
  isConnected: boolean;
  balance: number;
  selectedToken: Token;
  chainId?: number;
  chainName?: string;
}
