import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';

interface TwoFactorAuthFlowProps {
  onBack: () => void;
}

const TwoFactorAuthFlow: React.FC<TwoFactorAuthFlowProps> = ({ onBack }) => {
  const [code, setCode] = useState('');
  const { verify2FA, loading, error: apiError } = useAuth();
  const { t } = useLocalization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      try {
        await verify2FA(code);
        // On success, the main App component will transition away.
      } catch (err) {
        console.error("2FA verification failed:", err);
        // Error is handled by the context and displayed below.
      }
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <p className="text-center text-sm">{t('auth.2fa_prompt')}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          id="2fa-code"
          name="2fa-code"
          type="text"
          maxLength={6}
          autoComplete="one-time-code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm text-center tracking-[0.5em]"
          placeholder={t('auth.2fa_enter_code')}
          style={{
            borderColor: 'var(--auth-color-border)',
            backgroundColor: 'var(--auth-color-background)',
            color: 'var(--auth-color-text)',
          }}
        />
        {apiError && <p className="text-sm text-red-500 text-center">{t(apiError)}</p>}
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
          style={{
            backgroundColor: 'var(--auth-color-button)',
            color: 'var(--auth-color-button-text)',
          }}
          disabled={loading || code.length !== 6}
        >
          {loading ? '...' : t('auth.verify')}
        </button>
      </form>
      <button
        onClick={onBack}
        className="w-full text-sm font-medium hover:underline"
        style={{ color: 'var(--auth-color-text)' }}
      >
        {t('auth.back_to_login')}
      </button>
    </div>
  );
};

export default TwoFactorAuthFlow;