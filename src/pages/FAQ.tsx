import React, { useState } from 'react';
import { Search, ShieldCheck, HelpCircle } from 'lucide-react';
import { faqItems } from '../data/faq';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FAQAccordion } from '../components/common/FAQAccordion';

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 2]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = faqItems.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="py-8 sm:py-16 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Frequently Asked Questions' },
          ]}
        />

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-light/20 text-gold-dark text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal-dark">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            Everything you need to know about our waterproof 18K gold technology, shipping timelines, sizing, and 2-year warranty.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. anti-tarnish, shower, returns, payments)..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-stone-200 text-xs text-charcoal shadow-sm focus:outline-none focus:border-gold"
          />
        </div>

        {/* 6 Category Filter Chips */}
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'products', label: 'Products & Sizing' },
            { id: 'anti-tarnish', label: 'Anti-Tarnish Science' },
            { id: 'shipping', label: 'Shipping & Delivery' },
            { id: 'returns', label: 'Returns & Warranty' },
            { id: 'payments', label: 'Payments & Security' },
            { id: 'orders', label: 'Orders & Gifting' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`text-xs px-4 py-2 rounded-xl font-medium transition-all ${
                activeCategory === tab.id
                  ? 'bg-charcoal text-ivory-light shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordions List using FAQAccordion reusable component */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              No matching questions found for &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <FAQAccordion
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndices.includes(index)}
                onToggle={() => toggleIndex(index)}
              />
            ))
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="p-8 bg-ivory-warm rounded-3xl border border-gold-satin/40 text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-gold mx-auto" />
          <h2 className="font-serif text-xl font-semibold text-charcoal">Still have a question?</h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Our atelier specialists are available on WhatsApp and email to assist you with any styling or order queries.
          </p>
          <div className="pt-2">
            <a
              href="/contact"
              className="inline-block px-6 py-2.5 bg-charcoal text-ivory-light text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gold-dark transition-colors shadow-sm"
            >
              Contact Concierge
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
