import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQAccordionProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
  className = '',
}) => {
  return (
    <div className={`border-b border-stone-100 py-4 last:border-0 ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left gap-4 group"
      >
        <h4 className="font-serif text-base sm:text-lg font-medium text-charcoal group-hover:text-gold-dark transition-colors">
          {question}
        </h4>
        <div className="w-6 h-6 rounded-full bg-ivory flex items-center justify-center flex-shrink-0 text-stone-500 group-hover:text-charcoal transition-colors">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-white rounded-2xl border border-stone-200/80 text-xs sm:text-sm text-stone-600 font-light leading-relaxed animate-fade-in shadow-2xs">
          {answer}
        </div>
      )}
    </div>
  );
};
