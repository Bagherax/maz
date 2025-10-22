

import React, { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocalization } from '../hooks/useLocalization';
import { useAuth } from '../hooks/useAuth';
import Icon from './Icon';
import { useView } from '../App';
import AdminDashboard from '../features/admin/AdminDashboard';

const Header: React.FC = () => {
  const { t } = useLocalization();
  const { user, logout } = useAuth();
  const { setView } = useView();
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  
  // Header only renders when a user is logged in, so user is not null.
  const userInitial = user!.name.charAt(0).toUpperCase();

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView({type: 'marketplace'})}>
               <div className="text-2xl font-bold tracking-wider text-gray-800 dark:text-white">MAZ</div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                  onClick={() => setView({type: 'create'})}
                  className="hidden sm:flex items-center space-x-2 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                  <Icon name="plus" className="w-4 h-4" />
                  <span>{t('createAd')}</span>
              </button>

              <button className="flex items-center space-x-2" onClick={() => setView({ type: 'profile', id: user!.id })}>
                  {user!.avatar ? (
                      <img className="h-8 w-8 rounded-full" src={user!.avatar} alt="" />
                  ) : (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                          <span className="font-medium leading-none text-white">{userInitial}</span>
                      </span>
                  )}
                  <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name}
                      </span>
                      <span className="text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase">{user?.tier} Tier</span>
                  </div>
              </button>

              {user?.isAdmin && (
                 <button
                  onClick={() => setIsAdminDashboardOpen(true)}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label={t('aria.open_marketplace_admin_panel')}
                >
                  <Icon name="wrench" className="w-5 h-5"/>
                </button>
              )}

              <button
                onClick={() => logout()}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                aria-label={t('aria.logout')}
              >
                <Icon name="logout" className="w-5 h-5"/>
              </button>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>
      {user?.isAdmin && <AdminDashboard isOpen={isAdminDashboardOpen} onClose={() => setIsAdminDashboardOpen(false)} />}
    </>
  );
};

export default Header;