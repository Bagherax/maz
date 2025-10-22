import React from 'react';
import { useAuthConfig } from '../../../hooks/useAuthConfig';
import { useLocalization } from '../../../hooks/useLocalization';
import Icon from '../../../components/Icon';
import { LoginMethod } from '../../../types';

interface SocialLoginsProps {
  onSocialLogin: (provider: LoginMethod) => void;
}

const SocialLogins: React.FC<SocialLoginsProps> = ({ onSocialLogin }) => {
  const { authConfig } = useAuthConfig();
  const { t } = useLocalization();
  const { enabledMethods, visibleElements } = authConfig;

  const socialMethods: LoginMethod[] = ['google', 'facebook', 'twitter', 'apple', 'github', 'phone'];
  const availableMethods = socialMethods.filter(method => enabledMethods.includes(method));

  if (availableMethods.length === 0) return null;

  return (
    <>
      {visibleElements.includes('socialDivider') && (
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t" style={{ borderColor: 'var(--auth-color-border)' }} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2" style={{ backgroundColor: 'var(--auth-color-background)' }}>
              {t('auth.social_login_divider')}
            </span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3">
        {availableMethods.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => onSocialLogin(method)}
            className="w-full inline-flex justify-center items-center py-2 px-4 border shadow-sm text-sm font-medium rounded-md hover:bg-gray-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
                borderColor: 'var(--auth-color-border)',
                color: 'var(--auth-color-text)',
            }}
          >
            <Icon name={method as any} className="w-5 h-5 mr-2 rtl:ml-2" />
            <span>{t(`auth.method.${method}`)}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default SocialLogins;