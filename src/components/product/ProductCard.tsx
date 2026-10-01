import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, ShieldCheck, Check, ArrowUpRight } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../config/brandConfig';
import { RatingStars } from '../common/RatingStars';
import { WishlistButton } from '../common/WishlistButton';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [quickAdded, setQuickAdded] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      product,
      1,
      product.finishes[0] || '18K Yellow Gold',
      product.availableSizes ? product.availableSizes[0] : undefined
    );
    setQuickAdded(true);
    showToast(`Added "${product.name}" to your collection ✨`, 'cart');
    setTimeout(() => setQuickAdded(false), 1600);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  // Switch to Angle 2 image on hover if available and different
  const hasMultipleImages = product.images.length > 1 && product.images[1] !== product.images[0];
  const displayImage = isHovered && hasMultipleImages ? product.images[1] : product.images[0];

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/70 hover:border-gold-satin/50 hover:shadow-luxury-hover transition-all duration-500 text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-ivory-warm">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transform group-hover:scale-106 transition-all duration-700 ease-out"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && (
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-[#B88E3A] text-white shadow-xs">
              New
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isAntiTarnish && (
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-white/95 text-gold-dark border border-gold-satin/40 backdrop-blur-sm shadow-xs flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3 text-gold" /> Anti-Tarnish
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton product={product} size="sm" />
        </div>

        {/* Desktop Quick Actions on Hover */}
        <div className="absolute bottom-3 left-3 right-3 hidden sm:flex gap-2 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              quickAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-gradient-to-r from-[#B88E3A] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white'
            }`}
          >
            {quickAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-gold-light" />
                <span>Quick Add</span>
              </>
            )}
          </button>

          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="p-2.5 bg-white/95 hover:bg-white text-charcoal-dark backdrop-blur-md rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer hover:text-gold-dark"
              title="Quick preview"
              aria-label="Quick preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-4.5 flex flex-col flex-1 justify-between space-y-2 transform group-hover:-translate-y-0.5 transition-transform duration-300">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium truncate">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
              <RatingStars rating={product.rating} size="sm" />
              <span className="text-[10px] text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.slug}`} className="block group/link">
            <h3 className="font-serif text-sm sm:text-base font-normal text-charcoal-dark group-hover/link:text-gold-dark transition-colors line-clamp-1 flex items-center justify-between gap-1">
              <span>{product.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity text-gold-dark flex-shrink-0" />
            </h3>
          </Link>
        </div>

        {/* Price & Mobile Quick Add Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-sm sm:text-base font-bold text-charcoal-dark">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through font-normal">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className="sm:hidden p-2 rounded-xl bg-[#B88E3A] text-white hover:bg-[#A37B2C] transition-colors shadow-2xs"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
