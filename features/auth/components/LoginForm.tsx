import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLocalization } from '../../../hooks/useLocalization';
import { useAuthConfig } from '../../../hooks/useAuthConfig';
import PasswordInput from './PasswordInput';
import SocialLogins from './SocialLogins';
import LanguageSwitcher from './LanguageSwitcher';
import CountrySwitcher from './CountrySwitcher';
import { LoginMethod, FormErrors } from '../../../types';

interface LoginFormProps {
  onSocialLogin: (provider: LoginMethod) => void;
}

const REMEMBER_ME_KEY = 'rememberedEmail';

const LoginForm: React.FC<LoginFormProps> = ({ onSocialLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { login, loading, error: apiError } = useAuth();
  const { t } = useLocalization();
  const { authConfig } = useAuthConfig();
  const { visibleElements } = authConfig;

  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBER_ME_KEY);
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = t('auth.error_field_required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.error_invalid_email');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="rounded-md shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LanguageSwitcher />
            {visibleElements.includes('countrySelector') && <CountrySwitcher />}
        </div>
        
        <div>
            <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validate}
            className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:z-10 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
            style={{ 
                borderColor: errors.email ? 'rgb(239 68 68)' : 'var(--auth-color-border)',
                backgroundColor: 'var(--auth-color-background)',
                color: 'var(--auth-color-text)'
            }}
            placeholder={t('auth.email')}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password')}
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        {visibleElements.includes('rememberMe') && (
          <div className="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded" 
              style={{accentColor: 'var(--auth-color-primary)'}} 
            />
            <label htmlFor="remember-me" className="ml-2 rtl:mr-2 block">{t('auth.remember_me')}</label>
          </div>
        )}
        {visibleElements.includes('forgotPassword') && (
          <a href="#" className="font-medium hover:underline" style={{ color: 'var(--auth-color-primary)' }}>
            {t('auth.forgot_password')}
          </a>
        )}
      </div>

      {apiError && <p className="text-sm text-red-500 text-center">{t(apiError)}</p>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
          style={{
            backgroundColor: 'var(--auth-color-button)',
            color: 'var(--auth-color-button-text)',
            borderColor: 'var(--auth-color-button)',
          }}
        >
          {loading ? '...' : t('auth.login_button')}
        </button>
      </div>
      
      <SocialLogins onSocialLogin={onSocialLogin} />

    </form>
  );
};

export default LoginForm;