import React from 'react';
import { SortOption } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import Dropdown from '../../../../components/Dropdown';
import Icon from '../../../../components/Icon';

interface SortDropdownProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
  isLocationAvailable: boolean;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ selected, onSelect, isLocationAvailable }) => {
  const { t } = useLocalization();

  const sortOptions: { value: SortOption; label: string, disabled?: boolean }[] = [
    { value: 'date-new-old', label: t('controls.sort.date-new-old') },
    { value: 'date-old-new', label: t('controls.sort.date-old-new') },
    { value: 'price-low-high', label: t('controls.sort.price-low-high') },
    { value: 'price-high-low', label: t('controls.sort.price-high-low') },
    { value: 'rating-high-low', label: t('controls.sort.rating-high-low') },
    { value: 'rating-low-high', label: t('controls.sort.rating-low-high') },
    { value: 'most-liked', label: t('controls.sort.most-liked') },
    { value: 'most-viewed', label: t('controls.sort.most-viewed') },
    { value: 'verified-first', label: t('controls.sort.verified-first') },
    { 
      value: 'nearby-first', 
      label: isLocationAvailable ? t('controls.sort.nearby-first') : t('controls.sort.nearby-first-disabled'),
      disabled: !isLocationAvailable
    },
  ];

  const selectedOption = sortOptions.find(opt => opt.value === selected) || sortOptions[0];

  return (
    <div className="flex items-center">
      <div className="relative">
         <Dropdown
            options={sortOptions}
            selected={selectedOption}
            onSelect={(option) => onSelect(option.value as SortOption)}
            trigger={
              <button title={t('controls.sort_by')} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50">
                <Icon name="adjustments-horizontal" className="w-5 h-5" />
              </button>
            }
            menuClassName="right-0 w-56"
        />
      </div>
    </div>
  );
};

export default SortDropdown;