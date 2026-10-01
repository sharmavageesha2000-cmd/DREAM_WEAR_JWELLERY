import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'dark' | 'new' | 'discount' | 'anti-tarnish' | 'waterproof' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-semibold tracking-wider uppercase rounded-full transition-all select-none';

  const sizeStyles = {
    sm: 'text-[9px] px-2 py-0.5 gap-1',
    md: 'text-[10px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3.5 py-1 gap-1.5',
  };

  const variantStyles = {
    default: 'bg-stone-100 text-stone-700 border border-stone-200',
    gold: 'bg-gold-light/20 text-gold-dark border border-gold/30',
    dark: 'bg-gradient-to-r from-[#B88E3A] to-[#A37B2C] text-white shadow-2xs',
    new: 'bg-[#B88E3A] text-white shadow-2xs',
    discount: 'bg-rose-600 text-white shadow-sm',
    'anti-tarnish': 'bg-white/95 backdrop-blur-md text-gold-dark border border-gold-satin/40 shadow-sm',
    waterproof: 'bg-blue-50 text-blue-800 border border-blue-200/80',
    outline: 'bg-transparent text-stone-600 border border-stone-300',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
