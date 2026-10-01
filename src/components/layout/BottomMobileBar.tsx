import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const BottomMobileBar: React.FC = () => {
  const location = useLocation();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/80 px-2 py-1.5 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <nav aria-label="Mobile Navigation" className="grid grid-cols-5 items-center text-center">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center py-1 transition-colors ${
            isActive('/') ? 'text-gold-dark' : 'text-stone-500'
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Home</span>
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center py-1 transition-colors ${
            isActive('/shop') ? 'text-gold-dark' : 'text-stone-500'
          }`}
        >
          <Sparkles className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Shop</span>
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className={`flex flex-col items-center py-1 relative transition-colors ${
            isActive('/wishlist') ? 'text-rose-600' : 'text-stone-500'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Wishlist</span>
        </Link>

        {/* Bag */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center py-1 text-stone-500 relative"
          aria-label="Open Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-gold text-charcoal-dark text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Bag</span>
        </button>

        {/* Account */}
        <Link
          to={isLoggedIn ? '/account' : '/login'}
          className={`flex flex-col items-center py-1 transition-colors ${
            isActive('/account') || isActive('/login') ? 'text-gold-dark' : 'text-stone-500'
          }`}
        >
          <User className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Account</span>
        </Link>
      </nav>
    </div>
  );
};
