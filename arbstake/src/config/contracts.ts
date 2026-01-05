// Reward Pool Addresses - Liquidity pool for payouts
export const REWARD_POOL_ADDRESS = {
  97: '0x259f2AC8BB77E575ADD1B859D7AFc57Eb5CD05D0', // BSC Testnet - DEPLOYED & AUTHORIZED ✅
  84532: '0x1018Ea97C3540d9dB123392705096f5B93cD46C9', // Base Sepolia - DEPLOYED & AUTHORIZED ✅
} as const;

// Staking Contract Addresses - Tracks stakes and calculates rewards
export const STAKING_CONTRACT_ADDRESS = {
  97: '0xC0e13855dEcA38359243c27f10b0106Cf5B96E5D', // BSC Testnet - NEW with StarPoints ✅
  84532: '0x1DaC05A37C42480E723099c8c72C1EaE761eEA2F', // Base Sepolia - NEW with StarPoints ✅
} as const;

// Star Points Contract Addresses - Manages user points system
export const STAR_POINTS_ADDRESS = {
  97: '0x34ecFEBB8C279895E2d21a62c7A1D893Cba77B06', // BSC Testnet - DEPLOYED ✅
  84532: '0x72E88377f4dc0429e52370c1875D927B2B29f89F', // Base Sepolia - FIXED & DEPLOYED ✅
} as const;

// Referral System Contract Addresses - Manages referrals and commissions
export const REFERRAL_SYSTEM_ADDRESS = {
  97: '', // BSC Testnet - PENDING DEPLOYMENT
  84532: '', // Base Sepolia - PENDING DEPLOYMENT
} as const;

export const DEPLOYER_ADDRESS = '0x7dE5877D7e5bb8a1ee28A0c58A04Cc76faD9dD74';

// Network names
export const NETWORK_NAMES = {
  97: 'BSC Testnet',
  84532: 'Base Sepolia',
} as const;

// Block explorers
export const BLOCK_EXPLORERS = {
  97: 'https://testnet.bscscan.com',
  84532: 'https://sepolia.basescan.org',
} as const;

// Get contract address for current chain
export function getStakingContractAddress(chainId: number): string | undefined {
  return STAKING_CONTRACT_ADDRESS[chainId as keyof typeof STAKING_CONTRACT_ADDRESS];
}

// Get reward pool address for current chain
export function getRewardPoolAddress(chainId: number): string | undefined {
  return REWARD_POOL_ADDRESS[chainId as keyof typeof REWARD_POOL_ADDRESS];
}

// Get star points address for current chain
export function getStarPointsAddress(chainId: number): string | undefined {
  return STAR_POINTS_ADDRESS[chainId as keyof typeof STAR_POINTS_ADDRESS];
}

// Get referral system address for current chain
export function getReferralSystemAddress(chainId: number): string | undefined {
  return REFERRAL_SYSTEM_ADDRESS[chainId as keyof typeof REFERRAL_SYSTEM_ADDRESS];
}

// Get block explorer URL
export function getBlockExplorerUrl(chainId: number, address: string): string {
  const explorer = BLOCK_EXPLORERS[chainId as keyof typeof BLOCK_EXPLORERS];
  return `${explorer}/address/${address}`;
}
