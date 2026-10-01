import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options = [], error, children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full py-2.5 pl-3.5 pr-10 bg-white rounded-xl border text-xs sm:text-sm text-charcoal-dark appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold cursor-pointer ${
              error ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500' : 'border-stone-200'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {children}
          </select>
          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 pointer-events-none" />
        </div>
        {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
