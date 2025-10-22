import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../../components/Icon';
import CategoryGrid from './CategoryGrid';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onCategorySelect: (categoryName: string) => void;
  onFilterClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange, onCategorySelect, onFilterClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategorySelection = (categoryName: string) => {
    onCategorySelect(categoryName);
    onQueryChange(''); // Clear search query when a category is selected
    setIsExpanded(false);
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-30" ref={searchBarRef}>
      <div className={`
        backdrop-blur-lg transition-all duration-300
        ${isExpanded ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg' : 'bg-transparent'}
      `}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search in MAZDADY..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 
                         bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onFocus={() => setIsExpanded(true)}
              />
              <Icon name="magnifying-glass" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
            
            <button 
                onClick={onFilterClick}
                className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                aria-label="Open filters"
            >
              <Icon name="adjustments-horizontal" className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <CategoryGrid onCategorySelect={handleCategorySelection} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
