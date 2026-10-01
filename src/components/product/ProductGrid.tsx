import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onQuickView,
  columns = 4,
  className = '',
}) => {
  const getGridClasses = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2 md:grid-cols-3';
      case 4:
      default:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
    }
  };

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-base font-serif text-charcoal">No jewelry pieces found</p>
        <p className="text-xs text-stone-500 mt-1">Try resetting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridClasses()} gap-3 sm:gap-4 md:gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
