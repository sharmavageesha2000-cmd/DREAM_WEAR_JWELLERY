import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm';

  return (
    <div
      className={`inline-flex items-center justify-between border border-stone-200 bg-white/80 rounded-full select-none ${
        isSm ? 'h-8 px-2 py-0.5 min-w-[84px]' : 'h-10 px-3 py-1 min-w-[105px]'
      } ${className}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`flex items-center justify-center text-charcoal hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          isSm ? 'w-5 h-5' : 'w-6 h-6'
        }`}
        aria-label="Decrease quantity"
      >
        <Minus className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </button>

      <span
        className={`font-semibold text-charcoal text-center min-w-[20px] ${
          isSm ? 'text-xs' : 'text-sm'
        }`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`flex items-center justify-center text-charcoal hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          isSm ? 'w-5 h-5' : 'w-6 h-6'
        }`}
        aria-label="Increase quantity"
      >
        <Plus className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </button>
    </div>
  );
};
