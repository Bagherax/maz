import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useMarketplaceUI } from '../../../../context/MarketplaceUIContext';
import SmartSearchDropdown from './SearchExpansionPanel';
import { useAuth } from '../../../../hooks/useAuth';

interface SearchBarProps {
  onOpenAdminDashboard: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onOpenAdminDashboard }) => {
  const {
    filters,
    onFilterChange,
  } = useMarketplaceUI();

  const { t } = useLocalization();
  const { user } = useAuth();
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
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
      <div 
        ref={searchContainerRef} 
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className={`
          backdrop-blur-lg transition-all duration-300
          ${isExpanded ? 'bg-white/90 dark:bg-gray-900/90 shadow-lg' : 'bg-transparent'}
        `}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center pt-4 pb-2">
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-smoke-flow">
                    MAZ
                </h1>
                
                <div className="relative w-full max-w-lg mt-2">
                   <input 
                        id="main-search"
                        type="text"
                        name="text"
                        className="w-full h-12 pl-10 pr-4 rounded-full text-sm placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-200/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 focus:bg-white dark:focus:bg-gray-800"
                        placeholder={t('marketplace.search_placeholder')}
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                    />
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
            </div>

            <SmartSearchDropdown 
              isExpanded={isExpanded} 
              onClose={() => setIsExpanded(false)}
              onOpenAdminDashboard={onOpenAdminDashboard}
            />
          </div>
        </div>
      </div>
  );
};

export default SearchBar;