import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { brandConfig } from '../config/brandConfig';

export const PrivacyTerms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="py-8 sm:py-16 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions' },
          ]}
        />

        {/* Tab Switcher Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal-dark">
            Legal & Maison Policies
          </h1>
          <div className="inline-flex p-1 bg-white rounded-2xl border border-stone-200 shadow-sm text-xs font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-2.5 rounded-xl transition-all ${
                activeTab === 'privacy' ? 'bg-charcoal text-ivory-light shadow-sm' : 'text-stone-500 hover:text-charcoal'
              }`}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-2.5 rounded-xl transition-all ${
                activeTab === 'terms' ? 'bg-charcoal text-ivory-light shadow-sm' : 'text-stone-500 hover:text-charcoal'
              }`}
            >
              Terms & Conditions
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6 text-xs text-stone-600 leading-relaxed">
          {activeTab === 'privacy' ? (
            <div className="space-y-6 animate-fade-in">
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-semibold text-charcoal">1. Information We Collect</h2>
                <p>
                  At {brandConfig.name}, we value your trust and privacy. When you browse our atelier catalog, register an account, or place an order, we collect essential information including your name, email address, shipping destination, phone number, and transaction logs.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-semibold text-charcoal">2. How We Use Your Data</h2>
                <p>
                  Your information is utilized strictly to:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-stone-600">
                  <li>Fulfill and dispatch jewelry orders with real-time SMS/email tracking.</li>
                  <li>Register and manage your 2-Year Anti-Tarnish Warranty Certificate.</li>
                  <li>Deliver VIP exclusive capsule previews if subscribed to our newsletter.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-semibold text-charcoal">3. Payment Security & Encryption</h2>
                <p>
                  We never store your raw credit card numbers or banking passwords. All electronic payments are processed through RBI-approved, PCI-DSS Level 1 compliant secure gateways with end-to-end 256-bit SSL encryption.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <section className="space-y-2">
                <h2 className="font-serif text-lg font-semibold text-charcoal">1. Terms of Maison Service</h2>
                <p>
                  By accessing or purchasing from {brandConfig.name} Atelier, you agree to abide by these terms of service, all applicable laws and regulations in India.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-semibold text-charcoal">2. Anti-Tarnish Guarantee Limitations</h2>
                <p>
                  Our 2-Year Anti-Tarnish Warranty applies to all chemical discoloration, tarnishing, and corrosion from regular daily wear (water, gym, sweat, chlorine). It does not cover severe physical crushing, intentional tampering, or loss of items.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-lg font-semibold text-charcoal">3. Product Descriptions & Photography</h2>
                <p>
                  All our photography represents authentic pieces under natural daylight studio conditions. Natural AAA freshwater pearls may possess minor organic variations in texture and shape as each pearl is unique.
                </p>
              </section>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
