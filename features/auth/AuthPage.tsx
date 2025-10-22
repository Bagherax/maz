import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import LoginForm from './components/LoginForm';
import RegistrationWizard from './components/registration/RegistrationWizard';
import { useLocalization } from '../../hooks/useLocalization';
import { useAuthConfig } from '../../hooks/useAuthConfig';
import AdminPanel from './components/AdminPanel';
import { LoginMethod } from '../../types';
import PhoneVerificationFlow from './components/PhoneVerificationFlow';
import OAuthHandler from './components/OAuthHandler';
import { useAuth } from '../../hooks/useAuth';
import TwoFactorAuthFlow from './components/TwoFactorAuthFlow';

type AuthView = 'login' | 'register' | 'phone-verify' | 'oauth-redirect' | '2fa-verify';

const AuthPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [oauthProvider, setOauthProvider] = useState<LoginMethod | null>(null);
  const { t } = useLocalization();
  const { authConfig } = useAuthConfig();
  const { isAwaiting2FA } = useAuth();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const { colorScheme, customCSS } = authConfig;

  useEffect(() => {
    if (isAwaiting2FA) {
      setView('2fa-verify');
    }
  }, [isAwaiting2FA]);

  const handleSocialLogin = (provider: LoginMethod) => {
    if (provider === 'phone') {
      setView('phone-verify');
    } else {
      setOauthProvider(provider);
      setView('oauth-redirect');
    }
  };
  
  const handleBackToLogin = () => {
    // A full logout is needed to clear any pending 2FA state
    // In a real app, this would be a request to the backend to cancel the 2FA attempt
    window.location.reload(); 
  }

  const renderContent = () => {
    switch(view) {
      case 'login':
        return <LoginForm onSocialLogin={handleSocialLogin} />;
      case 'register':
        return <RegistrationWizard onSocialLogin={handleSocialLogin} />;
      case 'phone-verify':
        return <PhoneVerificationFlow onBack={() => setView('login')} />;
      case 'oauth-redirect':
        return oauthProvider ? <OAuthHandler provider={oauthProvider} onBack={() => setView('login')} /> : null;
      case '2fa-verify':
        return <TwoFactorAuthFlow onBack={handleBackToLogin} />;
      default:
        return <LoginForm onSocialLogin={handleSocialLogin} />;
    }
  }

  const getTitle = () => {
    switch(view) {
      case 'register': return t('auth.register_title');
      case 'phone-verify': return t('auth.phone_verification_title');
      case 'oauth-redirect': return t('auth.oauth_redirect_title');
      case '2fa-verify': return t('auth.2fa_title');
      default: return t('auth.login_title');
    }
  }

  const dynamicStyles = `
    :root {
      --auth-color-primary: ${colorScheme.primary};
      --auth-color-background: ${colorScheme.background};
      --auth-color-text: ${colorScheme.text};
      --auth-color-button: ${colorScheme.button};
      --auth-color-button-text: ${colorScheme.buttonText};
      --auth-color-border: ${colorScheme.border};
    }
    ${customCSS}
  `;

  return (
    <>
      <style>{dynamicStyles}</style>
      <div 
        className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300"
        style={{ backgroundColor: 'var(--auth-color-background)', color: 'var(--auth-color-text)' }}
      >
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div 
              className="mx-auto text-5xl font-bold tracking-wider" 
              style={{ color: 'var(--auth-color-primary)' }}
            >
              MAZ
            </div>
            <h2 className="mt-6 text-3xl font-extrabold" style={{ color: 'var(--auth-color-text)' }}>
              {getTitle()}
            </h2>
            { (view === 'login' || view === 'register') && (
              <p className="mt-2 text-sm" style={{ color: 'var(--auth-color-text)' }}>
                {t('auth.welcome_message')}
              </p>
            )}
          </div>
          
          {renderContent()}

          { (view === 'login' || view === 'register') && (
            <p className="mt-4 text-center text-sm" style={{ color: 'var(--auth-color-text)' }}>
              {view === 'login' ? t('auth.go_to_register') : t('auth.go_to_login')}{' '}
              <button 
                onClick={() => setView(view === 'login' ? 'register' : 'login')} 
                className="font-medium hover:underline"
                style={{ color: 'var(--auth-color-primary)' }}
              >
                {view === 'login' ? t('auth.go_to_register_link') : t('auth.go_to_login_link')}
              </button>
            </p>
          )}
        </div>
        
        <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="p-2 rounded-full hover:bg-gray-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--auth-color-primary)]"
              aria-label={t('aria.open_admin_panel')}
            >
                <Icon name="cog" className="w-6 h-6" style={{ color: 'var(--auth-color-text)' }}/>
            </button>
        </div>

        <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
      </div>
    </>
  );
};

export default AuthPage;