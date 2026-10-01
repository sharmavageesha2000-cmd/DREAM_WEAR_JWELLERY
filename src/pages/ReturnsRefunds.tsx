import React from 'react';
import { ShieldCheck, RotateCcw, Clock } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ReturnsRefunds: React.FC = () => {
  return (
    <div className="py-8 sm:py-16 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Returns & 2-Year Warranty' },
          ]}
        />

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-light/20 text-gold-dark text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guaranteed Peace of Mind</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal-dark">
            2-Year Anti-Tarnish Warranty & Returns
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            We stand behind every weld, stone setting, and vacuum PVD gold layer with unwavering confidence.
          </p>
        </div>

        {/* Highlight Guarantee Box */}
        <div className="bg-gradient-to-br from-[#FFFDF9] via-[#F8F2E8] to-[#EFE2CE] text-[#332924] rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-300/70 space-y-4">
          <div className="flex items-center gap-3 text-[#B88E3A]">
            <ShieldCheck className="w-8 h-8" />
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2119]">
              The 2-Year Anti-Tarnish Promise
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B5A4E] font-light leading-relaxed">
            If your DREAM WEAR jewelry tarnishes, turns black, rusts, or turns your skin green within <strong>2 full years (730 days)</strong> of your purchase date under normal daily wear, we will replace the item with a brand new piece free of charge. No questions asked.
          </p>
        </div>

        {/* Detailed Policy Text */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6 text-xs text-stone-600 leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-serif text-lg font-semibold text-charcoal flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-gold-dark" />
              <span>7-Day Return & Exchange Window</span>
            </h3>
            <p>
              We accept returns or exchanges for unused pieces within <strong>7 days of package delivery</strong>. To be eligible for a return:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 pl-2">
              <li>The item must be in its original, unworn condition with tags intact.</li>
              <li>The original luxury velvet gift pouch, box, and warranty certificate must be returned together.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-semibold text-charcoal flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-dark" />
              <span>How to Initiate a Warranty Claim or Return</span>
            </h3>
            <p>
              Simply email our concierge team at <a href="mailto:concierge@dreamwearjewelry.com" className="text-gold-dark font-medium underline">concierge@dreamwearjewelry.com</a> or WhatsApp us with your <strong>Order ID (e.g. DW-892147)</strong> and photos of the piece.
            </p>
            <p>
              Our team will arrange a doorstep reverse pickup within 24-48 business hours.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-semibold text-charcoal">Refund Processing</h3>
            <p>
              Once your returned package is received and inspected at our Mumbai Atelier, your refund will be processed back to your original payment method (Bank Account / UPI / Card) within 3-5 business days. For COD orders, refund is transferred directly to your preferred bank account or UPI ID.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};
