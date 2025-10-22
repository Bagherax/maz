import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';

interface ForgotPasswordFlowProps {
  onBack: () => void;
}

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLocalization();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Password reset requested for: ${email}`);
    setSubmitted(true);
  };

  return (
    <>
      <div className="auth-heading">Reset Password</div>

      {submitted ? (
        <div className="text-center my-6">
          <p className="text-gray-600">If an account with that email exists, we've sent a password reset link to it.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
            <p className="text-center text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
            </p>
            <input
                required
                className="input"
                type="email"
                name="email"
                id="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button className="login-button" type="submit">
                Send Reset Link
            </button>
        </form>
      )}

      <div className="text-center mt-4">
        <button onClick={onBack} className="text-sm font-medium text-gray-600 hover:underline">
          {t('auth.back_to_login')}
        </button>
      </div>
    </>
  );
};

export default ForgotPasswordFlow;