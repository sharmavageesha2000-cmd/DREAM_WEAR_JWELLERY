import React from 'react';
import { Link } from 'react-router-dom';
import { X, Search, ShieldCheck, Heart, User, ChevronRight, Sparkles, Home, Flame, Layers, Info, Phone, Mail } from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { categories } from '../../data/categories';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onOpenSearch }) => {
  const { wishlistCount } = useWishlist();
  const { isLoggedIn } = useAuth();


  if (!isOpen) return null;

  const mainNavItems = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Shop All', to: '/shop', icon: Sparkles },
    { label: 'New Arrivals', to: '/shop?collection=new-arrivals', icon: Sparkles, badge: 'New' },
    { label: 'Best Sellers', to: '/shop?collection=best-sellers', icon: Flame, badge: 'Hot' },
    { label: 'Collections', to: '/collections/anti-tarnish', icon: Layers },
    { label: 'About Us', to: '/about', icon: Info },
    { label: 'Contact', to: '/contact', icon: Phone },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-fade-in w-full">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2119]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex w-[85%] sm:max-w-sm">
        <div className="w-full bg-[#FAF8F5] shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Top Bar */}
          <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between bg-white">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 select-none"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden p-0.5 border border-amber-400/60 bg-[#FAF7F2] flex-shrink-0">
                <img
                  src={brandConfig.badgeLogo}
                  alt={`${brandConfig.name} Logo`}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-brand font-bold text-lg tracking-[0.2em] text-[#2C2119] uppercase leading-none">
                  {brandConfig.name}
                </span>
                <span className="text-[7.5px] font-brand tracking-[0.35em] uppercase text-amber-700 font-semibold pt-0.5">
                  HAUTE JEWELRY
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-500 hover:text-charcoal-dark hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Button */}
          <div className="px-4 sm:px-5 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-400 text-xs hover:border-gold transition-colors text-left shadow-2xs cursor-pointer"
            >
              <Search className="w-4 h-4 text-gold-dark" />
              <span>Search jewelry, rings, necklaces...</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 sm:p-5 space-y-5 flex-1">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8E6A22] font-bold mb-2">
                Explore DREAM WEAR
              </p>
              <ul className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium text-charcoal-dark hover:bg-white transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-gold-dark stroke-[1.75]" />
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span className="text-[9px] uppercase tracking-wider bg-[#B88E3A] text-white px-2 py-0.5 rounded-full font-bold">
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-stone-400" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">
                Shop By Category
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-white border border-stone-200/80 hover:border-gold text-xs font-medium text-charcoal-dark transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-stone-400">({cat.itemCount})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Anti-Tarnish Assurance Badge */}
            <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 flex items-center gap-3 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-gold-dark flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-charcoal-dark uppercase tracking-wider">
                  2-Year Anti-Tarnish Warranty
                </p>
                <p className="text-[10px] text-stone-500 font-light">
                  18K Real Gold PVD • Shower & Gym Safe
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Account & Support Links */}
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-ivory-warm text-xs font-medium text-charcoal-dark hover:bg-stone-100"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Wishlist ({wishlistCount})</span>
              </Link>

              <Link
                to={isLoggedIn ? '/account' : '/login'}
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-ivory-warm text-xs font-medium text-charcoal-dark hover:bg-stone-100"
              >
                <User className="w-4 h-4 text-gold-dark" />
                <span>{isLoggedIn ? 'Account' : 'Sign In'}</span>
              </Link>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <a
                href={`tel:${brandConfig.contact.phone}`}
                className="flex items-center gap-1 hover:text-charcoal-dark"
              >
                <Phone className="w-3.5 h-3.5 text-gold-dark" />
                <span>{brandConfig.contact.phone}</span>
              </a>
              <a
                href={`mailto:${brandConfig.contact.email}`}
                className="flex items-center gap-1 hover:text-charcoal-dark"
              >
                <Mail className="w-3.5 h-3.5 text-gold-dark" />
                <span>Email Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
