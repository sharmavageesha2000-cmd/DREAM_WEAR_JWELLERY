import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: 'xs' | 'sm' | 'md';
  showNumber?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewsCount,
  size = 'sm',
  showNumber = true,
  className = '',
}) => {
  const iconSize = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textSize = size === 'xs' ? 'text-[11px]' : size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const half = !filled && star === Math.ceil(rating) && rating % 1 >= 0.4;
          return (
            <Star
              key={star}
              className={`${iconSize} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'fill-transparent text-stone-300'
              }`}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className={`font-medium text-charcoal-light ${textSize}`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className={`text-stone-400 ${textSize}`}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
