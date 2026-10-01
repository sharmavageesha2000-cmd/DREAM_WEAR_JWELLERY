import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, Gift, Tag, CheckCircle2, ShieldCheck, ArrowLeft, Trash2, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../config/brandConfig';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const Cart: React.FC = () => {
  useSEO({
    title: 'Shopping Bag',
    description: 'Review your selected anti-tarnish fine jewelry pieces, apply promo codes, and proceed to secure checkout.',
  });

  const {
    cart,
    itemCount,
    subtotal,
    discount,
    appliedCoupon,
    shippingFee,
    giftWrapFee,
    isGiftWrap,
    giftNote,
    setGiftNote,
    total,
    amountNeededForFreeShipping,
    freeShippingProgress,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    toggleGiftWrap,
  } = useCart();

  const { addToWishlist } = useWishlist();
  const { showToast } = useToast();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; error?: boolean } | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    if (res.success) {
      setCouponFeedback({ text: res.message, error: false });
      setCouponCodeInput('');
      showToast(res.message, 'success');
    } else {
      setCouponFeedback({ text: res.message, error: true });
      showToast(res.message, 'error');
    }
  };

  const handleMoveToWishlist = (item: typeof cart[0]) => {
    addToWishlist(item.product);
    removeFromCart(item.product.id, item.selectedFinish, item.selectedSize);
    showToast(`Moved "${item.product.name}" to your wishlist`, 'wishlist');
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 sm:py-28 bg-ivory">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center mx-auto text-gold mb-6">
            <ShoppingBag className="w-10 h-10 stroke-1" />
          </div>
          <h1 className="font-serif text-3xl font-light text-charcoal">Your Bag is Empty</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 font-light leading-relaxed">
            Discover waterproof, anti-tarnish fine jewelry engineered to be worn every single day.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-charcoal text-ivory-light text-xs font-semibold uppercase tracking-[0.18em] rounded-xl hover:bg-gold-dark transition-all shadow-md"
            >
              Shop All Jewelry
            </Link>
            <Link
              to="/shop?collection=best-sellers"
              className="px-8 py-3.5 bg-white border border-stone-200 text-charcoal text-xs font-semibold uppercase tracking-[0.18em] rounded-xl hover:border-gold transition-all"
            >
              Best Sellers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: 'Shopping Bag' },
          ]}
          className="mb-6"
        />

        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal">
              Your Shopping Bag
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {itemCount} {itemCount === 1 ? 'heirloom piece' : 'heirloom pieces'} in your bag
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-stone-400 hover:text-rose-600 font-medium underline"
          >
            Empty Bag
          </button>
        </div>

        {/* Two Columns: Cart Items Table + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Shipping Progress Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="flex items-center gap-2 font-medium text-charcoal">
                  <Truck className="w-4 h-4 text-gold-dark" />
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">
                      🎉 Congratulations! You have unlocked Free Express Shipping!
                    </span>
                  ) : (
                    <span>
                      Add <span className="font-bold text-gold-dark">{formatPrice(amountNeededForFreeShipping)}</span> more for Free Delivery
                    </span>
                  )}
                </span>
                <span className="text-xs font-bold text-stone-600">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-light via-gold to-gold-dark rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm divide-y divide-stone-100 overflow-hidden">
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedFinish}-${item.selectedSize || ''}-${idx}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-ivory-warm flex-shrink-0 border border-stone-200"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-dark">
                      {item.product.categoryName}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="font-serif text-base sm:text-lg font-medium text-charcoal hover:text-gold-dark block truncate"
                    >
                      {item.product.name}
                    </Link>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-stone-500 mt-1">
                      <span>Finish: <strong>{item.selectedFinish}</strong></span>
                      {item.selectedSize && (
                        <span>Size: <strong>{item.selectedSize}</strong></span>
                      )}
                    </div>

                    {item.product.isAntiTarnish && (
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold text-gold-dark bg-gold-light/20 px-2 py-0.5 rounded-full mt-2">
                        <ShieldCheck className="w-3 h-3" /> Anti-Tarnish 18K PVD
                      </span>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 mt-2 sm:mt-0">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() =>
                        updateQuantity(item.product.id, item.quantity + 1, item.selectedFinish, item.selectedSize)
                      }
                      onDecrease={() =>
                        updateQuantity(item.product.id, item.quantity - 1, item.selectedFinish, item.selectedSize)
                      }
                      size="sm"
                    />

                    <div className="text-right">
                      <p className="font-serif text-base sm:text-lg font-bold text-charcoal">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-stone-400">
                          {formatPrice(item.product.price)} each
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(item)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Move to Wishlist"
                        aria-label="Move to Wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.selectedFinish, item.selectedSize)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gift Wrapping & Message Box */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm space-y-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isGiftWrap}
                  onChange={toggleGiftWrap}
                  className="w-4 h-4 rounded text-gold focus:ring-gold border-stone-300"
                />
                <span className="text-xs sm:text-sm font-medium text-charcoal flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gold-dark" />
                  Add Luxury Satin Gift Box & Handwritten Card (+₹149)
                </span>
              </label>

              {isGiftWrap && (
                <div className="pt-2 animate-fade-in">
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Enter your personal gift message (up to 150 characters)..."
                    className="w-full p-3 bg-ivory rounded-xl border border-stone-200 text-xs text-charcoal focus:outline-none focus:border-gold"
                    maxLength={150}
                  />
                </div>
              )}
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-gold-dark transition-colors pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm space-y-5 sticky top-24">
            <h2 className="font-serif text-xl font-semibold text-charcoal pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            {/* Coupon Box */}
            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{appliedCoupon.code} applied</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-rose-600 font-semibold hover:underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="e.g. WELCOME10"
                      className="w-full pl-8 pr-3 py-2 bg-ivory rounded-xl border border-stone-200 text-xs text-charcoal uppercase placeholder:normal-case focus:outline-none focus:border-gold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#B88E3A] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponFeedback && (
                  <p className={`text-[11px] font-medium ${couponFeedback.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {couponFeedback.text}
                  </p>
                )}
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-stone-600 pt-2">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              {isGiftWrap && (
                <div className="flex justify-between text-stone-600">
                  <span>Luxury Gift Packaging</span>
                  <span>+{formatPrice(giftWrapFee)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-charcoal">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-stone-500">
                <span>Estimated GST (Inclusive)</span>
                <span>{formatPrice(Math.round(total * 0.03))}</span>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline text-charcoal">
                <span className="text-sm font-bold">Estimated Total</span>
                <span className="font-serif text-2xl font-bold text-charcoal">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.2em] shadow-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust highlights */}
            <div className="pt-3 border-t border-stone-100 space-y-1.5 text-[11px] text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
                <span>2-Year Anti-Tarnish Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-gold-dark" />
                <span>Free Express Shipping across India</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
