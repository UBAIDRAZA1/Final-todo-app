'use client';

import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Better-auth automatically handles sessions
  // No provider needed, just return children
  return <>{children}</>;
}

// Export default bhi karo agar zaroorat ho
export default AuthProvider;