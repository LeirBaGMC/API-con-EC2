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
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-[#7aa7ff]/15 bg-[#080d16] py-2.5 pl-11 pr-24 text-sm text-[#f8fbff] shadow-inner transition-all placeholder:text-[#6f7a8a] hover:border-[#7aa7ff]/30 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7aa7ff]/35"
        />
        <div className="absolute left-3.5 text-[#8c96a6] pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 text-[#8c96a6] hover:text-[#f8fbff] p-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1.5 cursor-pointer rounded-full border border-[#7aa7ff]/20 bg-[#111a2b] px-4 py-1.5 text-xs font-black text-[#dbe7ff] transition-colors hover:border-[#7aa7ff]/35 hover:bg-[#1a2942]"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};
