import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useAuthConfig } from '../../../../hooks/useAuthConfig';
import PasswordInput from '../PasswordInput';
import PasswordStrengthMeter from '../PasswordStrengthMeter';
import SocialLogins from '../SocialLogins';
import { LoginMethod, FormErrors } from '../../../../types';
import AvatarUploader from './AvatarUploader';
import Icon from '../../../../components/Icon';

interface RegistrationWizardProps {
  onSocialLogin: (provider: LoginMethod) => void;
}

type WizardData = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  termsAccepted: boolean;
};

const RegistrationWizard: React.FC<RegistrationWizardProps> = ({ onSocialLogin }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<WizardData>>({
    name: '',
    email: '',
    password: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { register, loading, error: apiError } = useAuth();
  const { t } = useLocalization();
  const { authConfig } = useAuthConfig();
  const { visibleElements } = authConfig;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setData(prev => ({ ...prev, [name]: isCheckbox ? checked : value }));
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    if (!data.name || data.name.length < 3) newErrors.name = t('auth.error_username_short');
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = t('auth.error_invalid_email');
    if (!data.password) newErrors.password = t('auth.error_field_required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
     if (visibleElements.includes('termsCheckbox') && !data.termsAccepted) {
        setErrors({ termsAccepted: t('auth.error_terms_required') });
        return false;
    }
    setErrors({});
    return true;
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(s => s + 1);
    } else if (step > 1) {
       setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    try {
      await register({
        name: data.name!,
        email: data.email!,
        password: data.password!,
        bio: data.bio,
        avatar: data.avatar,
      });
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const Step1_BasicInfo = () => (
    <div className="space-y-4">
        <div>
          <input name="name" type="text" placeholder={t('auth.username')} value={data.name} onChange={handleChange} className={`input-field ${errors.name ? 'border-red-500' : ''}`} style={{ borderColor: errors.name ? 'rgb(239 68 68)' : 'var(--auth-color-border)' }} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input name="email" type="email" placeholder={t('auth.email')} value={data.email} onChange={handleChange} className={`input-field ${errors.email ? 'border-red-500' : ''}`} style={{ borderColor: errors.email ? 'rgb(239 68 68)' : 'var(--auth-color-border)' }}/>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <PasswordInput id="password" name="password" value={data.password} onChange={handleChange} placeholder={t('auth.password')} />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>
        <PasswordStrengthMeter password={data.password} />
        <SocialLogins onSocialLogin={onSocialLogin} />
    </div>
  );

  const Step2_ProfileSetup = () => (
      <div className="space-y-6">
          <AvatarUploader onAvatarChange={(base64) => setData(prev => ({ ...prev, avatar: base64 }))} />
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">Your Bio (Optional)</label>
            <textarea name="bio" id="bio" rows={3} value={data.bio} onChange={handleChange} placeholder="Tell the community a little about yourself..." className="input-field"></textarea>
          </div>
      </div>
  );
  
  const Step3_Verification = () => (
      <div className="text-center space-y-6">
          <Icon name="shield-check" className="w-16 h-16 mx-auto text-green-500" />
          <h3 className="text-xl font-semibold">Almost there!</h3>
          <p className="text-sm">To complete your registration, please agree to our terms of service.</p>
           {visibleElements.includes('termsCheckbox') && (
            <div>
              <div className="flex items-center justify-center text-sm">
                  <input id="terms" name="termsAccepted" type="checkbox" checked={data.termsAccepted} onChange={handleChange} className="h-4 w-4 rounded" style={{accentColor: 'var(--auth-color-primary)'}} />
                  <label htmlFor="terms" className="ml-2 rtl:mr-2 block">
                      {t('auth.terms_agree')}{' '}
                      <a href="#" className="font-medium hover:underline" style={{ color: 'var(--auth-color-primary)' }}>
                          {t('auth.terms_and_conditions')}
                      </a>
                  </label>
              </div>
              {errors.termsAccepted && <p className="text-xs text-red-500 mt-1">{errors.termsAccepted}</p>}
            </div>
          )}
      </div>
  );

  const renderStepContent = () => {
      switch (step) {
          case 1: return <Step1_BasicInfo />;
          case 2: return <Step2_ProfileSetup />;
          case 3: return <Step3_Verification />;
          default: return null;
      }
  }
  
  const steps = ['Account Info', 'Profile Setup', 'Verification'];

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Stepper UI */}
        <div className="mb-8">
            <ol className="flex items-center w-full">
            {steps.map((stepName, index) => (
                <li key={stepName} className={`flex w-full items-center ${index + 1 < steps.length ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block" : ''} ${index + 1 <= step ? 'text-indigo-600 dark:text-indigo-400 after:border-indigo-600' : 'after:border-gray-200 dark:after:border-gray-700'}`}>
                <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${index + 1 <= step ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    {index + 1}
                </span>
                </li>
            ))}
            </ol>
        </div>
        
        <div className="min-h-[300px]">
            {renderStepContent()}
        </div>
        
        {apiError && <p className="text-sm text-red-500 text-center">{t(apiError)}</p>}

        <div className="flex justify-between items-center pt-4">
            <button type="button" onClick={prevStep} disabled={step === 1 || loading} className="px-6 py-2 border rounded-md disabled:opacity-50" style={{ borderColor: 'var(--auth-color-border)' }}>
                Back
            </button>
            {step < 3 ? (
                <button type="button" onClick={nextStep} disabled={loading} className="px-6 py-2 rounded-md" style={{ backgroundColor: 'var(--auth-color-button)', color: 'var(--auth-color-button-text)' }}>
                    Next
                </button>
            ) : (
                <button type="submit" disabled={loading} className="px-6 py-2 rounded-md" style={{ backgroundColor: 'var(--auth-color-button)', color: 'var(--auth-color-button-text)' }}>
                    {loading ? '...' : t('auth.register_button')}
                </button>
            )}
        </div>
    </form>
  );
};

export default RegistrationWizard;