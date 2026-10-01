import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-charcoal-dark min-h-[380px] sm:min-h-[440px] flex items-center">
          
          {/* Background Editorial Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=80"
              alt="Everyday Jewelry Edit"
              className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark via-charcoal-dark/85 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-xl p-8 sm:p-12 lg:p-16 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold text-xs font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Editorial Capsule</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ivory leading-tight">
              Your Everyday <br />
              <span className="italic text-gold-light font-serif">Jewelry Edit.</span>
            </h2>

            <p className="text-xs sm:text-sm lg:text-base text-stone-300 font-light leading-relaxed">
              Minimal pieces designed for every outfit. From morning coffee runs to boardroom meetings and candlelit dinners—effortless style that never asks to be taken off.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-ivory-light hover:bg-white text-charcoal-dark text-xs font-semibold uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <span>Shop The Edit</span>
                <ArrowRight className="w-4 h-4 text-gold-dark group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
