import React, { createContext, useContext, useState } from 'react';
import Header from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import { LocalizationProvider } from './context/LocalizationContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import AuthPage from './features/auth/AuthPage';
import { AuthConfigProvider } from './context/AuthConfigContext';
import { AppContextType, View, Ad } from './types';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { useLocalization } from './hooks/useLocalization';
import { TranslationProvider } from './context/TranslationContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useLocalStorage } from './hooks/usePersistentState';

// Import new components
import MarketplacePage from './features/marketplace/MarketplacePage';
import AdDetailPage from './features/marketplace/AdDetailPage';
import ProfilePage from './features/profile/ProfilePage';
import AdCreationWizard from './features/marketplace/components/ads/AdCreationWizard';
import AdDetailPanel from './features/marketplace/components/ads/AdDetailPanel';
import SearchBar from './features/marketplace/components/browsing/SearchBar';
import { Filters } from './features/marketplace/components/browsing/MarketplaceControls';


// Create Ad Page using the new AdCreationWizard
const CreateAdPage: React.FC = () => {
    const { setView } = useView();
    const { t } = useLocalization();
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('ad.create.title')}</h1>
                <AdCreationWizard 
                    onAdCreated={(adId) => setView({ type: 'ad', id: adId })} 
                    onCancel={() => setView({ type: 'marketplace' })} 
                />
            </div>
        </div>
    );
};

export const AppContext = createContext<AppContextType | undefined>(undefined);
export const useView = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useView must be used in AppContext");
    return context;
};

const initialFilters: Filters = {
    query: '',
    categories: [],
    condition: 'all',
    priceRange: [0, 5000000],
    sellerTiers: [],
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<View>({ type: 'marketplace' });
  const [activeAdId, setActiveAdId] = useState<string | null>(null);
  const { getAdById } = useMarketplace();

  // State lifted from MarketplacePage to be shared with global SearchBar
  const [filters, setFilters] = useLocalStorage<Filters>('marketplaceFilters', initialFilters);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const activeAd = activeAdId ? getAdById(activeAdId) : null;

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCategorySelect = (categoryName: string) => {
    // Set the category and clear others for a focused search
    handleFilterChange({ categories: [categoryName] });
    setView({type: 'marketplace'});
  };

  const handleSetView = (newViewValue: View | ((prevState: View) => View)) => {
    const newView = typeof newViewValue === 'function' ? newViewValue(view) : newViewValue;

    if (newView.type === 'ad') {
      setActiveAdId(newView.id);
      if(view.type !== 'marketplace') {
        setView({ type: 'marketplace' });
      }
    } else {
      setActiveAdId(null); 
      setView(newView);
    }
  };

  const handleClosePanel = () => {
    setActiveAdId(null);
  };

  const renderMainView = () => {
    switch (view.type) {
      case 'create':
        return <CreateAdPage />;
      case 'profile':
        return <ProfilePage userId={view.id || user!.id} />;
      case 'marketplace':
      default:
        return <MarketplacePage 
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={() => setFilters(initialFilters)}
            isFilterSidebarOpen={isFilterSidebarOpen}
            setIsFilterSidebarOpen={setIsFilterSidebarOpen}
        />;
    }
  };
  
  const showSearchBar = view.type === 'marketplace' || view.type === 'profile' || !!activeAdId;

  return (
    <AppContext.Provider value={{ view, setView: handleSetView as React.Dispatch<React.SetStateAction<View>> }}>
      <Header />
      {/* Render search bar globally for marketplace-related views */}
      {showSearchBar && (
        <SearchBar
            query={filters.query}
            onQueryChange={(q) => handleFilterChange({ query: q })}
            onCategorySelect={handleCategorySelect}
            onFilterClick={() => setIsFilterSidebarOpen(true)}
        />
      )}
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-16">
        <ErrorBoundary>
          {renderMainView()}
        </ErrorBoundary>
      </main>
      <AdDetailPanel ad={activeAd} onClose={handleClosePanel} />
    </AppContext.Provider>
  );
};

const AppInitializer: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? (
        <MarketplaceProvider>
          <TranslationProvider>
            <AppContent />
          </TranslationProvider>
        </MarketplaceProvider>
    ) : <AuthPage />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <AuthProvider>
          <AuthConfigProvider>
            <AppInitializer />
          </AuthConfigProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;