// Smart contract configuration constants

// Replace these with your actual contract addresses
export const CONTRACTS = {
  STAKING: '0x0000000000000000000000000000000000000000',
  REFERRAL: '0x0000000000000000000000000000000000000000',
  BNB_TOKEN: '0x0000000000000000000000000000000000000000',
  TRX_TOKEN: '0x0000000000000000000000000000000000000000',
  USDT_TOKEN: '0x0000000000000000000000000000000000000000',
};

// Network configurations
export const NETWORKS = {
  BSC_MAINNET: {
    chainId: '0x38', // 56 in hex
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  BSC_TESTNET: {
    chainId: '0x61', // 97 in hex
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
};

// Token configurations
export const TOKENS = {
  BNB: {
    symbol: 'BNB',
    name: 'Binance Coin',
    decimals: 18,
    icon: '/images/bnb.png',
    address: CONTRACTS.BNB_TOKEN,
  },
  TRX: {
    symbol: 'TRX',
    name: 'TRON',
    decimals: 6,
    icon: '/images/trx.png',
    address: CONTRACTS.TRX_TOKEN,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    icon: '/images/usdt-logo.png',
    address: CONTRACTS.USDT_TOKEN,
  },
};

// Staking tier configurations
export const STAKING_TIERS = {
  COMET: {
    id: 1,
    name: 'Comet Tier',
    apy: 1095,
    dailyRate: 3,
    lockPeriod: 14,
    minInvestment: 0.1,
  },
  METEOR: {
    id: 2,
    name: 'Meteor Tier',
    apy: 1825,
    dailyRate: 5,
    lockPeriod: 21,
    minInvestment: 1,
  },
  SUPERNOVA: {
    id: 3,
    name: 'Supernova Tier',
    apy: 2555,
    dailyRate: 7,
    lockPeriod: 30,
    minInvestment: 5,
  },
};

// Referral level configurations
export const REFERRAL_LEVELS = {
  STARTER: {
    name: 'Starter',
    commission: 5,
    minReferrals: 1,
    maxReferrals: 10,
  },
  BRONZE: {
    name: 'Bronze',
    commission: 7,
    minReferrals: 11,
    maxReferrals: 25,
  },
  SILVER: {
    name: 'Silver',
    commission: 10,
    minReferrals: 26,
    maxReferrals: 50,
  },
  GOLD: {
    name: 'Gold',
    commission: 12,
    minReferrals: 51,
    maxReferrals: 100,
  },
  PLATINUM: {
    name: 'Platinum',
    commission: 15,
    minReferrals: 101,
    maxReferrals: Infinity,
  },
};

// Application settings
export const APP_CONFIG = {
  appName: 'StarYield',
  baseUrl: 'https://staryield.com',
  supportEmail: 'support@staryield.com',
  socialLinks: {
    twitter: '#',
    telegram: '#',
    discord: '#',
  },
};
