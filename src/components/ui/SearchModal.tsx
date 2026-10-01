import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { getStoredProducts } from '../../data/products';
import { Product } from '../../types';
import { formatPrice } from '../../config/brandConfig';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Gold Necklace',
  'Silver Anklet',
  'Diamond Nose Pin',
  'Silver Toe Rings',
  'Minimal Rings',
  'Hoop Earrings',
  'Anti-Tarnish',
];


export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const matched = getStoredProducts().filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        p.tagline.toLowerCase().includes(trimmed) ||
        p.material.toLowerCase().includes(trimmed)
    );
    setResults(matched.slice(0, 6));
  }, [query]);

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#2C2119]/45 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden z-10 animate-fade-in-up">
        {/* Search header bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-stone-200 px-5 py-4 bg-ivory-light">
          <Search className="w-5 h-5 text-stone-400 flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jewelry by name, category, finish..."
            className="w-full bg-transparent text-sm sm:text-base text-charcoal-dark placeholder:text-stone-400 focus:outline-none"
            aria-label="Search jewelry"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-medium text-stone-500 hover:text-charcoal-dark bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
          >
            ESC
          </button>
        </form>

        {/* Modal Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Live Search Results */}
          {query.trim().length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-stone-500">
                <span className="font-semibold uppercase tracking-wider">
                  Products ({results.length})
                </span>
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-gold-dark hover:underline flex items-center gap-1 font-medium"
                >
                  <span>View all results</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {results.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectProduct(product.slug)}
                      className="w-full py-3 px-2 flex items-center gap-3.5 hover:bg-stone-50 rounded-xl transition-colors text-left group cursor-pointer"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-ivory-warm border border-stone-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-charcoal-dark group-hover:text-gold-dark transition-colors truncate">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">{product.categoryName}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-serif font-bold text-charcoal-dark block">
                          {formatPrice(product.price)}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="text-[10px] text-rose-600 font-semibold">
                            {product.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-stone-500 text-xs">
                  <p className="font-serif text-base text-charcoal-dark mb-1">We couldn't find that piece.</p>
                  <p>Try searching for "necklaces", "anti-tarnish", or "rings".</p>
                </div>
              )}
            </div>
          ) : (
            /* Popular & Suggested Searches */
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-gold" />
                  <span>Popular Searches</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className="px-3.5 py-1.5 rounded-full bg-ivory-warm hover:bg-[#B88E3A] hover:text-white text-stone-700 text-xs font-medium transition-all cursor-pointer border border-[#E5DDD0] hover:border-[#B88E3A]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Category Jump */}
              <div className="pt-2 border-t border-stone-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Explore Collections</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Necklaces', to: '/shop?category=necklaces' },
                    { label: 'Earrings', to: '/shop?category=earrings' },
                    { label: 'Rings', to: '/shop?category=rings' },
                    { label: 'Bracelets', to: '/shop?category=bracelets' },
                    { label: 'Anklets', to: '/shop?category=anklets' },
                    { label: 'Nose Pins', to: '/shop?category=nose-pins' },
                    { label: 'Toe Rings', to: '/shop?category=toe-rings' },
                    { label: 'Sets', to: '/shop?category=sets' },
                  ].map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate(c.to);
                      }}
                      className="p-2.5 rounded-xl bg-stone-50 hover:bg-white border border-stone-200/70 hover:border-gold text-xs font-medium text-charcoal-dark transition-all text-center"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
