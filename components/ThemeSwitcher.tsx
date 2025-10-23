import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLocalization } from '../hooks/useLocalization';
import Icon from './Icon';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLocalization();

  return (
      <button 
        onClick={toggleTheme} 
        aria-label={t('aria.toggle_theme')}
        className="p-2 w-full text-left rtl:text-right text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-5 h-5 text-gray-500" />
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
         <div className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors bg-gray-300 dark:bg-gray-600">
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-1'}`} />
        </div>
      </button>
  );
};

export default ThemeSwitcher;
