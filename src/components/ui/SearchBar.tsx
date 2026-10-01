import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearch,
  placeholder = 'Search necklaces, rings, huggies, pearls...',
  className = '',
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center bg-white rounded-2xl border border-stone-200 shadow-sm focus-within:border-gold transition-colors ${className}`}
    >
      <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-20 py-3 bg-transparent text-xs text-charcoal placeholder:text-stone-400 focus:outline-none"
      />
      <div className="absolute right-3 flex items-center gap-1.5">
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-stone-400 hover:text-charcoal rounded-full"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="p-1.5 rounded-xl bg-charcoal text-ivory-light hover:bg-gold-dark transition-colors"
          aria-label="Submit search"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
