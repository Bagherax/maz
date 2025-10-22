import React from 'react';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import Icon from '../../../../components/Icon';

const categoryIcons: { [key: string]: React.ComponentProps<typeof Icon>['name'] } = {
  'Electronics': 'bolt',
  'Fashion': 'user-circle',
  'Home & Garden': 'storefront',
  'Vehicles': 'truck',
  'Real Estate': 'building-storefront',
  'Services': 'wrench',
};

interface CategoryGridProps {
  onCategorySelect: (categoryName: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const { categories } = useMarketplace();

  return (
    <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-1">Browse Categories</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {categories.map((category) => (
            <button
            key={category.id}
            onClick={() => onCategorySelect(category.name)}
            className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group text-center focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center 
                            group-hover:scale-110 transition-transform">
                <Icon name={categoryIcons[category.name] || 'squares-plus'} className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs mt-2 text-center text-gray-600 dark:text-gray-300">
                {category.name}
              </span>
            </button>
        ))}
        </div>
    </div>
  );
};

export default CategoryGrid;
