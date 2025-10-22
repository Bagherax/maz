import React, { useState } from 'react';
import Icon from '../../../components/Icon';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={showPassword ? 'text' : 'password'}
        required
        className="appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:z-10 sm:text-sm"
        style={{ 
            borderColor: 'var(--auth-color-border)',
            backgroundColor: 'var(--auth-color-background)',
            color: 'var(--auth-color-text)'
        }}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <Icon 
            name={showPassword ? 'eye-slash' : 'eye'} 
            className="h-5 w-5 text-gray-500"
        />
      </button>
    </div>
  );
};

export default PasswordInput;
