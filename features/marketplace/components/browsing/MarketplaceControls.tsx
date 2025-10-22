import React, { useState } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { Category, UserTier } from '../../../../types';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import PriceRangeSlider from './PriceRangeSlider';
import Icon from '../../../../components/Icon';

export interface Filters {
  query: string;
  categories: string[];
  condition: 'all' | 'new' | 'used' | 'refurbished';
  priceRange: [number, number];
  sellerTiers: UserTier['level'][];
}

interface MarketplaceControlsProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  onReset: () => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">{title}</h3>
         <Icon name="arrow-down-circle" className={`w-5 h-5 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
      </button>
      {isOpen && <div className="mt-4 space-y-2">{children}</div>}
    </div>
  );
};

const MarketplaceControls: React.FC<MarketplaceControlsProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const { t } = useLocalization();
  const { categories, userTiers } = useMarketplace();

  const handleCategoryChange = (categoryName: string) => {
    const newCategories = filters.categories.includes(categoryName)
      ? filters.categories.filter(c => c !== categoryName)
      : [...filters.categories, categoryName];
    onFilterChange({ categories: newCategories });
  };
  
  const handleTierChange = (tierLevel: UserTier['level']) => {
    const newTiers = filters.sellerTiers.includes(tierLevel)
      ? filters.sellerTiers.filter(t => t !== tierLevel)
      : [...filters.sellerTiers, tierLevel];
    onFilterChange({ sellerTiers: newTiers });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md lg:sticky lg:top-24">
      <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">{t('controls.filters')}</h2>
        <button onClick={onReset} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">{t('controls.reset_filters')}</button>
      </div>

      <div className="mt-4">
        <input
            type="text"
            placeholder={t('marketplace.search_placeholder')}
            value={filters.query}
            onChange={(e) => onFilterChange({ query: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      
      <FilterSection title={t('controls.price_range')}>
        <PriceRangeSlider value={filters.priceRange} onChange={(val) => onFilterChange({ priceRange: val })} />
      </FilterSection>
      
      <FilterSection title={t('controls.categories')}>
        {categories.map(cat => (
             <label key={cat.id} className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
              <input type="checkbox" checked={filters.categories.includes(cat.name)} onChange={() => handleCategoryChange(cat.name)} className="rounded text-indigo-500 focus:ring-indigo-500"/>
              <span>{cat.name}</span>
            </label>
        ))}
      </FilterSection>

      <FilterSection title={t('controls.condition')}>
        {(['all', 'new', 'used', 'refurbished'] as const).map(cond => (
            <label key={cond} className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                <input type="radio" name="condition" value={cond} checked={filters.condition === cond} onChange={(e) => onFilterChange({ condition: e.target.value as Filters['condition'] })} className="text-indigo-500 focus:ring-indigo-500" />
                <span className="capitalize">{t(`controls.condition.${cond}`, {defaultValue: cond})}</span>
            </label>
        ))}
      </FilterSection>
      
      <FilterSection title={t('controls.seller_tier')}>
        {userTiers.map(tier => (
             <label key={tier.level} className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
              <input type="checkbox" checked={filters.sellerTiers.includes(tier.level)} onChange={() => handleTierChange(tier.level)} className="rounded text-indigo-500 focus:ring-indigo-500"/>
              <span className="capitalize">{tier.level.replace('_', ' ')}</span>
            </label>
        ))}
      </FilterSection>
    </div>
  );
};

export default MarketplaceControls;