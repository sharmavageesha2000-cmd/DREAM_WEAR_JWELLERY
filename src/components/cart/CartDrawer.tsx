import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Sparkles, Tag, Gift, CheckCircle2, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../config/brandConfig';
import { CartItemRow } from './CartItemRow';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    itemCount,
    subtotal,
    discount,
    appliedCoupon,
    shippingFee,
    giftWrapFee,
    isGiftWrap,
    total,
    isCartOpen,
    closeCart,
    amountNeededForFreeShipping,
    freeShippingProgress,
    applyCoupon,
    removeCoupon,
    toggleGiftWrap,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCouponMessage(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMessage({ text: res.message, error: false });
      setCouponInput('');
    } else {
      setCouponMessage({ text: res.message, error: true });
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-dark/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory-light shadow-2xl border-l border-stone-200/80 flex flex-col justify-between overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-dark" />
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                Shopping Bag
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold-light/25 text-gold-dark">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 rounded-full text-stone-400 hover:text-charcoal hover:bg-stone-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-nude-50 px-5 py-3 border-b border-stone-200/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-charcoal">
                <Truck className="w-3.5 h-3.5 text-gold" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold">
                    🎉 You unlocked Free Express Shipping!
                  </span>
                ) : (
                  <span>
                    Add <span className="font-bold text-gold-dark">{formatPrice(amountNeededForFreeShipping)}</span> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-[11px] font-semibold text-stone-500">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-light via-gold to-gold-dark rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart items scrollable area */}
          <div className="flex-1 overflow-y-auto px-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-ivory-warm border border-stone-200 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-1 text-gold" />
                </div>
                <h3 className="font-serif text-lg font-medium text-charcoal">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mt-1 mb-6">
                  Explore our shower-safe, anti-tarnish 18K gold collection designed for effortless daily elegance.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-charcoal text-ivory-light text-xs font-semibold uppercase tracking-wider hover:bg-gold-dark transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Discover Best Sellers</span>
                </Link>
              </div>
            ) : (
              <div>
                {cart.map((item, idx) => (
                  <CartItemRow
                    key={`${item.product.id}-${item.selectedFinish}-${item.selectedSize || ''}-${idx}`}
                    item={item}
                    onCloseDrawer={closeCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer calculation & checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white/90 space-y-3 shadow-lg">
              {/* Gift wrap option */}
              <div className="flex items-center justify-between bg-ivory p-2.5 rounded-xl border border-stone-200/70 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isGiftWrap}
                    onChange={toggleGiftWrap}
                    className="w-4 h-4 rounded text-gold focus:ring-gold border-stone-300"
                  />
                  <span className="flex items-center gap-1 font-medium text-charcoal">
                    <Gift className="w-3.5 h-3.5 text-gold" /> Luxury Gift Box & Note (+₹149)
                  </span>
                </label>
              </div>

              {/* Coupon Code Accordion / Input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-ivory rounded-xl border border-stone-200 focus:outline-none focus:border-gold uppercase placeholder:normal-case"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#B88E3A] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && (
                <p className={`text-[11px] font-medium ${couponMessage.error ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {couponMessage.text}
                </p>
              )}

              {/* Summary lines */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                {isGiftWrap && (
                  <div className="flex justify-between text-stone-600">
                    <span>Gift Packaging</span>
                    <span>+{formatPrice(giftWrapFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-charcoal">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span className="text-base font-serif font-bold text-charcoal">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer group"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="block text-center text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-gold-dark py-1.5 transition-colors"
                >
                  View Full Cart & Summary
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
