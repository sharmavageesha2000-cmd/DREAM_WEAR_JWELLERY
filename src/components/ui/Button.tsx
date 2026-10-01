import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'luxury-dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium transition-all duration-300 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    const sizeStyles = {
      xs: 'text-[11px] px-2.5 py-1 rounded-lg gap-1.5',
      sm: 'text-xs px-3.5 py-2 rounded-xl gap-2',
      md: 'text-xs sm:text-[13px] px-5 py-2.5 rounded-xl gap-2 tracking-wide',
      lg: 'text-xs sm:text-sm px-6 py-3.5 rounded-2xl gap-2.5 tracking-wider uppercase font-semibold',
      xl: 'text-sm sm:text-base px-8 py-4 rounded-2xl gap-3 tracking-widest uppercase font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] text-white hover:from-[#A37B2C] hover:to-[#8E6A22] focus-visible:ring-[#B88E3A] shadow-sm hover:shadow-md border border-amber-300/80',
      secondary:
        'bg-[#F4ECE1] text-[#3D312A] hover:bg-[#EAE0D0] border border-[#DFCEB7] focus-visible:ring-amber-400 shadow-xs',
      outline:
        'bg-transparent text-[#3D312A] border border-[#DFCBB5] hover:border-[#B88E3A] hover:bg-[#FAF7F2] hover:text-[#B88E3A] focus-visible:ring-[#B88E3A]',
      ghost:
        'bg-transparent text-stone-700 hover:text-[#2C2119] hover:bg-[#FAF7F2] focus-visible:ring-stone-400',
      gold:
        'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white hover:from-amber-500 hover:to-amber-600 border border-amber-400/40 shadow-md hover:shadow-gold-glow focus-visible:ring-amber-500',
      'luxury-dark':
        'bg-gradient-to-r from-[#3D312A] to-[#2C2119] text-[#FAF8F5] border border-[#584635] hover:border-[#B88E3A] hover:text-[#EAD7A8] transition-colors duration-300 shadow-luxury',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
