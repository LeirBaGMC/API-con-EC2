import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, placeholder = 'Buscar videos por título o descripción...', defaultValue = '' }) => {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 pl-11 pr-20 py-2.5 rounded-full border border-slate-800 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all shadow-inner"
        />
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-medium transition-colors cursor-pointer"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};
