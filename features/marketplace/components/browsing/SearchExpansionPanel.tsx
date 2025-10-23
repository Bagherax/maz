import React, { useState } from 'react';
import { useMarketplaceUI } from '../../../../context/MarketplaceUIContext';
import { useAuth } from '../../../../hooks/useAuth';
import { useLocalization } from '../../../../hooks/useLocalization';
import SortDropdown from './SortDropdown';
import DisplayModeSelector from './DisplayModeSelector';
import Icon from '../../../../components/Icon';
import CategoryManager from './CategoryManager';
import { Filters, UserTier } from '../../../../types';
import ThemeSwitcher from '../../../../components/ThemeSwitcher';
import { useView } from '../../../../App';

interface SmartSearchDropdownProps {
  isExpanded: boolean;
  onClose: () => void;
  onOpenAdminDashboard: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4">
    <h3 className="px-2 mb-3 text-xs font-bold uppercase text-gray-400 tracking-wider">{title}</h3>
    <div className="px-1">{children}</div>
  </div>
);

const QuickButton: React.FC<{icon: React.ComponentProps<typeof Icon>['name'], label: string, onClick?: () => void, children?: React.ReactNode}> = ({icon, label, onClick, children}) => {
    if (children) {
        return <div className="p-2 w-full text-left rtl:text-right text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center justify-between">{children}</div>
    }
    return (
        <button onClick={onClick} className="p-2 w-full text-left rtl:text-right text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-3">
            <Icon name={icon} className="w-5 h-5 text-gray-500" />
            <span>{label}</span>
        </button>
    );
};

const SmartSearchDropdown: React.FC<SmartSearchDropdownProps> = ({ isExpanded, onClose, onOpenAdminDashboard }) => {
  const { 
    filters, onFilterChange, displayMode, onDisplayModeChange, sortBy, onSortChange 
  } = useMarketplaceUI();
  const { user, isGuest } = useAuth();
  const { t } = useLocalization();
  const { setView } = useView();

  const handleCategorySelect = (categoryName: string) => {
    onFilterChange({ categories: filters.categories.includes(categoryName) ? [] : [categoryName] });
  };
  
  // FIX: Renamed function to `handleAction` to match its usage in onClick handlers.
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className={`
      overflow-hidden transition-all duration-500 ease-in-out
      ${isExpanded ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'}
    `}>
      <div className="pb-4 space-y-2 animate-slide-down-fast overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6">
            
            {/* SECTION 1: QUICK ACTIONS */}
            <Section title={t('controls.actions')}>
                <div className="space-y-1">
                    <QuickButton icon="plus" label={t('createAd')} onClick={() => handleAction(() => setView({type: 'create'}))} />
                    <QuickButton icon="bolt" label={t('controls.add_paid_ad')} onClick={() => alert('Paid Ads promotions coming soon!')} />
                    <QuickButton icon="share" label={t('controls.social_booster')} onClick={() => alert('Social Media Booster coming soon!')} />
                    <QuickButton icon="cog" label={t('admin.title')} onClick={() => handleAction(onOpenAdminDashboard)} />
                    <QuickButton icon="palette" label="Theme">
                        <ThemeSwitcher />
                    </QuickButton>
                </div>
            </Section>

            {/* SECTION 2: USER MANAGEMENT */}
            <Section title={t('controls.user_section')}>
                 <div className="space-y-1">
                    {!isGuest && user && <QuickButton icon="user-circle" label={t('bottom_nav.profile')} onClick={() => handleAction(() => setView({ type: 'profile', id: user.id }))} />}
                    {!isGuest && <QuickButton icon="heart" label={t('bottom_nav.favorites')} onClick={() => alert('Favorites page coming soon!')} />}
                    {!isGuest && <QuickButton icon="queue-list" label={t('profile.my_ads')} onClick={() => alert('My Ads page coming soon!')} />}
                    {!isGuest && <QuickButton icon="chat-bubble-left-right" label={t('bottom_nav.messages')} onClick={() => handleAction(() => setView({type: 'chat'}))} />}
                </div>
            </Section>

            {/* SECTION 3: DISPLAY CONTROLS */}
            <Section title={t('controls.display_options')}>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-gray-500">{t('controls.view.mode')}</label>
                        <div className="mt-2">
                            <DisplayModeSelector selected={displayMode} onSelect={onDisplayModeChange} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="sort-by" className="text-sm font-medium text-gray-500">{t('controls.sort_by')}</label>
                        <div className="mt-2">
                            <SortDropdown selected={sortBy} onSelect={onSortChange} />
                        </div>
                    </div>
                </div>
            </Section>
            
             {/* SECTION 4: QUICK NAVIGATION */}
            <Section title="Navigation">
                 <div className="space-y-1">
                    <QuickButton icon="magnifying-glass" label="Recent: iPhone" onClick={() => onFilterChange({ query: 'iPhone'})} />
                    <QuickButton icon="bolt" label="Popular: Electronics" onClick={() => handleCategorySelect('Electronics')} />
                    <QuickButton icon="rocket-launch" label="Trending: Laptops" onClick={() => onFilterChange({ query: 'Laptop'})} />
                </div>
            </Section>

        </div>
        <div className="border-t dark:border-gray-700 pt-4 mt-2">
            <CategoryManager 
                selectedCategory={filters.categories.length > 0 ? filters.categories[0] : undefined}
                onSelectCategory={handleCategorySelect}
                isAdmin={!!user?.isAdmin}
            />
        </div>
      </div>
    </div>
  );
};

export default SmartSearchDropdown;