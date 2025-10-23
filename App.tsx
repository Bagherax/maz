import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LocalizationProvider } from './context/LocalizationContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import AuthPage from './features/auth/AuthPage';
import { AuthConfigProvider } from './context/AuthConfigContext';
import { AppContextType, View } from './types';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { useLocalization } from './hooks/useLocalization';
import { TranslationProvider } from './context/TranslationContext';
import ErrorBoundary from './components/ErrorBoundary';
import { MarketplaceUIProvider } from './context/MarketplaceUIContext';
import { useMarketplace } from './context/MarketplaceContext';

// Import new components
import MarketplacePage from './features/marketplace/MarketplacePage';
import ProfilePage from './features/profile/ProfilePage';
import CreateAdPage from './features/marketplace/CreateAdPage';
import SearchBar from './features/marketplace/components/browsing/SearchBar';
import CloudSyncSettings from './features/profile/components/CloudSyncSettings';
import LanguageSettings from './features/profile/components/LanguageSettings';
import AdDetailPanel from './features/marketplace/components/ads/AdDetailPanel';
import BottomNav from './components/BottomNav';
import LoginPrompt from './components/LoginPrompt';


export const AppContext = createContext<AppContextType | undefined>(undefined);
export const useView = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useView must be used in AppContext");
    return context;
};

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isGuest, postLoginAction, clearPostLoginAction } = useAuth();
  const [view, setView] = useState<View>({ type: 'marketplace' });
  const { getAdById } = useMarketplace();

  useEffect(() => {
    // After a successful login, check if there was a pending action
    if (isAuthenticated && !isGuest && postLoginAction) {
        setView(postLoginAction);
        clearPostLoginAction();
    }
  }, [isAuthenticated, isGuest, postLoginAction, setView, clearPostLoginAction]);

  const selectedAd = view.type === 'ad' ? getAdById(view.id) : undefined;

  const renderMainView = () => {
    switch (view.type) {
      case 'create':
        return <CreateAdPage />;
      case 'profile':
        return <ProfilePage userId={view.id || user!.id} />;
      case 'cloud-sync':
        return <CloudSyncSettings />;
      case 'language-settings':
        return <LanguageSettings />;
      case 'marketplace':
      case 'ad': // MarketplacePage is always visible now, panel slides over
      default:
        return <MarketplacePage />;
    }
  };
  
  return (
    <AppContext.Provider value={{ view, setView }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <SearchBar />
        <main className="pt-20 pb-16 md:pb-0 transition-all duration-500" style={{ filter: selectedAd ? 'blur(4px)' : 'none' }}>
          <ErrorBoundary>
            {renderMainView()}
          </ErrorBoundary>
        </main>
        <AdDetailPanel ad={selectedAd} isOpen={!!selectedAd} onClose={() => setView({ type: 'marketplace' })} />
        <BottomNav />
      </div>
    </AppContext.Provider>
  );
};

const AppInitializer: React.FC = () => {
    const { isAuthenticated, isLoginPromptOpen } = useAuth();
    return (
        <MarketplaceProvider>
          <TranslationProvider>
            <MarketplaceUIProvider>
              <AppContent />
              {isLoginPromptOpen && <LoginPrompt />}
              {!isAuthenticated && <AuthPage />}
            </MarketplaceUIProvider>
          </TranslationProvider>
        </MarketplaceProvider>
    );
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