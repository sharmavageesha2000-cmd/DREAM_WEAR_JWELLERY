import React, { useState, useEffect, useRef } from 'react';
import { Droplets, ShieldCheck, Heart, Sparkles, Check, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MaterialFeature {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  specs: string[];
  image: string;
  imageCaption: string;
}

export const InteractiveMaterialSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('water-resistant');
  const [isInView, setIsInView] = useState<boolean>(false);
  const [animKey, setAnimKey] = useState<number>(0);
  const [manualZoom, setManualZoom] = useState<'in' | 'out' | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const features: MaterialFeature[] = [
    {
      id: 'water-resistant',
      title: 'Water Resistant',
      subtitle: 'Shower, swim & workout safe',
      icon: Droplets,
      badge: '100% Shower-Safe',
      description:
        'Engineered for true waterproof resilience. Our atomic PVD coating binds real 18K gold to surgical grade steel inside a high-vacuum chamber, creating an impenetrable shield against water, chlorine, and saltwater.',
      specs: [
        'Zero moisture oxidation or discoloration',
        'Safe for daily hot showers and steam rooms',
        'Ocean-safe & pool-tested durability',
      ],
      image: '/images/products/cand_tennis.jpg',
      imageCaption: '18K Yellow Gold 4-Prong Tennis Bracelet in active water environment',
    },
    {
      id: 'anti-tarnish',
      title: 'Anti-Tarnish',
      subtitle: 'Long-lasting brilliant shine',
      icon: ShieldCheck,
      badge: '2-Year Color Guarantee',
      description:
        'Forget dull, tarnished jewelry. Traditional plating wears off within weeks because brass reacts with air. Our proprietary vacuum deposition process ensures your gold keeps its warm atelier glow year after year.',
      specs: [
        '10x thicker than standard electroplating',
        'Resistant to perfumes, lotions & sweat',
        'Backed by our 730-day no-questions replacement warranty',
      ],
      image: '/images/products/wave_cuff_1.jpg',
      imageCaption: 'Sculpted Wave Cuff Bracelet with high-polish 18K gold luster',
    },
    {
      id: 'skin-friendly',
      title: 'Skin Friendly',
      subtitle: 'Hypoallergenic & nickel-free',
      icon: Heart,
      badge: '316L Medical Steel',
      description:
        'No green skin, no itching, no redness. We use pure surgical-grade 316L stainless steel — the exact material trusted for medical implants — making it 100% hypoallergenic even for ultra-sensitive skin.',
      specs: [
        '100% Lead-free, Cadmium-free & Nickel-free',
        'Never leaves green residue or irritation',
        'Dermatologist approved for 24/7 continuous wear',
      ],
      image: '/images/products/aur_b_03_1.jpg',
      imageCaption: 'Freshwater Pearl Bar Bracelet with hypoallergenic gold link chain',
    },
    {
      id: 'everyday-ready',
      title: 'Everyday Ready',
      subtitle: 'Engineered for seamless lifestyle',
      icon: Sparkles,
      badge: 'Featherlight Comfort',
      description:
        'Designed to be worn effortlessly from morning gym sessions to executive boardrooms and evening celebrations. Lightweight ergonomics ensure you barely feel them on, while the aesthetic remains elevated.',
      specs: [
        'Ergonomic contouring for effortless fit',
        'Snag-free links and reinforced clasps',
        'Effortless modular layering across all pieces',
      ],
      image: '/images/categories/cat_bracelets.jpg',
      imageCaption: 'Minimalist solid gold bangle stack with comfortable contour fit',
    },
  ];

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
          setManualZoom(null);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSelectTab = (tabId: string) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setManualZoom(null);
    setAnimKey((prev) => prev + 1);
  };

  const handleToggleZoom = () => {
    if (manualZoom === 'in') {
      setManualZoom('out');
    } else {
      setManualZoom('in');
    }
  };

  const handleReplaySection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInView(false);
    setManualZoom(null);
    setTimeout(() => {
      setIsInView(true);
      setAnimKey((prev) => prev + 1);
    }, 60);
  };

  const currentFeature = features.find((f) => f.id === activeTab) || features[0];
  const CurrentIcon = currentFeature.icon;

  return (
    <section
      ref={sectionRef}
      className="py-9 sm:py-12 lg:py-14 bg-white border-b border-stone-200/80 overflow-hidden relative"
    >
      {/* Whole Section Zoom-Out Animated Container */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 transform origin-center transition-all duration-[3000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isInView
            ? 'scale-100 opacity-100'
            : 'scale-[1.10] opacity-80'
        }`}
      >
        {/* Section Header: Text appears slowly */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.2em] mb-1.5 transform transition-all duration-[2000ms] delay-[150ms] ease-out ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-3'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>SCIENCE & CRAFT</span>
          </div>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-light text-stone-950 tracking-tight transform transition-all duration-[2400ms] delay-[350ms] ease-out ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Designed To Stay Beautiful.
          </h2>
          <p
            className={`text-xs sm:text-sm text-stone-500 font-light mt-1.5 leading-relaxed transform transition-all duration-[2600ms] delay-[600ms] ease-out ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'
            }`}
          >
            Click each innovation below to discover why DREAM WEAR pieces never tarnish, irritate, or fade.
          </p>
        </div>

        {/* Interactive Feature Visualizer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: 4 Interactive SaaS Accordion Cards appearing slowly */}
          <div className="lg:col-span-6 space-y-3 text-left">
            {features.map((f, index) => {
              const isActive = activeTab === f.id;
              const Icon = f.icon;
              const cardDelay = 400 + index * 220; // Staggered slow appearance

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleSelectTab(f.id)}
                  style={{
                    transitionDelay: isInView ? `${cardDelay}ms` : '0ms',
                  }}
                  className={`w-full p-4 sm:p-5 rounded-2xl border text-left cursor-pointer flex flex-col justify-between transform transition-all duration-[2200ms] ease-out ${
                    isInView
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-6'
                  } ${
                    isActive
                      ? 'bg-[#FAF8F5] border-gold shadow-md ring-1 ring-gold/40'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-gradient-to-br from-[#B88E3A] to-[#8E6A22] text-white shadow-sm'
                            : 'bg-[#F2ECE1] text-[#7A6759]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-medium text-charcoal-dark">
                          {f.title}
                        </h3>
                        <p className="text-[11px] text-stone-500 font-light">{f.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full ${
                          isActive ? 'bg-gold-light/20 text-gold-dark' : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {f.badge}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isActive ? 'rotate-90 text-gold-dark' : 'text-stone-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Content on Active */}
                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-stone-200/80 space-y-3 animate-fade-in">
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {f.description}
                      </p>
                      <div className="space-y-1.5 pt-1">
                        {f.specs.map((spec) => (
                          <div key={spec} className="flex items-center gap-2 text-xs text-charcoal-dark">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Feature Visual Card appearing smoothly */}
          <div
            className={`lg:col-span-6 transform transition-all duration-[2600ms] delay-[500ms] ease-out ${
              isInView
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-6 scale-[1.04]'
            }`}
          >
            <div
              ref={visualRef}
              className="group/visual relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-950 aspect-[4/3] sm:aspect-square lg:aspect-[4/3]"
            >
              <img
                key={`${currentFeature.id}-${animKey}-${manualZoom || 'auto'}`}
                src={currentFeature.image}
                alt={currentFeature.title}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[3200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  manualZoom === 'in'
                    ? 'scale-[1.36]'
                    : manualZoom === 'out'
                    ? 'scale-100'
                    : isInView
                    ? 'scale-100'
                    : 'scale-[1.15]'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-stone-950/20 pointer-events-none" />

              {/* Overlay Tags & Zoom Controls */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-charcoal-dark text-xs font-semibold shadow-sm">
                  <CurrentIcon className="w-3.5 h-3.5 text-gold-dark" />
                  <span>{currentFeature.title} Mode</span>
                </span>

                <div className="flex items-center gap-2 pointer-events-auto">
                  {/* Replay slow zoom & text reveal button */}
                  <button
                    type="button"
                    onClick={handleReplaySection}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white backdrop-blur-md text-charcoal-dark hover:text-gold-dark text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
                    title="Replay full section zoom-out and slow text reveal"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gold-dark" />
                    <span className="hidden sm:inline">Replay</span>
                  </button>

                  {/* Zoom In / Zoom Out toggle button */}
                  <button
                    type="button"
                    onClick={handleToggleZoom}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white backdrop-blur-md text-charcoal-dark text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
                    title={
                      manualZoom === 'in'
                        ? 'Click to zoom out (full view)'
                        : 'Click to zoom in (atomic macro detail)'
                    }
                  >
                    {manualZoom === 'in' ? (
                      <>
                        <ZoomOut className="w-3.5 h-3.5 text-gold-dark" />
                        <span>Zoom Out</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn className="w-3.5 h-3.5 text-gold-dark" />
                        <span>Zoom In</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Caption */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 text-left text-white">
                <span className="text-[10px] uppercase tracking-widest text-gold-light font-bold block mb-1">
                  MATERIAL CLOSE-UP •{' '}
                  {manualZoom === 'in' ? '10X ATOMIC MACRO' : 'FULL ATELIER PERSPECTIVE'}
                </span>
                <p className="font-serif text-lg sm:text-xl font-normal text-white">
                  {currentFeature.imageCaption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
