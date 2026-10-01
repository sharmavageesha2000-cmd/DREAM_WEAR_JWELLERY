import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flame, ArrowRight } from 'lucide-react';
import { getStoredProducts } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { Product } from '../../types';
import { apiService } from '../../services/api';

interface BestSellersGridProps {
  onQuickView?: (product: Product) => void;
}

export const BestSellersGrid: React.FC<BestSellersGridProps> = ({ onQuickView }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bestSellers, setBestSellers] = useState<Product[]>(() =>
    getStoredProducts().filter((p) => p.isBestSeller).slice(0, 8)
  );

  useEffect(() => {
    apiService.getProducts({ collection: 'best-sellers', limit: 8 }).then((res) => {
      if (res && res.data && res.data.length > 0) {
        setBestSellers(res.data);
      }
    }).catch((err) => console.warn('Best sellers API load error:', err));
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -70px 0px',
      }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-9 sm:py-12 lg:py-14 bg-[#FAF7F2] border-b border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-6 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.2em] mb-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>MOST LOVED PIECES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-950 tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              Iconic designs worn and adored everyday.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Scroll Navigation Buttons */}
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 shadow-sm hover:border-gold hover:text-gold-dark flex items-center justify-center text-charcoal-dark transition-all cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 shadow-sm hover:border-gold hover:text-gold-dark flex items-center justify-center text-charcoal-dark transition-all cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <Link
              to="/shop?collection=best-sellers"
              className="hidden md:inline-flex items-center gap-1 ml-4 text-xs font-semibold text-charcoal-dark hover:text-gold-dark transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Scrollable Product Showcase with One-by-One Staggered Entrance */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
        >
          {bestSellers.map((product, idx) => (
            <div
              key={product.id}
              className={`w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start transform transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-14 scale-[0.95] pointer-events-none'
              }`}
              style={{
                transitionDelay: isVisible ? `${idx * 220}ms` : '0ms',
              }}
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersGrid;
