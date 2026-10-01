import React from 'react';
import { Filter, X, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { ProductFinish } from '../../types';

export interface FilterCriteria {
  category: string;
  collection: string;
  priceMin: number;
  priceMax: number;
  finishes: ProductFinish[];
  materials: string[];
  inStockOnly: boolean;
  minRating: number;
}

interface ProductFilterProps {
  filters: FilterCriteria;
  onFilterChange: (filters: FilterCriteria) => void;
  onReset: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
  totalResults: number;
  className?: string;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  isMobile = false,
  onCloseMobile,
  totalResults,
  className = '',
}) => {
  const categoriesList = [
    { id: 'all', label: 'All Jewelry' },
    { id: 'necklaces', label: 'Necklaces & Pendants' },
    { id: 'earrings', label: 'Earrings & Huggies' },
    { id: 'rings', label: 'Rings & Stacks' },
    { id: 'bracelets', label: 'Bracelets & Cuffs' },
    { id: 'anklets', label: 'Anklets & Payals' },
    { id: 'nose-pins', label: 'Nose Pins & Rings' },
    { id: 'toe-rings', label: 'Toe Rings & Bichiyas' },
    { id: 'sets', label: 'Jewelry Sets' },
  ];


  const collectionsList = [
    { id: 'all', label: 'All Collections' },
    { id: 'anti-tarnish', label: 'Anti-Tarnish Edit' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'minimalist', label: 'Everyday Minimalist' },
  ];

  const finishOptions: { value: ProductFinish; label: string; colorClass: string }[] = [
    { value: '18K Yellow Gold', label: '18K Yellow Gold', colorClass: 'bg-amber-400 border-amber-500' },
    { value: 'Silver Rhodium', label: 'Silver Rhodium', colorClass: 'bg-stone-300 border-stone-400' },
    { value: '18K Rose Gold', label: '18K Rose Gold', colorClass: 'bg-rose-300 border-rose-400' },
  ];

  const materialOptions = [
    '316L Surgical Stainless Steel',
    'Natural AAA Freshwater Pearl',
    '5A Cubic Zirconia',
  ];

  const toggleFinish = (finish: ProductFinish) => {
    const nextFinishes = filters.finishes.includes(finish)
      ? filters.finishes.filter((f) => f !== finish)
      : [...filters.finishes, finish];
    onFilterChange({ ...filters, finishes: nextFinishes });
  };

  const toggleMaterial = (mat: string) => {
    const nextMaterials = filters.materials.includes(mat)
      ? filters.materials.filter((m) => m !== mat)
      : [...filters.materials, mat];
    onFilterChange({ ...filters, materials: nextMaterials });
  };

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-dark" />
          <h3 className="font-serif text-base sm:text-lg font-medium text-charcoal-dark">
            Filters ({totalResults})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-rose-600 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 text-stone-400 hover:text-charcoal-dark"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
          Category
        </h4>
        <div className="space-y-1">
          {categoriesList.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, category: cat.id })}
                className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'font-bold text-stone-950 bg-stone-100'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Modern Price Range Slider */}
      <div className="space-y-3 pt-4 border-t border-stone-200/80">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Price Range
          </h4>
          <span className="text-xs font-serif font-bold text-charcoal-dark">
            ₹{filters.priceMin || 499} — ₹{filters.priceMax.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="499"
          max="4999"
          step="100"
          value={filters.priceMax}
          onChange={(e) => onFilterChange({ ...filters, priceMax: parseInt(e.target.value, 10) })}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
          aria-label="Filter maximum price"
        />

        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
          <span>₹499</span>
          <span>₹2,500</span>
          <span>₹4,999</span>
        </div>
      </div>

      {/* 3. Color Finish Selector */}
      <div className="space-y-3 pt-4 border-t border-stone-200/80">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
          Color Finish
        </h4>
        <div className="space-y-1.5">
          {finishOptions.map((opt) => {
            const isSelected = filters.finishes.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleFinish(opt.value)}
                className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                  isSelected ? 'bg-stone-100 font-semibold text-charcoal-dark' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full border ${opt.colorClass} flex items-center justify-center`}>
                    {isSelected && <Check className="w-2.5 h-2.5 text-stone-900 stroke-[3]" />}
                  </span>
                  <span>{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Collection Filter */}
      <div className="space-y-2.5 pt-4 border-t border-stone-200/80">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
          Collection
        </h4>
        <div className="space-y-1">
          {collectionsList.map((col) => {
            const isSelected = filters.collection === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, collection: col.id })}
                className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'font-bold text-stone-950 bg-stone-100'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <span>{col.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Material Filter */}
      <div className="space-y-2.5 pt-4 border-t border-stone-200/80">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
          Craft & Stones
        </h4>
        <div className="space-y-1.5">
          {materialOptions.map((mat) => {
            const isSelected = filters.materials.some((m) => mat.toLowerCase().includes(m.toLowerCase()));
            return (
              <label
                key={mat}
                className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer hover:text-charcoal-dark py-1"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleMaterial(mat)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-gold cursor-pointer"
                />
                <span>{mat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Rating & Availability */}
      <div className="space-y-3 pt-4 border-t border-stone-200/80">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
          Rating & Stock
        </h4>

        {/* Rating Pills */}
        <div className="flex items-center gap-1.5">
          {[0, 4, 4.8].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onFilterChange({ ...filters, minRating: r })}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                filters.minRating === r
                  ? 'bg-[#B88E3A] text-white font-semibold shadow-2xs'
                  : 'bg-[#F4ECE1] text-[#6B5A4E] hover:bg-[#EAE0D0]'
              }`}
            >
              {r === 0 ? 'All' : `${r}★+`}
            </button>
          ))}
        </div>

        {/* In Stock Toggle */}
        <label className="flex items-center justify-between pt-2 text-xs text-charcoal-dark cursor-pointer">
          <span className="font-medium">In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-gold cursor-pointer"
          />
        </label>
      </div>

      {/* Assurance banner */}
      <div className="p-3.5 rounded-2xl bg-ivory-warm border border-stone-200/80 flex items-center gap-2.5 text-xs text-stone-600">
        <ShieldCheck className="w-4 h-4 text-gold-dark flex-shrink-0" />
        <span className="text-[11px] font-medium">All pieces are 100% Anti-Tarnish & Waterproof</span>
      </div>
    </div>
  );
};
