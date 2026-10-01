import React from 'react';
import { Truck, Clock, ShieldCheck } from 'lucide-react';
import { brandConfig } from '../config/brandConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ShippingDelivery: React.FC = () => {
  return (
    <div className="py-8 sm:py-16 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shipping & Delivery' },
          ]}
        />

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-dark font-semibold">
            Domestic & International Delivery
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal-dark">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            Every piece is safely packed in our luxury tamper-evident signature packaging.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-2 text-center">
            <Truck className="w-6 h-6 text-gold mx-auto" />
            <h3 className="font-serif text-base font-bold text-charcoal">Free Shipping</h3>
            <p className="text-xs text-stone-500">On all orders above ₹{brandConfig.shipping.freeShippingThreshold}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-2 text-center">
            <Clock className="w-6 h-6 text-gold mx-auto" />
            <h3 className="font-serif text-base font-bold text-charcoal">2-4 Business Days</h3>
            <p className="text-xs text-stone-500">Fast delivery across 19,000+ PIN codes</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-2 text-center">
            <ShieldCheck className="w-6 h-6 text-gold mx-auto" />
            <h3 className="font-serif text-base font-bold text-charcoal">100% Insured Transit</h3>
            <p className="text-xs text-stone-500">Full transit insurance on all shipments</p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6 text-xs text-stone-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal">1. Order Processing & Dispatch</h2>
            <p>
              All orders are dispatched from our Mumbai Atelier within 24 hours of placement (excluding Sundays and national holidays). Each jewelry piece undergoes a 3-point quality check, ultrasonic cleaning, and individual velvet packaging prior to dispatch.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal">2. Delivery Timelines & Charges</h2>
            <div className="p-4 bg-ivory rounded-2xl border border-stone-200 space-y-2">
              <div className="flex justify-between font-semibold text-charcoal">
                <span>Standard Delivery (Orders ₹999 and above)</span>
                <span className="text-emerald-700">FREE</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Standard Delivery (Orders below ₹999)</span>
                <span>₹99 flat fee</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Priority Air Courier (1-2 Days)</span>
                <span>₹199</span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal">3. Tracking Your Shipment</h2>
            <p>
              Once your parcel has been handed over to our courier partner (Bluedart, Delhivery, or DTDC), an automated SMS and email containing your live tracking URL and tracking number will be dispatched to you.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-charcoal">4. Cash on Delivery (COD)</h2>
            <p>
              We provide Cash on Delivery across 99% of serviced Indian pin codes. Please ensure someone is available at the delivery location with the exact payable amount to collect your package.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};
