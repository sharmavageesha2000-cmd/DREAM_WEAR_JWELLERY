import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, className = '' }) => {
  return (
    <div className={`p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={review.author}
              className="w-9 h-9 rounded-full object-cover border border-gold-satin/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gold-light/25 font-serif font-bold text-gold-dark flex items-center justify-center text-xs">
              {review.author.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="text-xs font-semibold text-charcoal">{review.author}</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
              {review.location && <span>{review.location}</span>}
              {review.verifiedPurchase && (
                <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-[10px] text-stone-400">{review.date}</span>
      </div>

      <div className="flex text-amber-400 gap-0.5">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <div>
        <h5 className="font-serif text-sm font-semibold text-charcoal">{review.title}</h5>
        <p className="text-xs text-stone-600 font-light leading-relaxed mt-1">{review.comment}</p>
      </div>

      {review.productName && (
        <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-400">
          Purchased: <span className="font-medium text-gold-dark">{review.productName}</span>
        </div>
      )}
    </div>
  );
};
