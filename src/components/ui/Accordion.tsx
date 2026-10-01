import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`divide-y divide-stone-200/80 border-y border-stone-200/80 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-3">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left py-1 text-xs sm:text-sm font-semibold text-charcoal-dark hover:text-gold-dark transition-colors cursor-pointer group"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-2.5">
                {item.icon && <span className="text-gold-dark flex-shrink-0">{item.icon}</span>}
                <span>{item.title}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 group-hover:text-gold-dark transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-gold-dark' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="mt-2.5 p-4 bg-white rounded-2xl border border-stone-200/80 text-xs sm:text-sm text-stone-600 leading-relaxed animate-fade-in shadow-2xs">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
