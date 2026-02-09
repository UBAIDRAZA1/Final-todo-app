import { useContext } from 'react';
import { AuthContext, AuthContextType } from './BetterAuthProvider'; // Import both AuthContext and AuthContextType

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // This error indicates that useAuth was called outside of a BetterAuthProvider
    throw new Error('useAuth must be used within a BetterAuthProvider');
  }

  return context;
};
