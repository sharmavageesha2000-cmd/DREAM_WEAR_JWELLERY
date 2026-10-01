import React from 'react';
import { Star, CheckCircle2, Sparkles } from 'lucide-react';

export const TestimonialCarousel: React.FC = () => {
  const reviews = [
    {
      id: 1,
      author: 'Ananya Deshmukh',
      location: 'Mumbai',
      productName: 'Paperclip Link Toggle Bracelet',
      review:
        'Simple, elegant and exactly what I wanted for everyday wear. I wear it to hot yoga, shower with it, and it has not faded even slightly after 6 months!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: 'Verified Buyer • 2 weeks ago',
    },
    {
      id: 2,
      author: 'Pooja Iyer',
      location: 'Bengaluru',
      productName: 'Herringbone Flat Snake Chain',
      review:
        'The gold color is rich and understated — not that harsh artificial yellow. Sits completely flat against my collarbones and feels like real 18K solid gold.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      time: 'Verified Buyer • 1 month ago',
    },
    {
      id: 3,
      author: 'Rhea Sengupta',
      location: 'New Delhi',
      productName: 'Sculpted Wave Cuff Bracelet',
      review:
        'The fluid wave architecture gets compliments everywhere I go. It has substantial weight yet feels like a second skin. 100% anti-tarnish promise is real.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      time: 'Verified Buyer • 3 weeks ago',
    },
  ];

  return (
    <section className="relative py-9 sm:py-12 lg:py-14 bg-[#FAF7F2] border-b border-stone-200/80 overflow-hidden">
      {/* Ambient Celestial Orbit Rings in Background */}
      <div className="absolute -top-32 -right-32 w-[440px] h-[440px] border border-dashed border-amber-400/15 rounded-full pointer-events-none animate-spin-slow" />
      <div className="absolute -bottom-36 -left-36 w-[520px] h-[520px] border border-dashed border-stone-300/40 rounded-full pointer-events-none animate-spin-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] border border-dashed border-amber-300/10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header with Orbit Swarm Hub */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-6 text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.2em] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>SOCIAL PROOF</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-950 tracking-tight">
              Loved By Everyday Icons.
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1.5 leading-relaxed">
              Real reviews from real jewelry lovers wearing DREAM WEAR everyday. Verified buyers continuously orbiting our community.
            </p>
          </div>

          {/* ======================================================== */}
          {/* ORBIT SWARM EFFECT: Interactive Social Proof Showcase   */}
          {/* Hover to accelerate rotation into a high-speed swarm!   */}
          {/* ======================================================== */}
          <div
            className="group orbit-stage relative p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-luxury hover:shadow-2xl transition-all duration-500 flex flex-col items-center self-start lg:self-auto overflow-hidden select-none cursor-pointer"
            title="Hover to accelerate orbit swarm speed!"
          >
            {/* Header pill inside the orbit card */}
            <div className="flex items-center justify-between w-full mb-1 z-20">
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>ORBIT SWARM</span>
              </span>
              <span className="text-[9px] font-semibold text-stone-400 group-hover:text-amber-600 transition-colors uppercase tracking-wider">
                ⚡ Hover to Accelerate
              </span>
            </div>

            {/* Orbit Arena */}
            <div className="relative w-[190px] h-[190px] flex items-center justify-center my-1">
              {/* Central Glowing Core (orbit-center) */}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white flex flex-col items-center justify-center shadow-gold-glow border border-amber-300/60 group-hover:scale-105 transition-transform duration-300">
                <div className="flex items-center text-xs font-black tracking-tight">
                  <span>4.9</span>
                  <Star className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <span className="text-[8px] uppercase tracking-wider font-semibold text-amber-100">
                  2,000+
                </span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
              </div>

              {/* TRACK 1: Inner Orbit Track (Clockwise, 100px diameter) */}
              <div className="orbit-track w-[105px] h-[105px] top-[calc(50%-52.5px)] left-[calc(50%-52.5px)] border border-dashed border-amber-400/60 rounded-full">
                {/* Satellite 1A: 18K Gold Sparkle Gem (at 45deg) */}
                <div className="absolute inset-0 rotate-45">
                  <div className="orbit-satellite absolute -top-3 left-[calc(50%-12px)] pointer-events-auto">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center shadow-md border border-white">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Satellite 1B: Verified Purchase Check (at 225deg) */}
                <div className="absolute inset-0 rotate-[225deg]">
                  <div className="orbit-satellite absolute -top-3 left-[calc(50%-12px)] pointer-events-auto">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border border-white">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* TRACK 2: Outer Orbit Track (Counter-Clockwise, 165px diameter) */}
              <div className="orbit-track-reverse w-[165px] h-[165px] top-[calc(50%-82.5px)] left-[calc(50%-82.5px)] border border-dashed border-stone-300/90 rounded-full">
                {/* Satellite 2A: Ananya Avatar (at 0deg) */}
                <div className="absolute inset-0 rotate-0">
                  <div className="orbit-satellite absolute -top-4 left-[calc(50%-16px)] pointer-events-auto">
                    <img
                      src={reviews[0].avatar}
                      alt={reviews[0].author}
                      title={reviews[0].author}
                      className="w-8 h-8 rounded-full border-2 border-amber-400 object-cover shadow-md hover:scale-115 transition-transform"
                    />
                  </div>
                </div>

                {/* Satellite 2B: Pooja Avatar (at 120deg) */}
                <div className="absolute inset-0 rotate-[120deg]">
                  <div className="orbit-satellite absolute -top-4 left-[calc(50%-16px)] pointer-events-auto">
                    <img
                      src={reviews[1].avatar}
                      alt={reviews[1].author}
                      title={reviews[1].author}
                      className="w-8 h-8 rounded-full border-2 border-amber-400 object-cover shadow-md hover:scale-115 transition-transform"
                    />
                  </div>
                </div>

                {/* Satellite 2C: Rhea Avatar (at 240deg) */}
                <div className="absolute inset-0 rotate-[240deg]">
                  <div className="orbit-satellite absolute -top-4 left-[calc(50%-16px)] pointer-events-auto">
                    <img
                      src={reviews[2].avatar}
                      alt={reviews[2].author}
                      title={reviews[2].author}
                      className="w-8 h-8 rounded-full border-2 border-amber-400 object-cover shadow-md hover:scale-115 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Summary in Orbit Card */}
            <div className="mt-1 text-center z-20">
              <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold">
                {'★'.repeat(5)}
                <span className="text-charcoal-dark text-[11px] font-bold ml-1">4.9 / 5 Rating</span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium mt-0.5">
                Over 2,000+ Verified 5-Star Reviews
              </p>
            </div>
          </div>
        </div>

        {/* Review Cards Grid with Micro Orbit Avatar Rings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="group p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 hover:border-amber-400/60 hover:shadow-luxury transition-all duration-300 flex flex-col justify-between text-left space-y-4 relative overflow-hidden"
            >
              {/* Subtle background ambient hover glow on card */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/15 transition-colors pointer-events-none" />

              <div className="space-y-3 relative z-10">
                {/* Rating Stars & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5 text-xs">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                  </span>
                </div>

                {/* Review Text */}
                <p className="font-serif text-base sm:text-lg text-charcoal-dark leading-snug font-normal">
                  "{rev.review}"
                </p>

                {/* Product Mention */}
                <span className="inline-block text-[11px] font-semibold text-gold-dark">
                  Product: {rev.productName}
                </span>
              </div>

              {/* Author Row with Micro-Orbit Avatar Ring */}
              <div className="pt-4 border-t border-stone-100 flex items-center gap-3 relative z-10">
                <div className="relative">
                  {/* Micro Orbit Ring around Author Avatar */}
                  <div className="orbit-track absolute -inset-1.5 border border-dashed border-amber-400/40 rounded-full pointer-events-none group-hover:border-amber-500 transition-colors">
                    <div className="absolute -top-1 left-[calc(50%-4px)]">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                    </div>
                  </div>

                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200 relative z-1"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-charcoal-dark group-hover:text-amber-800 transition-colors">
                    {rev.author}
                  </h4>
                  <p className="text-[10px] text-stone-400 font-light">
                    {rev.location} • {rev.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
