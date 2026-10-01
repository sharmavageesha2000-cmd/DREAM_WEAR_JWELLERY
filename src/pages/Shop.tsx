import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import { getStoredProducts } from '../data/products';
import { Product } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilter, FilterCriteria } from '../components/product/ProductFilter';
import { ProductSort, SortType } from '../components/product/ProductSort';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Pagination } from '../components/common/Pagination';
import { Drawer } from '../components/ui/Drawer';
import { useSEO } from '../hooks/useSEO';

import { apiService } from '../services/api';

const ITEMS_PER_PAGE = 8;

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { onQuickView } = useOutletContext<{ onQuickView: (product: Product) => void }>();
  const [productList, setProductList] = useState<Product[]>(() => getStoredProducts());

  // Listen to product updates and sync with backend
  useEffect(() => {
    apiService.getProducts({ limit: 100 }).then((res) => {
      if (res && res.data && res.data.length > 0) {
        setProductList(res.data);
      }
    }).catch((err) => console.warn('Shop API load error:', err));

    const handleUpdate = () => {
      setProductList(getStoredProducts());
    };
    window.addEventListener('aurelia_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('aurelia_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);


  // URL state
  const categoryParam = searchParams.get('category') || 'all';
  const collectionParam = searchParams.get('collection') || 'all';
  const searchParam = searchParams.get('q') || '';

  // Filter State
  const [filters, setFilters] = useState<FilterCriteria>({
    category: categoryParam,
    collection: collectionParam,
    priceMin: 499,
    priceMax: 4999,
    finishes: [],
    materials: [],
    inStockOnly: false,
    minRating: 0,
  });

  const [sortBy, setSortBy] = useState<SortType>(
    collectionParam === 'new-arrivals' ? 'newest' : collectionParam === 'best-sellers' ? 'most-popular' : 'recommended'
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);


  // Sync URL changes to state
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      collection: collectionParam,
    }));
    setCurrentPage(1);
  }, [categoryParam, collectionParam]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      collection: 'all',
      priceMin: 499,
      priceMax: 4999,
      finishes: [],
      materials: [],
      inStockOnly: false,
      minRating: 0,
    });
    setSortBy('recommended');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return productList
      .filter((p) => {
        // Category filter
        if (filters.category !== 'all' && p.category !== filters.category) {
          return false;
        }

        // Collection filter
        if (filters.collection === 'anti-tarnish' && !p.isAntiTarnish) return false;
        if (filters.collection === 'new-arrivals' && !p.isNew) return false;
        if (filters.collection === 'best-sellers' && !p.isBestSeller) return false;

        // Search query filter
        if (searchParam) {
          const q = searchParam.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.material.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Price range filter
        if (p.price > filters.priceMax) return false;
        if (filters.priceMin && p.price < filters.priceMin) return false;

        // Finishes filter
        if (filters.finishes.length > 0) {
          const hasFinish = p.finishes.some((f) => filters.finishes.includes(f));
          if (!hasFinish) return false;
        }

        // Materials filter
        if (filters.materials.length > 0) {
          const hasMaterial = filters.materials.some((m) =>
            p.material.toLowerCase().includes(m.toLowerCase())
          );
          if (!hasMaterial) return false;
        }

        // In-stock filter
        if (filters.inStockOnly && !p.inStock) {
          return false;
        }

        // Rating filter
        if (filters.minRating > 0 && p.rating < filters.minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low-high':
            return a.price - b.price;
          case 'price-high-low':
            return b.price - a.price;
          case 'newest':
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          case 'best-rated':
            return b.rating - a.rating;
          case 'most-popular':
            return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
          default:
            return 0;
        }
      });
  }, [productList, filters, sortBy, searchParam]);

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  useSEO({
    title: 'Shop Anti-Tarnish Jewelry — Necklaces, Rings, Bracelets & Earrings | AURELIA',
    description:
      'Browse our complete catalog of 18K Real Gold anti-tarnish, shower-safe minimalist fine jewelry.',
    keywords: ['shop jewelry', 'anti-tarnish necklaces', 'gold rings', 'tennis bracelets', 'hoop earrings'],
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-8 lg:py-10 animate-fade-in text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-6 sm:space-y-8">
        {/* Top Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Shop Jewelry', to: '/shop' },
            ...(filters.category !== 'all' ? [{ label: filters.category.toUpperCase() }] : []),
          ]}
        />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>COLLECTION CATALOG</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal-dark tracking-tight">
              Shop Jewelry
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              Minimal pieces made for everyday elegance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
              {filteredProducts.length} Products
            </span>
          </div>
        </div>

        {/* Mobile Action Bar: Filters & Sort Buttons */}
        <div className="lg:hidden flex items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-ivory-warm hover:bg-stone-100 text-charcoal-dark text-xs font-semibold flex items-center justify-center gap-2 border border-stone-200 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-dark" />
            <span>Filters</span>
          </button>

          <div className="flex-1">
            <ProductSort value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Main Shop Layout: Sticky Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sticky Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
            <ProductFilter
              filters={filters}
              onFilterChange={(f) => {
                setFilters(f);
                setCurrentPage(1);
              }}
              onReset={handleResetFilters}
              totalResults={filteredProducts.length}
            />
          </aside>

          {/* Right Product Grid Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* Desktop Sorting & Layout Toolbar */}
            <div className="hidden lg:flex items-center justify-between p-3.5 bg-white rounded-2xl border border-stone-200/70 shadow-2xs">
              <span className="text-xs text-stone-500 font-medium">
                Showing <span className="font-bold text-charcoal-dark">{paginatedProducts.length}</span> of{' '}
                <span className="font-bold text-charcoal-dark">{filteredProducts.length}</span> curated pieces
              </span>

              <div className="flex items-center gap-4">
                <ProductSort value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={paginatedProducts}
              columns={4}
              onQuickView={onQuickView}
            />


            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 pb-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom-Sheet Filter Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter & Refine"
        subtitle={`Showing ${filteredProducts.length} matching pieces`}
        position="bottom"
      >
        <ProductFilter
          filters={filters}
          onFilterChange={(f) => {
            setFilters(f);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
          isMobile
          onCloseMobile={() => setIsMobileFilterOpen(false)}
          totalResults={filteredProducts.length}
        />
        <div className="pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(false)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all"
          >
            Show {filteredProducts.length} Pieces
          </button>
        </div>
      </Drawer>
    </div>
  );
};
