import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionTo?: string;
  onActionClick?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionTo,
  onActionClick,
  className = '',
}) => {
  return (
    <div className={`py-16 sm:py-24 text-center max-w-md mx-auto px-4 ${className}`}>
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border border-stone-200 shadow-sm flex items-center justify-center mx-auto text-gold mb-6">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.25]" />
      </div>
      <h3 className="font-serif text-2xl sm:text-3xl font-light text-charcoal">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-500 mt-2 font-light leading-relaxed">{description}</p>

      {actionText && (
        <div className="mt-8">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-xl shadow-md transition-all cursor-pointer"
            >
              {actionText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="px-8 py-3.5 bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-xl shadow-md transition-all cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
