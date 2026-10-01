import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useOutletContext, Link } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { getStoredProducts } from '../data/products';
import { Product } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { apiService } from '../services/api';

const TRENDING_SEARCHES = [
  'Pearl Pendant',
  'Snake Chain',
  'Croissant Ring',
  'Huggie Hoops',
  'Paperclip Bracelet',
  'Anti-Tarnish',
  'Waterproof',
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [productList, setProductList] = useState<Product[]>(() => getStoredProducts());
  const { onQuickView } = useOutletContext<{ onQuickView: (product: Product) => void }>();

  useEffect(() => {
    apiService.getProducts({ limit: 100 }).then((res) => {
      if (res && res.data && res.data.length > 0) {
        setProductList(res.data);
      }
    }).catch((err) => console.warn('Search live products sync error:', err));

    const handleUpdate = () => setProductList(getStoredProducts());
    window.addEventListener('aurelia_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('aurelia_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);


  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
    setSearchParams({ q: keyword });
  };

  const matchedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return productList.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    });
  }, [query, productList]);

  return (
    <div className="py-8 sm:py-16 bg-ivory min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: 'Search Catalog' },
          ]}
        />

        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal">
            Search Collection
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Search our anti-tarnish 18K gold catalog by style, stone, material or keyword.
          </p>

          <form onSubmit={handleSearchSubmit} className="relative mt-4">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search necklaces, rings, huggies, pearls..."
              className="w-full pl-12 pr-28 py-3.5 bg-white rounded-2xl border border-stone-200 shadow-sm focus:outline-none focus:border-gold text-sm text-charcoal"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 px-5 py-2 bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Trending Suggestions */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 flex items-center gap-1 mr-1">
              <TrendingUp className="w-3 h-3 text-gold" /> Trending:
            </span>
            {TRENDING_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="text-xs px-3 py-1 rounded-full bg-white hover:bg-gold-light/20 text-stone-600 hover:text-charcoal border border-stone-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="pt-6">
          {query.trim() === '' ? (
            <div className="space-y-6 text-center max-w-lg mx-auto py-12">
              <div className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto text-gold">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-light text-charcoal">Popular Right Now</h2>
              <p className="text-xs text-stone-500">
                Explore our best selling 18K gold shower-safe jewelry.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop?collection=best-sellers"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-ivory-light text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gold-dark transition-colors"
                >
                  <span>Explore Best Sellers</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </Link>
              </div>
            </div>
          ) : matchedProducts.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 text-xs text-stone-500">
                <span>
                  Found <strong className="text-charcoal">{matchedProducts.length}</strong> {matchedProducts.length === 1 ? 'piece' : 'pieces'} matching &ldquo;{query}&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSearchParams({});
                  }}
                  className="hover:text-gold-dark underline"
                >
                  Clear search
                </button>
              </div>

              <ProductGrid
                products={matchedProducts}
                columns={4}
                onQuickView={onQuickView}
              />
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No products found"
              description={`We couldn't find any designs matching "${query}". Try searching for necklaces, rings, or earrings.`}
              actionText="View All Jewelry"
              actionTo="/shop"
            />
          )}
        </div>

      </div>
    </div>
  );
};
