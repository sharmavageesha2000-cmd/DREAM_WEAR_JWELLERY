import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 pointer-events-none text-stone-400 flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full py-2.5 bg-white rounded-xl border text-xs sm:text-sm text-charcoal-dark placeholder:text-stone-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold disabled:bg-stone-50 disabled:text-stone-400 ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
              error ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500' : 'border-stone-200'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 pointer-events-none text-stone-400 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
        {!error && helperText && <p className="text-[11px] text-stone-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
