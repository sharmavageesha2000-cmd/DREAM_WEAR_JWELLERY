import React from 'react';
import { Sparkles, ShieldCheck, Droplets, Flame } from 'lucide-react';

interface BadgeProps {
  type: 'anti-tarnish' | 'waterproof' | 'bestseller' | 'new' | 'discount' | 'custom';
  text?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, text, className = '', size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (type) {
    case 'anti-tarnish':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium tracking-wider uppercase rounded-full bg-gold-dark/10 text-gold-dark border border-gold-satin/30 ${sizeClasses} ${className}`}
        >
          <ShieldCheck className="w-3 h-3 text-gold" />
          {text || 'Anti-Tarnish'}
        </span>
      );
    case 'waterproof':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium tracking-wider uppercase rounded-full bg-blue-50 text-blue-800 border border-blue-200/60 ${sizeClasses} ${className}`}
        >
          <Droplets className="w-3 h-3 text-blue-500" />
          {text || 'Waterproof'}
        </span>
      );
    case 'bestseller':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium tracking-wider uppercase rounded-full bg-amber-50 text-amber-900 border border-amber-300/60 ${sizeClasses} ${className}`}
        >
          <Flame className="w-3 h-3 text-amber-600 fill-amber-600" />
          {text || 'Best Seller'}
        </span>
      );
    case 'new':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium tracking-wider uppercase rounded-full bg-charcoal-dark text-ivory-light border border-charcoal-light/20 ${sizeClasses} ${className}`}
        >
          <Sparkles className="w-3 h-3 text-gold" />
          {text || 'New Drop'}
        </span>
      );
    case 'discount':
      return (
        <span
          className={`inline-flex items-center font-semibold tracking-tight rounded-md bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses} ${className}`}
        >
          {text}
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center font-medium tracking-wider uppercase rounded-full bg-nude-100 text-charcoal ${sizeClasses} ${className}`}
        >
          {text}
        </span>
      );
  }
};
