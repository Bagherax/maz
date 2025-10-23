import React from 'react';
import CategoryManager from './CategoryManager';
import { useMarketplaceUI } from '../../../../context/MarketplaceUIContext';
import { useAuth } from '../../../../hooks/useAuth';
import { useLocalization } from '../../../../hooks/useLocalization';
import SortDropdown from './SortDropdown';
import DisplayModeSelector from './DisplayModeSelector';
import Icon from '../../../../components/Icon';
import TranslationControls from './TranslationControls';

interface SearchExpansionPanelProps {
  isExpanded: boolean;
  onCategorySelect: () => void;
}

const SearchExpansionPanel: React.FC<SearchExpansionPanelProps> = ({ isExpanded, onCategorySelect }) => {
  const { 
    filters, 
    onFilterChange, 
    resultsCount,
    displayMode,
    onDisplayModeChange,
    sortBy,
    onSortChange
  } = useMarketplaceUI();
  const { user } = useAuth();
  const { t } = useLocalization();

  const handleCategorySelect = (categoryName: string) => {
    onFilterChange({
      categories: filters.categories.includes(categoryName) ? [] : [categoryName],
    });
    // Do not close panel on category select to allow further filtering
    // onCategorySelect(); 
  };

  return (
    <div className={`
      overflow-hidden transition-all duration-500 ease-in-out
      ${isExpanded ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'}
    `}>
      <div className="pb-4 space-y-4 animate-slide-down-fast">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('controls.display')}</label>
            <div className="mt-2">
              <DisplayModeSelector selected={displayMode} onSelect={onDisplayModeChange} />
            </div>
          </div>
          <div>
            <label htmlFor="sort-by" className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Icon name="queue-list" className="w-5 h-5" />
              <span>{t('controls.sort_by')}</span>
            </label>
            <div className="mt-2">
              <SortDropdown selected={sortBy} onSelect={onSortChange} />
            </div>
          </div>
        </div>
        
        <div className="border-t dark:border-gray-700 pt-4">
          <CategoryManager 
            selectedCategory={filters.categories.length > 0 ? filters.categories[0] : undefined}
            onSelectCategory={handleCategorySelect}
            isAdmin={!!user?.isAdmin}
          />
        </div>

        <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">{t('translation.title')}</h3>
            <TranslationControls />
        </div>

        <div className="px-1 pt-2 flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('controls.results_found', { count: resultsCount })}
            </p>
        </div>
      </div>
    </div>
  );
};

export default SearchExpansionPanel;