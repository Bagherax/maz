
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
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
      aria-label={t('aria.toggle_theme')}
    >
      {theme === 'light' ? <Icon name="moon" /> : <Icon name="sun" />}
    </button>
  );
};

export default ThemeSwitcher;
