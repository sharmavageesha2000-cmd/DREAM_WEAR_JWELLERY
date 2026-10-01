import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../config/brandConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { useSEO } from '../hooks/useSEO';

export const Wishlist: React.FC = () => {
  useSEO({
    title: 'My Wishlist — Saved Anti-Tarnish Jewelry | AURELIA',
    description:
      'Your future favorites live here. Revisit your saved 18K gold anti-tarnish jewelry pieces anytime.',
  });

  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = (product: (typeof wishlist)[0]) => {
    addToCart(
      product,
      1,
      product.finishes[0] || '18K Yellow Gold',
      product.availableSizes ? product.availableSizes[0] : undefined
    );
    removeFromWishlist(product.id);
    showToast(`Moved "${product.name}" to your collection ✨`, 'cart');
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(
        product,
        1,
        product.finishes[0] || '18K Yellow Gold',
        product.availableSizes ? product.availableSizes[0] : undefined
      );
    });
    clearWishlist();
    showToast(`Moved all ${wishlist.length} pieces to your bag! ✨`, 'cart');
  };

  if (wishlist.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-[#FAF8F5] min-h-[75vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-white border border-stone-200 shadow-sm flex items-center justify-center mx-auto text-stone-400">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal-dark tracking-tight">
              Your future favorites live here.
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-light max-w-sm mx-auto">
              Save your favorite shower-safe anti-tarnish jewelry pieces to revisit anytime or add them to your shopping bag.
            </p>
          </div>

          <div>
            <Link to="/shop">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-md"
              >
                Explore Jewelry
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F5] min-h-[75vh] animate-fade-in text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-6 sm:space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: 'My Wishlist' },
          ]}
        />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>SAVED CURATION</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal-dark tracking-tight">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'saved piece' : 'saved pieces'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddAllToCart}
              leftIcon={<ShoppingBag className="w-4 h-4 text-gold-light" />}
            >
              Move All to Bag
            </Button>

            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs text-stone-400 hover:text-rose-600 font-medium transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200/80 hover:border-gold-satin/50 hover:shadow-luxury transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full bg-ivory-warm overflow-hidden">
                <Link to={`/product/${product.slug}`} className="block w-full h-full">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-stone-400 hover:text-rose-600 shadow-sm transition-colors cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {product.isAntiTarnish && (
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-white/90 text-gold-dark border border-gold-satin/40 backdrop-blur-sm flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-gold" /> Anti-Tarnish
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-1">
                    {product.categoryName}
                  </span>
                  <Link to={`/product/${product.slug}`} className="block">
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-charcoal-dark hover:text-gold-dark transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-serif text-sm sm:text-base font-bold text-charcoal-dark">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-stone-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Cart CTA */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleMoveToCart(product)}
                  leftIcon={<ShoppingBag className="w-3.5 h-3.5 text-gold-light" />}
                  className="w-full"
                >
                  Move to Bag
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
