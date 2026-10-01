export interface BrandConfig {
  name: string;
  logo: string;
  badgeLogo: string;
  tagline: string;
  subheading: string;
  announcements: string[];
  currency: {
    symbol: string;
    code: string;
    locale: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    expressShippingFee: number;
    giftWrapFee: number;
  };
  warranty: {
    durationDays: number;
    durationYears: number;
    title: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    supportHours: string;
    address: string;
  };
  social: {
    instagram: string;
    facebook: string;
    pinterest: string;
    tiktok?: string;
  };
  features: {
    antiTarnish: string;
    waterproof: string;
    hypoallergenic: string;
    material: string;
  };
}

export const brandConfig: BrandConfig = {
  name: 'DREAM WEAR',
  logo: '/images/dream_wear_logo.png',
  badgeLogo: '/images/dream_wear_badge.png',
  tagline: 'Jewelry That Moves With You.',
  subheading: 'Minimal, timeless and made for everyday moments.',
  announcements: [
    '✦ Free Express Shipping on orders above ₹999',
    '✦ 100% Anti-Tarnish 18K Real Gold PVD • 2-Year Color Warranty',
    '✦ Get 10% Off Your First Order with code WELCOME10',
  ],
  currency: {
    symbol: '₹',
    code: 'INR',
    locale: 'en-IN',
  },
  shipping: {
    freeShippingThreshold: 999,
    standardShippingFee: 99,
    expressShippingFee: 199,
    giftWrapFee: 149,
  },
  warranty: {
    durationDays: 730,
    durationYears: 2,
    title: '2-Year Anti-Tarnish & Color Replacement Warranty',
  },
  contact: {
    email: 'concierge@dreamwearjewelry.com',
    phone: '+91 98200 12345',
    whatsapp: '+91 98200 12345',
    supportHours: 'Mon – Sat, 10:00 AM – 7:00 PM IST',
    address: 'Atelier Dream Wear, Linking Road, Bandra West, Mumbai 400050',
  },
  social: {
    instagram: 'https://instagram.com/dreamwear.jewels',
    facebook: 'https://facebook.com/dreamwear.jewels',
    pinterest: 'https://pinterest.com/dreamwearjewels',
  },
  features: {
    antiTarnish: '100% Anti-Tarnish & Sweatproof',
    waterproof: 'Shower, Gym & Ocean Safe',
    hypoallergenic: '316L Surgical Grade Steel (Nickel-Free)',
    material: '18K Real Gold Vacuum PVD Plating',
  },
};


export const formatPrice = (amount: number): string => {
  return `${brandConfig.currency.symbol}${amount.toLocaleString(brandConfig.currency.locale)}`;
};
