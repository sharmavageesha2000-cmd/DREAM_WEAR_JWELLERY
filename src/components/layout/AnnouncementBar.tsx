import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Promotions and free shipping announcement"
      className="bg-gradient-to-r from-[#F6ECE0] via-[#EFE0CD] to-[#F6ECE0] text-[#584128] text-[10px] sm:text-[11px] font-medium tracking-widest uppercase py-2 px-4 border-b border-[#DFCEB7] transition-all duration-300 relative select-none shadow-2xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Decorative spacer for balanced centering */}
        <div className="w-5 hidden sm:block" />

        {/* Centered Message */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3 h-3 text-[#A37B2C] animate-pulse-subtle flex-shrink-0" />
          <span>
            FREE SHIPPING ON ORDERS ABOVE ₹999 <span className="hidden md:inline text-[#8E6A22] font-semibold">• 2-YEAR COLOR WARRANTY</span>
          </span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-md text-[#7A5B39] hover:text-[#3B2917] hover:bg-[#E5D5BF]/70 transition-colors cursor-pointer"
          aria-label="Close announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
