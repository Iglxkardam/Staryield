// Utility functions for the application

/**
 * Format a number with comma separators
 */
export const formatNumber = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Shorten wallet address for display
 */
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

/**
 * Format token amount with proper decimals
 */
export const formatTokenAmount = (amount: number, decimals = 4): string => {
  return amount.toFixed(decimals);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  
  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3) ? 0 : (day % 100 - day % 10 !== 10 ? day % 10 : 0)];
  
  return `${day}${suffix} ${month}, ${year}`;
};

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Convert Wei to Ether (or equivalent)
 */
export const weiToEther = (wei: string | number): number => {
  return Number(wei) / 1e18;
};

/**
 * Convert Ether to Wei (or equivalent)
 */
export const etherToWei = (ether: string | number): string => {
  return (Number(ether) * 1e18).toString();
};

/**
 * Get referral link with user address
 */
export const getReferralLink = (userAddress: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/refer/${userAddress}`;
};

/**
 * Parse referral code from URL
 */
export const parseReferralCode = (): string | null => {
  const path = window.location.pathname;
  const match = path.match(/\/refer\/(.+)/);
  return match ? match[1] : null;
};
