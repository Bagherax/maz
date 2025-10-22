import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { SortOption, DisplayMode } from '../../../../types';
import SortDropdown from './SortDropdown';
import DisplayModeSelector from './DisplayModeSelector';

interface MarketplaceToolbarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  resultsCount: number;
  isLocationAvailable: boolean;
}

const MarketplaceToolbar: React.FC<MarketplaceToolbarProps> = ({
  sortBy,
  onSortChange,
  displayMode,
  onDisplayModeChange,
  resultsCount,
  isLocationAvailable,
}) => {
  const { t } = useLocalization();

  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('controls.results_found', { count: resultsCount.toString() })}
      </div>
      <div className="flex items-center gap-4">
        <SortDropdown selected={sortBy} onSelect={onSortChange} isLocationAvailable={isLocationAvailable} />
        <DisplayModeSelector selected={displayMode} onSelect={onDisplayModeChange} />
      </div>
    </div>
  );
};

export default MarketplaceToolbar;