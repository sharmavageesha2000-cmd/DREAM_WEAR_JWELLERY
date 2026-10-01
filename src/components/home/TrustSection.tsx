import React from 'react';
import { ShieldCheck, Droplets, Heart, Sparkles } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Anti-Tarnish',
      description: 'Long-lasting shine',
      detail: '2-Year Color Warranty',
    },
    {
      icon: Droplets,
      title: 'Water Resistant',
      description: 'Made for everyday moments',
      detail: 'Shower & Gym Safe',
    },
    {
      icon: Heart,
      title: 'Skin Friendly',
      description: 'Comfort-focused materials',
      detail: 'Hypoallergenic 316L Steel',
    },
    {
      icon: Sparkles,
      title: 'Premium Finish',
      description: 'Designed to last',
      detail: '18K Real Gold Vacuum PVD',
    },
  ];

  return (
    <section className="relative py-7 sm:py-9 bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF9] to-[#FAF7F2] border-y border-stone-200/80 overflow-hidden z-10">
      {/* Ambient background glowing orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-40 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-40 bg-gold-light/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Subtle Luxury Hallmark Ribbon Header */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6 text-center">
          <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400/30" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-amber-300/60 text-amber-900 text-[10px] sm:text-[10.5px] font-brand uppercase tracking-[0.24em] font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>THE DREAM WEAR STANDARD • ZERO TARNISH GUARANTEE</span>
          </div>
          <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400/30" />
        </div>

        {/* 4 Interactive Luxury Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-stone-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-[0_16px_36px_-8px_rgba(212,175,55,0.22)] hover:-translate-y-1.5 transition-all duration-500 ease-out text-left flex flex-col justify-between overflow-hidden cursor-default"
              >
                {/* 18K Gold Expanding Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-gold to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />

                {/* Shimmer Light Reflection Sweep */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

                {/* Top Row: Luxury Icon + Hallmark Stamp */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="relative">
                    {/* Ambient icon glow on hover */}
                    <div className="absolute -inset-1 rounded-2xl bg-amber-400/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF8F5] via-white to-amber-50/50 border border-amber-200/70 group-hover:border-amber-400 group-hover:from-stone-900 group-hover:to-stone-950 flex items-center justify-center text-amber-700 group-hover:text-amber-300 transition-all duration-300 shadow-2xs group-hover:shadow-md group-hover:rotate-3">
                      <Icon className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-stone-100/80 group-hover:bg-amber-500/10 border border-stone-200/60 group-hover:border-amber-400/40 text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-stone-500 group-hover:text-amber-900 transition-all duration-300">
                    {feat.detail}
                  </span>
                </div>

                {/* Bottom Row: Editorial Title & Description */}
                <div className="relative z-10 mt-2">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-900 group-hover:text-amber-900 transition-colors">
                      {feat.title}
                    </h3>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" />
                  </div>
                  <p className="text-xs sm:text-[13px] text-stone-500 font-light mt-1 group-hover:text-stone-700 transition-colors leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
