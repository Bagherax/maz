import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import CountrySwitcher from './CountrySwitcher';

interface PhoneVerificationProps {
  onBack: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onBack }) => {
  const [step, setStep] = useState<'enter-phone' | 'enter-code'>('enter-phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [mockCode, setMockCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { loginWithPhone, loading } = useAuth();
  const { t } = useLocalization();

  useEffect(() => {
    if (step === 'enter-code') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setMockCode(code);
      // In a real app, you wouldn't log this. This is for demonstration.
      console.log(`[DEMO] Verification code for ${phoneNumber}: ${code}`);
    }
  }, [step, phoneNumber]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phoneNumber.length > 8) { // Simple validation
      setStep('enter-code');
    } else {
      setError('Please enter a valid phone number.');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (verificationCode === mockCode) {
      await loginWithPhone(phoneNumber);
      // On success, the main App component will transition away from the auth page.
    } else {
      setError(t('auth.error_invalid_code'));
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {step === 'enter-phone' ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <p className="text-center text-sm">{t('auth.enter_phone_prompt')}</p>
          <div className="grid grid-cols-1 gap-4">
            <CountrySwitcher />
             <input
                id="phone-number"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-field"
                placeholder={t('auth.phone')}
                style={{ 
                    borderColor: 'var(--auth-color-border)',
                    backgroundColor: 'var(--auth-color-background)',
                    color: 'var(--auth-color-text)'
                }}
            />
          </div>
          <button type="submit" className="w-full btn-primary" disabled={loading}
            style={{
                backgroundColor: 'var(--auth-color-button)',
                color: 'var(--auth-color-button-text)',
            }}>
            {loading ? '...' : t('auth.send_code')}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <p className="text-center text-sm">{t('auth.enter_code_prompt')}</p>
          <input
            id="verification-code"
            name="code"
            type="text"
            maxLength={6}
            required
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="input-field text-center tracking-[0.5em]"
            placeholder={t('auth.verification_code')}
            style={{ 
                borderColor: 'var(--auth-color-border)',
                backgroundColor: 'var(--auth-color-background)',
                color: 'var(--auth-color-text)'
            }}
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full btn-primary" disabled={loading}
            style={{
                backgroundColor: 'var(--auth-color-button)',
                color: 'var(--auth-color-button-text)',
            }}>
             {loading ? '...' : t('auth.verify')}
          </button>
          <div className="text-center text-sm">
            <button type="button" className="font-medium hover:underline" style={{ color: 'var(--auth-color-primary)' }}>
                {t('auth.resend_code')}
            </button>
          </div>
        </form>
      )}
       <button onClick={onBack} className="w-full text-sm font-medium hover:underline" style={{ color: 'var(--auth-color-text)' }}>
        {t('auth.back_to_login')}
      </button>
    </div>
  );
};

export default PhoneVerification;