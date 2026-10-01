export type ProductCategory = 
  | 'necklaces' 
  | 'earrings' 
  | 'rings' 
  | 'bracelets' 
  | 'sets'
  | 'anklets'
  | 'nose-pins'
  | 'toe-rings';


export type ProductFinish = '18K Yellow Gold' | '18K Rose Gold' | 'Silver Rhodium' | 'Tri-Color (Gold, Silver, Rose)';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryName: string;
  collection?: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  isNew: boolean;
  isBestSeller: boolean;
  isAntiTarnish: boolean;
  isWaterproof: boolean;
  isHypoallergenic?: boolean;
  material: string;
  baseMetal: string;
  coating: string;
  finishes: ProductFinish[];
  availableSizes?: string[];
  dimensions?: string;
  weight?: string;
  description: string;
  features: string[];
  careInstructions: string[];
  inStock: boolean;
  stockCount?: number;
  sku: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFinish: ProductFinish;
  selectedSize?: string;
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  author: string;
  location?: string;
  avatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  likes?: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  finish: ProductFinish;
  size?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  shippingMethod: 'standard' | 'express' | string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod' | string;
  paymentStatus: 'paid' | 'pending' | string;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
  trackingNumber: string;
  estimatedDelivery?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  savedAddresses: Address[];
  joinedDate: string;
}

export type SortOption = 'featured' | 'newest' | 'price-low-high' | 'price-high-low' | 'rating';

export interface FilterState {
  category?: ProductCategory | 'all' | 'anti-tarnish' | 'minimalist';
  priceRange: [number, number];
  finishes: ProductFinish[];
  antiTarnishOnly: boolean;
  waterproofOnly: boolean;
  inStockOnly: boolean;
  sortBy: SortOption;
  searchQuery: string;
}
