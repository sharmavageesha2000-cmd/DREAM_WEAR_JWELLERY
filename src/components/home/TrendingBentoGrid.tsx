import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

export const TrendingBentoGrid: React.FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const bentoItems = [
    {
      id: 'anti-tarnish',
      title: 'The Anti-Tarnish Edit',
      subtitle: 'Shower-safe 18K Real Gold on surgical steel',
      badge: 'Core Signature',
      image: '/images/categories/cat_necklaces.jpg',
      to: '/shop?collection=anti-tarnish',
    },
    {
      id: 'minimalist',
      title: 'Everyday Minimalist',
      subtitle: 'Subtle chains & dainty bands',
      badge: 'Daily Essentials',
      image: '/images/categories/cat_rings.jpg',
      to: '/shop?collection=minimalist',
    },
    {
      id: 'gift-sets',
      title: 'Curated Gift Sets',
      subtitle: 'Pairings in signature silk box packaging',
      badge: 'Save up to 25%',
      image: '/images/categories/cat_sets.jpg',
      to: '/shop?category=sets',
    },
    {
      id: 'party-edit',
      title: 'The Statement Edit',
      subtitle: '5A CZ Tennis crystal shimmer for celebrations',
      badge: 'Party Ready',
      image: '/images/products/cand_tennis.jpg',
      to: '/shop?category=bracelets',
    },
    {
      id: 'everyday-wear',
      title: 'Sculpted Cuffs & Bangles',
      subtitle: 'Architectural fluid wristwear statements',
      badge: 'Trending Now',
      image: '/images/products/wave_cuff_1.jpg',
      to: '/shop?category=bracelets',
    },
  ];

  // Tripled list ensures completely seamless, continuous loop without gaps on large monitors
  const marqueeItems = [...bentoItems, ...bentoItems, ...bentoItems];

  const handleScroll = (direction: 'left' | 'right') => {
    if (marqueeRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      marqueeRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-9 sm:py-12 lg:py-14 bg-[#FAF7F2] border-b border-stone-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-5 sm:mb-6">
        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-stone-500 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>DISCOVER COLLECTIONS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-950 tracking-tight">
              Trending Curations
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1 max-w-lg">
              Handpicked capsules styled for your daily mood and signature aesthetic.
            </p>
          </div>

          {/* Marquee Interactive Controls */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-charcoal-dark border border-stone-200 text-xs font-medium transition-colors shadow-2xs"
              aria-label={isPaused ? 'Resume marquee' : 'Pause marquee'}
              title={isPaused ? 'Play marquee' : 'Pause marquee'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-gold-dark fill-gold-dark" />
                  <span className="text-[11px] font-semibold">Play Marquee</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-stone-600" />
                  <span className="text-[11px] text-stone-600">Pause</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleScroll('left')}
              className="p-2 rounded-xl bg-white hover:bg-stone-100 text-charcoal-dark border border-stone-200 transition-colors shadow-2xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-stone-600" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-xl bg-white hover:bg-stone-100 text-charcoal-dark border border-stone-200 transition-colors shadow-2xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Horizontal Track Container with Edge Gradient Masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left and Right Edge Soft Gradient Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 lg:w-32 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 lg:w-32 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-20" />

        {/* Continuous Infinite Scrolling Track */}
        <div
          ref={marqueeRef}
          className="w-full overflow-x-auto no-scrollbar"
        >
          <div
            className="animate-marquee-smooth flex gap-5 sm:gap-6 py-2 px-6"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              animationDuration: '38s',
            }}
          >
            {marqueeItems.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                to={item.to}
                className="group relative flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] h-[380px] sm:h-[420px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-[#DFCEB7] transition-all duration-500 bg-[#F5EFE6] flex flex-col justify-between"
              >
                {/* Background Editorial Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Warm Luxury Espresso Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2119]/80 via-[#2C2119]/20 to-transparent group-hover:via-[#2C2119]/30 transition-all duration-500" />

                {/* Top Badge */}
                <div className="relative z-10 p-5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#3D312A] shadow-xs inline-block">
                    {item.badge}
                  </span>
                </div>

                {/* Bottom Content with Arrow Action */}
                <div className="relative z-10 p-5 sm:p-6 flex items-end justify-between text-left text-white">
                  <div className="space-y-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-normal text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#FAF7F2] font-light max-w-xs line-clamp-1 opacity-90">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/95 text-[#3D312A] flex items-center justify-center transform group-hover:scale-110 group-hover:bg-[#B88E3A] group-hover:text-white transition-all shadow-md flex-shrink-0 ml-3">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
