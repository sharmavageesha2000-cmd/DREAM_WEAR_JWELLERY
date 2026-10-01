import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, ShieldCheck } from 'lucide-react';
import { CartItem } from '../../types';
import { formatPrice } from '../../config/brandConfig';
import { QuantitySelector } from '../common/QuantitySelector';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface CartItemRowProps {
  item: CartItem;
  onCloseDrawer?: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, onCloseDrawer }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleMoveToWishlist = () => {
    addToWishlist(item.product);
    removeFromCart(item.product.id, item.selectedFinish, item.selectedSize);
    showToast(`Moved "${item.product.name}" to your wishlist`, 'wishlist');
  };

  return (
    <div className="py-4 flex gap-4 border-b border-stone-100 last:border-0">
      {/* Thumbnail */}
      <Link
        to={`/product/${item.product.slug}`}
        onClick={onCloseDrawer}
        className="w-20 h-20 rounded-xl overflow-hidden bg-ivory flex-shrink-0 border border-stone-200/80"
      >
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Info & Actions */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/product/${item.product.slug}`}
              onClick={onCloseDrawer}
              className="font-serif text-sm font-medium text-charcoal hover:text-gold-dark truncate block"
            >
              {item.product.name}
            </Link>
            <span className="font-serif font-bold text-sm text-charcoal">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
            <span>{item.selectedFinish}</span>
            {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
          </div>

          {item.product.isAntiTarnish && (
            <div className="mt-1 flex items-center gap-1 text-[9px] text-gold-dark font-medium">
              <ShieldCheck className="w-3 h-3" /> Anti-Tarnish 18K PVD
            </div>
          )}
        </div>

        {/* Quantity Controls & Move to Wishlist / Remove */}
        <div className="flex items-center justify-between mt-3">
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMoveToWishlist}
              className="text-[11px] text-stone-400 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors"
              title="Move to Wishlist"
            >
              <Heart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              type="button"
              onClick={() => removeFromCart(item.product.id, item.selectedFinish, item.selectedSize)}
              className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
              title="Remove item"
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
