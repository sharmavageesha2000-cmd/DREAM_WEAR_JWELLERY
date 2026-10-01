import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  size = 'md',
  className = '',
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const isFavorited = isInWishlist(product.id);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      showToast(`Added "${product.name}" to your wishlist`, 'wishlist');
    } else {
      showToast(`Removed "${product.name}" from your wishlist`, 'info');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${sizeClasses} rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
        isFavorited
          ? 'bg-rose-50 text-rose-600 border border-rose-200'
          : 'bg-white/90 text-charcoal hover:text-rose-600 hover:bg-white border border-stone-200/60'
      } ${className}`}
      title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-label="Wishlist"
    >
      <Heart
        className={`${iconSizes} transition-transform duration-200 ${
          isFavorited ? 'fill-rose-500 scale-110' : 'hover:scale-110'
        }`}
      />
    </button>
  );
};
