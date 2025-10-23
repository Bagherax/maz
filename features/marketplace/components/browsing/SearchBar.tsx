import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../../components/Icon';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useMarketplaceUI } from '../../../../context/MarketplaceUIContext';
import SearchExpansionPanel from './SearchExpansionPanel';

const SearchBar: React.FC = () => {
  const {
    filters,
    onFilterChange,
  } = useMarketplaceUI();

  const { t } = useLocalization();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [localQuery, setLocalQuery] = useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    onFilterChange({ query: debouncedQuery });
  }, [debouncedQuery, onFilterChange]);

  useEffect(() => {
    if (filters.query !== localQuery) {
        setLocalQuery(filters.query);
    }
  }, [filters.query]);
  
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div 
        ref={searchBarRef} 
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className={`
          backdrop-blur-lg transition-all duration-300
          ${isExpanded ? 'bg-white/80 dark:bg-gray-900/80 shadow-lg' : 'bg-transparent'}
        `}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 py-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-4 rtl:pl-0 rtl:pr-4 flex items-center pointer-events-none">
                  <Icon name="magnifying-glass" className={`w-5 h-5 transition-colors duration-300 ${isExpanded ? 'text-gray-400' : 'text-white/80'}`} />
                </div>
                <input
                  id="main-search"
                  type="text"
                  placeholder={t('marketplace.search_placeholder')}
                  className={`
                      w-full pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3 rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500
                      ${isExpanded 
                          ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100' 
                          : 'bg-white/10 border-white/20 text-white placeholder-gray-300'
                      }
                  `}
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                />
              </div>
              
              {/* Filter Button */}
              <button className="p-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors" onClick={() => setIsExpanded(prev => !prev)}>
                <Icon name="adjustments-horizontal" className="w-6 h-6" />
              </button>
            </div>

            {/* Expanding Panel */}
            <SearchExpansionPanel isExpanded={isExpanded} onCategorySelect={() => setIsExpanded(false)} />

          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;