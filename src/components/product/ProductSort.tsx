import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export type SortType =
  | 'recommended'
  | 'newest'
  | 'price-low-high'
  | 'price-high-low'
  | 'best-rated'
  | 'most-popular';

interface ProductSortProps {
  value: SortType;
  onChange: (sort: SortType) => void;
  className?: string;
}

export const ProductSort: React.FC<ProductSortProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 text-xs text-stone-500 ${className}`}>
      <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 hidden sm:inline" />
      <label htmlFor="product-sort-select" className="font-medium hidden sm:inline">Sort by:</label>
      <select
        id="product-sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortType)}
        className="bg-ivory border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal focus:outline-none focus:border-gold cursor-pointer"
      >
        <option value="recommended">Recommended</option>
        <option value="newest">Newest</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
        <option value="best-rated">Best Rated</option>
        <option value="most-popular">Most Popular</option>
      </select>
    </div>
  );
};
