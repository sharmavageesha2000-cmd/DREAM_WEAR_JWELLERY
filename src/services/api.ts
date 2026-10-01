/// <reference types="vite/client" />
import { getStoredProducts, saveStoredProducts } from '../data/products';
import { categories as defaultCategories } from '../data/categories';
import { Product, Order, UserProfile, Address, OrderItem, Review } from '../types';
import { saveNewOrder, getStoredOrders, updateOrderStatus as updateLocalOrderStatus, deleteOrder as deleteLocalOrder } from './orderStorage';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
export const ENABLE_MOCK_API = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

const TOKEN_KEY = 'aurelia_auth_token';

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string | null): void => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.error('Failed to set auth token:', err);
  }
};

const getHeaders = (extraHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export interface ProductQueryParams {
  category?: string;
  collection?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  finishes?: string[];
  inStock?: boolean;
  minRating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export const apiService = {
  // ==================== HEALTH ====================
  async checkHealth(): Promise<{ status: string; database?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        return await res.json();
      }
      return { status: 'error' };
    } catch {
      return { status: 'offline' };
    }
  },

  // ==================== PRODUCTS ====================
  async getProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
    if (!ENABLE_MOCK_API) {
      try {
        const query = new URLSearchParams();
        if (params.category && params.category !== 'all') query.set('category', params.category);
        if (params.collection && params.collection !== 'all') query.set('collection', params.collection);
        if (params.search) query.set('search', params.search);
        if (params.minPrice) query.set('minPrice', params.minPrice.toString());
        if (params.maxPrice) query.set('maxPrice', params.maxPrice.toString());
        if (params.inStock) query.set('inStock', 'true');
        if (params.minRating) query.set('minRating', params.minRating.toString());
        if (params.sortBy) query.set('sortBy', params.sortBy);
        if (params.page) query.set('page', params.page.toString());
        if (params.limit) query.set('limit', params.limit.toString());

        const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
          headers: getHeaders(),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            // Keep local products storage synchronized with backend catalog
            try {
              if (json.data.length > 0 && (!params.page || params.page === 1) && !params.category && !params.search) {
                saveStoredProducts(json.data);
              }
            } catch {
              // ignore sync failure
            }
            return {
              data: json.data,
              total: json.total || json.data.length,
              page: json.page || 1,
              totalPages: json.totalPages || 1,
            };
          }
        }
      } catch (err) {
        console.warn('API getProducts failed, falling back to local dataset:', err);
      }
    }

    // Local fallback
    let filtered = [...getStoredProducts()];

    if (params.category && params.category !== 'all') {
      filtered = filtered.filter((p) => p.category === params.category);
    }

    if (params.collection && params.collection !== 'all') {
      if (params.collection === 'anti-tarnish') filtered = filtered.filter((p) => p.isAntiTarnish);
      else if (params.collection === 'new-arrivals') filtered = filtered.filter((p) => p.isNew);
      else if (params.collection === 'best-sellers') filtered = filtered.filter((p) => p.isBestSeller);
      else if (params.collection === 'minimalist') filtered = filtered.filter((p) => p.collection === 'minimalist');
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    if (params.maxPrice) {
      filtered = filtered.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.inStock) {
      filtered = filtered.filter((p) => p.inStock);
    }

    if (params.minRating) {
      filtered = filtered.filter((p) => p.rating >= params.minRating!);
    }

    // Sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-low-high':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'best-rated':
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'most-popular':
        case 'bestseller':
          filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
          break;
      }
    }

    const page = params.page || 1;
    const limit = params.limit || 50;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      data: paginated,
      total,
      page,
      totalPages,
    };
  },

  async getProductById(idOrSlug: string): Promise<Product | null> {
    if (!ENABLE_MOCK_API && idOrSlug) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(idOrSlug)}`, {
          headers: getHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('API getProductById failed, using local lookup:', err);
      }
    }

    const found = getStoredProducts().find(
      (p) => p.id.toLowerCase() === idOrSlug.toLowerCase() || p.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    return found || null;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    return this.getProductById(slug);
  },

  async createProduct(product: Partial<Product>): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API createProduct failed:', err);
    }
    return null;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API updateProduct failed:', err);
    }
    return null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return !!json.success;
      }
    } catch (err) {
      console.warn('API deleteProduct failed:', err);
    }
    return false;
  },

  // ==================== CATEGORIES & COLLECTIONS ====================
  async getCategories() {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders() });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('API getCategories failed, falling back to local:', err);
      }
    }
    return defaultCategories;
  },

  async getCollections() {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/collections`, { headers: getHeaders() });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('API getCollections failed:', err);
      }
    }
    return [
      { id: 'anti-tarnish', name: '100% Anti-Tarnish Edit', description: 'Waterproof 18K Real Gold on Medical Steel' },
      { id: 'best-sellers', name: 'Best Sellers', description: 'Most-loved heirloom pieces' },
      { id: 'new-arrivals', name: 'New Arrivals', description: 'Freshly designed seasonal pieces' },
      { id: 'minimalist', name: 'Everyday Minimalist', description: 'Understated elegance for daily wear' },
    ];
  },

  // ==================== AUTH & USER PROFILE ====================
  async loginUser(email: string, name?: string, password?: string): Promise<UserProfile> {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ email, name, password }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.user) {
            if (json.token) setAuthToken(json.token);
            return json.user;
          }
        }
      } catch (err) {
        console.warn('API login failed, falling back to local session:', err);
      }
    }

    return {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0] || 'Vageesha Sharma',
      email: email,
      phone: '+91 98765 43210',
      savedAddresses: [
        {
          id: 'addr-default',
          name: name || 'Vageesha Sharma',
          phone: '+91 98765 43210',
          street: 'Penthouse 402, Royale Crest, Linking Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          isDefault: true,
        },
      ],
      joinedDate: 'August 2024',
    };
  },

  async registerUser(name: string, email: string, phone?: string, password?: string): Promise<UserProfile> {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ name, email, phone, password }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.user) {
            if (json.token) setAuthToken(json.token);
            return json.user;
          }
        }
      } catch (err) {
        console.warn('API register failed, falling back:', err);
      }
    }

    return {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || '+91 98765 43210',
      savedAddresses: [],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  },

  async getUserProfile(): Promise<UserProfile | null> {
    const token = getAuthToken();
    if (!ENABLE_MOCK_API && token) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.user) {
            return json.user;
          }
        }
      } catch (err) {
        console.warn('API getUserProfile failed:', err);
      }
    }

    const saved = localStorage.getItem('aurelia_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(profile),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.user) {
            return json.user;
          }
        }
      } catch (err) {
        console.warn('API updateUserProfile failed:', err);
      }
    }
    return null;
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/addresses`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(address),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('API addAddress failed:', err);
      }
    }
    return { ...address, id: `addr-${Date.now()}` };
  },

  async deleteAddress(id: string): Promise<boolean> {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/addresses/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          return !!json.success;
        }
      } catch (err) {
        console.warn('API deleteAddress failed:', err);
      }
    }
    return true;
  },

  async setDefaultAddress(id: string): Promise<boolean> {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/addresses/${encodeURIComponent(id)}/default`, {
          method: 'PUT',
          headers: getHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          return !!json.success;
        }
      } catch (err) {
        console.warn('API setDefaultAddress failed:', err);
      }
    }
    return true;
  },

  // ==================== CART & WISHLIST ====================
  async getCart() {
    const saved = localStorage.getItem('aurelia_cart_v1');
    return saved ? JSON.parse(saved) : [];
  },

  async addToCart(product: Product, quantity = 1, finish = '18K Yellow Gold', size?: string) {
    const current = await this.getCart();
    const existingIndex = current.findIndex(
      (item: any) => item.product.id === product.id && item.selectedFinish === finish && item.selectedSize === size
    );
    let updated;
    if (existingIndex > -1) {
      updated = [...current];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...current, { product, quantity, selectedFinish: finish, selectedSize: size }];
    }
    localStorage.setItem('aurelia_cart_v1', JSON.stringify(updated));
    return updated;
  },

  async removeFromCart(productId: string, finish?: string, size?: string) {
    const current = await this.getCart();
    const updated = current.filter((item: any) => {
      if (item.product.id !== productId) return true;
      if (finish && item.selectedFinish !== finish) return true;
      if (size && item.selectedSize !== size) return true;
      return false;
    });
    localStorage.setItem('aurelia_cart_v1', JSON.stringify(updated));
    return updated;
  },

  async getWishlist() {
    const saved = localStorage.getItem('aurelia_wishlist_v1');
    return saved ? JSON.parse(saved) : [];
  },

  async addToWishlist(product: Product) {
    const current = await this.getWishlist();
    if (!current.some((p: Product) => p.id === product.id)) {
      const updated = [...current, product];
      localStorage.setItem('aurelia_wishlist_v1', JSON.stringify(updated));
      return updated;
    }
    return current;
  },

  async removeFromWishlist(productId: string) {
    const current = await this.getWishlist();
    const updated = current.filter((p: Product) => p.id !== productId);
    localStorage.setItem('aurelia_wishlist_v1', JSON.stringify(updated));
    return updated;
  },

  // ==================== ORDERS ====================
  async createOrder(orderData: {
    items: OrderItem[];
    shippingAddress: Address;
    shippingMethod: string;
    paymentMethod: string;
    paymentStatus: string;
    subtotal: number;
    discount: number;
    couponCode?: string;
    shippingFee: number;
    total: number;
  }): Promise<Order> {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(orderData),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            saveNewOrder(json.data);
            return json.data;
          }
        }
      } catch (err) {
        console.warn('API createOrder failed, saving to local storage:', err);
      }
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'Processing',
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      shippingMethod: orderData.shippingMethod,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      couponCode: orderData.couponCode,
      shippingFee: orderData.shippingFee,
      total: orderData.total,
      trackingNumber: `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: orderData.shippingMethod === 'express' ? '1-2 Business Days' : '3-4 Business Days',
    };

    saveNewOrder(newOrder);
    return newOrder;
  },

  async getOrders(): Promise<Order[]> {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, { headers: getHeaders() });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            // Keep local backup updated
            try {
              localStorage.setItem('aurelia_customer_orders', JSON.stringify(json.data));
            } catch {
              // ignore
            }
            return json.data;
          }
        }
      } catch (err) {
        console.warn('API getOrders failed, using local orders:', err);
      }
    }
    return getStoredOrders();
  },

  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order[]> {
    if (!ENABLE_MOCK_API) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/status`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          console.log(`Backend order status updated to ${newStatus}`);
        }
      } catch (err) {
        console.warn('API updateOrderStatus failed:', err);
      }
    }
    return updateLocalOrderStatus(orderId, newStatus);
  },

  async deleteOrder(orderId: string): Promise<Order[]> {
    if (!ENABLE_MOCK_API) {
      try {
        await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
      } catch (err) {
        console.warn('API deleteOrder failed:', err);
      }
    }
    return deleteLocalOrder(orderId);
  },

  // ==================== REVIEWS ====================
  async getReviews(productId?: string): Promise<Review[]> {
    if (!ENABLE_MOCK_API) {
      try {
        const url = productId ? `${API_BASE_URL}/reviews?productId=${encodeURIComponent(productId)}` : `${API_BASE_URL}/reviews`;
        const res = await fetch(url, { headers: getHeaders() });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('API getReviews failed:', err);
      }
    }
    return [];
  },

  async submitReview(reviewData: Partial<Review>): Promise<Review | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API submitReview failed:', err);
    }
    return null;
  },

  // ==================== COUPONS & UTILITIES ====================
  async verifyCoupon(code: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/verify/${encodeURIComponent(code.trim().toUpperCase())}`);
      return await res.json();
    } catch {
      // Offline fallback
      const c = code.trim().toUpperCase();
      if (c === 'WELCOME10') {
        return { success: true, message: '10% off applied!', data: { code: 'WELCOME10', discountPercentage: 10 } };
      } else if (c === 'AURELIA200') {
        return { success: true, message: '₹200 flat off applied!', data: { code: 'AURELIA200', flatDiscount: 200 } };
      } else if (c === 'SPARKLE') {
        return { success: true, message: '15% VIP Festive privilege discount applied!', data: { code: 'SPARKLE', discountPercentage: 15 } };
      }
      return { success: false, message: 'Invalid promo code.' };
    }
  },

  async verifyPincode(pincode: string): Promise<{ valid: boolean; message: string; days?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/shipping/verify-pincode/${encodeURIComponent(pincode)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      return {
        valid: true,
        message: 'Delivery available in 2-3 business days. Free Express Shipping applies!',
        days: '2-3 Business Days',
      };
    }
    return {
      valid: false,
      message: 'Please enter a valid 6-digit Indian PIN code.',
    };
  },

  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string; couponCode?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    return {
      success: true,
      message: 'Welcome to the AURELIA Circle! Your 10% welcome privilege has been unlocked.',
      couponCode: 'WELCOME10',
    };
  },

  // ==================== ADMIN ANALYTICS ====================
  async getAdminAnalytics(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/analytics`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (err) {
      console.warn('API getAdminAnalytics failed:', err);
    }
    return null;
  },

  async getAdminCustomers(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/customers`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (err) {
      console.warn('API getAdminCustomers failed:', err);
    }
    return [];
  },

  async resetAdminCatalog(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reset-catalog`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
