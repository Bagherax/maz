import React from 'react';

// This component will protect routes that require authentication.
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { isAuthenticated } = useAuth();
  // if (!isAuthenticated) {
  //   // Redirect to login page
  //   return null;
  // }
  return <>{children}</>;
};

export default AuthGuard;
