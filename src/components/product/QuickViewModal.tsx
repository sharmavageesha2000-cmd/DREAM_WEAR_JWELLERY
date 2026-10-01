import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShieldCheck, Droplets, Heart, ShoppingBag, Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductFinish } from '../../types';
import { formatPrice } from '../../config/brandConfig';
import { RatingStars } from '../common/RatingStars';
import { QuantitySelector } from '../common/QuantitySelector';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedFinish, setSelectedFinish] = useState<ProductFinish>('18K Yellow Gold');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedFinish(product.finishes[0] || '18K Yellow Gold');
      setSelectedSize(product.availableSizes ? product.availableSizes[0] : '');
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const isFavorited = isInWishlist(product.id);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedFinish, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-dark/65 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl bg-ivory-light rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden z-10 animate-fade-in-up max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-sm flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery with Slider Track & Navigation */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between bg-stone-50/50">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-ivory-warm mb-3 shadow-inner border border-stone-200">
            {/* Sliding Track */}
            <div
              className="flex w-full h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
            >
              {product.images.map((img, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0 relative">
                  <img
                    src={img}
                    alt={`${product.name} - View ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>

            {/* Slider Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-stone-900 border border-stone-200 shadow-md flex items-center justify-center transition-all hover:scale-110 z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-stone-900 border border-stone-200 shadow-md flex items-center justify-center transition-all hover:scale-110 z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-gold shadow-md scale-105'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 overflow-y-auto max-h-[55vh] md:max-h-[90vh] flex flex-col justify-between">
          <div>
            {/* Tagline & Rating */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gold-dark">
                {product.categoryName}
              </span>
              <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal leading-tight">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-bold text-charcoal">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Anti-Tarnish USP Pills */}
            <div className="flex flex-wrap gap-2 my-3.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-gold-light/20 text-gold-dark border border-gold-satin/30">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" /> 100% Anti-Tarnish
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                <Droplets className="w-3.5 h-3.5 text-blue-500" /> Waterproof
              </span>
            </div>

            <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Finish selection */}
            {product.finishes && product.finishes.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                  Finish: <span className="text-gold-dark normal-case font-normal">{selectedFinish}</span>
                </label>
                <div className="flex gap-2">
                  {product.finishes.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFinish(f)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedFinish === f
                          ? 'border-gold bg-gold-light/20 text-charcoal font-semibold shadow-sm'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                  Size / Length: <span className="text-gold-dark normal-case font-normal">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedSize === s
                          ? 'border-gold bg-gold-light/20 text-charcoal font-semibold shadow-sm'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-200/80 space-y-3">
            <div className="flex items-center gap-3">
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              />

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : product.inStock
                    ? 'bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white cursor-pointer shadow-md'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : product.inStock ? (
                  <>
                    <ShoppingBag className="w-4 h-4 text-gold" /> Add to Bag — {formatPrice(product.price * quantity)}
                  </>
                ) : (
                  'Sold Out'
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors shadow-sm ${
                  isFavorited
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-stone-200 hover:border-stone-300 text-charcoal'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="w-full py-2 text-center text-xs font-medium text-stone-500 hover:text-gold-dark transition-colors flex items-center justify-center gap-1 group"
            >
              <span>View complete product details & reviews</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
