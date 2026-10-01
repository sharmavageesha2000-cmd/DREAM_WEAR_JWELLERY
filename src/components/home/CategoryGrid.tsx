import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, RotateCcw } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      id: 'necklaces',
      name: 'Necklaces',
      subtitle: 'Chains & Pendants',
      image: '/images/categories/cat_necklaces.jpg',
      itemCount: '8 Pieces',
    },
    {
      id: 'earrings',
      name: 'Earrings',
      subtitle: 'Hoops & Huggies',
      image: '/images/categories/cat_earrings.jpg',
      itemCount: '7 Pieces',
    },
    {
      id: 'rings',
      name: 'Rings',
      subtitle: 'Bands & Stacks',
      image: '/images/categories/cat_rings.jpg',
      itemCount: '7 Pieces',
    },
    {
      id: 'bracelets',
      name: 'Bracelets',
      subtitle: 'Cuffs & Links',
      image: '/images/categories/cat_bracelets.jpg',
      itemCount: '7 Pieces',
    },
    {
      id: 'anklets',
      name: 'Anklets',
      subtitle: 'Silver & Gold Payals',
      image: '/images/categories/cat_anklets.jpg',
      itemCount: '3 Pieces',
    },
    {
      id: 'nose-pins',
      name: 'Nose Pins',
      subtitle: 'Studs & Hoops',
      image: '/images/categories/cat_nose_pins.jpg',
      itemCount: '3 Pieces',
    },
    {
      id: 'toe-rings',
      name: 'Toe Rings',
      subtitle: 'Adjustable Bichiyas',
      image: '/images/categories/cat_toe_rings.jpg',
      itemCount: '3 Pairs',
    },
    {
      id: 'sets',
      name: 'Jewelry Sets',
      subtitle: 'Curated Duos',
      image: '/images/categories/cat_sets.jpg',
      itemCount: '4 Sets',
    },
  ];

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  const replayEffect = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
    }, 150);
  };

  return (
    <section
      className="py-9 sm:py-12 lg:py-14 bg-[#FAF7F2] border-b border-stone-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-stone-500 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>CURATED CATEGORIES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-950 tracking-tight">
              Find Your Daily Essentials.
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              Explore our systematic collection of shower-safe, anti-tarnish jewelry across gold and silver.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={replayEffect}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-charcoal-dark px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors shadow-2xs"
              title="Replay slide-in effect"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gold" />
              <span className="text-[11px] font-medium">Replay Effect</span>
            </button>

            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal-dark hover:text-gold-dark group transition-colors"
            >
              <span>Explore All Pieces</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Systematic Oval Catalog Grid with Smooth Scroll Entrance Observed on Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-center"
        >
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className={`group flex flex-col items-center text-center space-y-3.5 cursor-pointer transform transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-12 scale-[0.96] pointer-events-none'
              }`}
              style={{
                transitionDelay: isVisible ? `${idx * 160}ms` : '0ms',
              }}
            >
              {/* Elegant Oval Portal Frame */}
              <div className="relative w-full max-w-[210px] aspect-[3/4] rounded-[5.5rem] overflow-hidden bg-ivory-warm p-1.5 ring-1 ring-stone-300/80 group-hover:ring-gold transition-all duration-700 shadow-sm group-hover:shadow-luxury group-hover:-translate-y-2">
                {/* Inner Oval Image Container */}
                <div className="w-full h-full rounded-[5rem] overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-1000 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />

                  {/* Micro Floating Badge */}
                  <div className="absolute top-3 inset-x-0 flex justify-center z-10">
                    <span className="text-[9px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-charcoal-dark shadow-2xs">
                      {cat.itemCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Typography & Metadata */}
              <div className="space-y-0.5">
                <h3 className="font-serif text-base sm:text-lg font-medium text-charcoal-dark group-hover:text-gold-dark transition-colors duration-500">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-stone-500 font-light tracking-wide">
                  {cat.subtitle}
                </p>
                <div className="pt-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-gold-dark opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-500">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
