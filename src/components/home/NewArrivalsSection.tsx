import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getStoredProducts } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { Product } from '../../types';
import { apiService } from '../../services/api';

interface NewArrivalsSectionProps {
  onQuickView?: (product: Product) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ onQuickView }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [newProducts, setNewProducts] = useState<Product[]>(() =>
    getStoredProducts().filter((p) => p.isNew).slice(0, 8)
  );

  useEffect(() => {
    apiService.getProducts({ collection: 'new-arrivals', limit: 8 }).then((res) => {
      if (res && res.data && res.data.length > 0) {
        setNewProducts(res.data);
      }
    }).catch((err) => console.warn('New arrivals API load error:', err));
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

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="new-arrivals"
      className="py-9 sm:py-12 lg:py-14 bg-white border-b border-stone-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-7 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-stone-500 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>JUST DROPPED</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-950 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              Fresh pieces. Modern silhouettes.
            </p>
          </div>

          <Link
            to="/shop?collection=new-arrivals"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal-dark hover:text-gold-dark group transition-colors self-start sm:self-auto"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid with One-by-One Staggered Entrance (Observed on Grid as User Scrolls) */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`transform transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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

export default NewArrivalsSection;
