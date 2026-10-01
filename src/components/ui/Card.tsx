import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'dark' | 'outline';
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', hoverEffect = false, className = '', ...props }, ref) => {
    const baseStyles = 'rounded-2xl transition-all duration-300 overflow-hidden';

    const variantStyles = {
      default: 'bg-white border border-stone-200/70 shadow-sm',
      elevated: 'bg-white border border-stone-200/60 shadow-luxury',
      glass: 'bg-white/80 backdrop-blur-md border border-white/60 shadow-luxury',
      dark: 'bg-gradient-to-br from-[#3D312A] to-[#2C2119] text-[#FAF8F5] border border-[#584635] shadow-xl',
      outline: 'bg-transparent border border-stone-200',
    };

    const hoverStyles = hoverEffect
      ? 'hover:shadow-luxury-hover hover:border-gold-satin/40 hover:-translate-y-1'
      : '';

    return (
      <div ref={ref} className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
