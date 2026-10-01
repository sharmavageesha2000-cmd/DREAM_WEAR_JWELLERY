import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ProductFinish } from '../types';
import { brandConfig } from '../config/brandConfig';

interface Coupon {
  code: string;
  discountPercentage?: number;
  flatDiscount?: number;
  description: string;
}

const AVAILABLE_COUPONS: Record<string, Coupon> = {
  'WELCOME10': {
    code: 'WELCOME10',
    discountPercentage: 10,
    description: '10% off on your order',
  },
  'AURELIA200': {
    code: 'AURELIA200',
    flatDiscount: 200,
    description: '₹200 flat off on luxury orders',
  },
  'SPARKLE': {
    code: 'SPARKLE',
    discountPercentage: 15,
    description: '15% VIP Festive privilege discount',
  },
};

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  appliedCoupon: Coupon | null;
  shippingFee: number;
  giftWrapFee: number;
  isGiftWrap: boolean;
  giftNote: string;
  total: number;
  isCartOpen: boolean;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  freeShippingProgress: number;
  addToCart: (product: Product, quantity?: number, finish?: ProductFinish, size?: string) => void;
  removeFromCart: (productId: string, finish?: ProductFinish, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, finish?: ProductFinish, size?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleGiftWrap: () => void;
  setGiftNote: (note: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aurelia_cart_v1';
const COUPON_STORAGE_KEY = 'aurelia_applied_coupon';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Persist coupon
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercentage) {
      discount = Math.round((subtotal * appliedCoupon.discountPercentage) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discount = Math.min(appliedCoupon.flatDiscount, subtotal);
    }
  }

  const freeShippingThreshold = brandConfig.shipping.freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 
    ? 0 
    : brandConfig.shipping.standardShippingFee;

  const giftWrapFee = isGiftWrap ? 149 : 0;
  const total = Math.max(0, subtotal - discount + shippingFee + giftWrapFee);

  const addToCart = (
    product: Product,
    quantity = 1,
    finish: ProductFinish = product.finishes[0] || '18K Yellow Gold',
    size?: string
  ) => {
    const chosenSize = size || (product.availableSizes ? product.availableSizes[0] : undefined);
    
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedFinish === finish &&
          item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedFinish: finish,
            selectedSize: chosenSize,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, finish?: ProductFinish, size?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (item.product.id !== productId) return true;
        if (finish && item.selectedFinish !== finish) return true;
        if (size && item.selectedSize !== size) return true;
        return false;
      })
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    finish?: ProductFinish,
    size?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, finish, size);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        const matchProduct = item.product.id === productId;
        const matchFinish = !finish || item.selectedFinish === finish;
        const matchSize = !size || item.selectedSize === size;
        if (matchProduct && matchFinish && matchSize) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setIsGiftWrap(false);
    setGiftNote('');
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const formattedCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[formattedCode];
    if (coupon) {
      setAppliedCoupon(coupon);
      return {
        success: true,
        message: `Promo code "${formattedCode}" applied successfully!`,
      };
    }
    return {
      success: false,
      message: 'Invalid promo code. Try WELCOME10 or AURELIA200.',
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleGiftWrap = () => {
    setIsGiftWrap((prev) => !prev);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        discount,
        appliedCoupon,
        shippingFee,
        giftWrapFee,
        isGiftWrap,
        giftNote,
        total,
        isCartOpen,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        freeShippingProgress,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        applyCoupon,
        removeCoupon,
        toggleGiftWrap,
        setGiftNote,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
