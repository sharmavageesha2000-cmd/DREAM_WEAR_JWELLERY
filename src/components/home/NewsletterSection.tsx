import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiService } from '../../services/api';
import { Button } from '../ui/Button';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [unlockedCoupon, setUnlockedCoupon] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setFeedbackMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await apiService.subscribeNewsletter(email);
      setStatus('success');
      setFeedbackMessage(res.message);
      if (res.couponCode) setUnlockedCoupon(res.couponCode);
      setEmail('');
    } catch {
      setStatus('error');
      setFeedbackMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <section className="py-8 sm:py-11 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Luminous Champagne Silk Rounded Card Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#F8F2E8] to-[#EFE2CE] text-[#332924] p-6 sm:p-9 lg:p-11 overflow-hidden shadow-xl border border-amber-300/60 text-center">
          {/* Subtle gold ambient glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-amber-300/70 text-[10px] sm:text-[10.5px] font-brand uppercase tracking-[0.25em] text-[#8E6A22] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E3A]" />
              <span>THE DREAM WEAR CIRCLE</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2C2119] tracking-tight">
              Stay In The Loop.
            </h2>

            <p className="text-xs sm:text-sm text-[#6B5A4E] font-light leading-relaxed max-w-md mx-auto">
              Get first access to new drops, exclusive offers and styling inspiration. Plus, unlock 10% off your first order.
            </p>

            {status === 'success' ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm animate-fade-in space-y-2 max-w-md mx-auto shadow-2xs">
                <div className="flex items-center justify-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{feedbackMessage}</span>
                </div>
                {unlockedCoupon && (
                  <p className="text-xs text-[#584635] font-light">
                    Use code <span className="font-mono font-bold text-[#8E6A22] px-2 py-0.5 rounded bg-white border border-amber-300 shadow-2xs">{unlockedCoupon}</span> at checkout.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[#A37B2C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#DFCEB7] rounded-xl text-xs sm:text-sm text-[#2C2119] placeholder:text-[#9E8E82] focus:outline-none focus:border-[#B88E3A] focus:ring-1 focus:ring-[#B88E3A] shadow-2xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="md"
                    isLoading={status === 'loading'}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="sm:w-auto shadow-md"
                  >
                    Subscribe
                  </Button>
                </div>

                {status === 'error' && (
                  <p className="text-[11px] text-rose-600 font-medium text-left">{feedbackMessage}</p>
                )}

                <div className="flex items-center justify-center gap-4 text-[10px] text-[#7C6C60] pt-2 font-light">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B88E3A]" /> No spam, ever
                  </span>
                  <span>•</span>
                  <span>Unsubscribe anytime</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
