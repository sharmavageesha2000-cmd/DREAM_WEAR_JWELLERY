import { brandConfig } from '../config/brandConfig';

export const formatINR = (amount: number): string => {
  return `${brandConfig.currency.symbol}${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (isoString: string): string => {
  try {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
