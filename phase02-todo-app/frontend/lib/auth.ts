// Custom auth implementation that works with your backend
// but maintains the same interface as BetterAuth for compatibility

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
}

interface Session {
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  session: {
    data: Session | null;
    isPending: boolean;
  };
  signIn: {
    email: (credentials: { email: string; password: string }) => Promise<any>;
  };
  signOut: () => Promise<void>;
  signUp: (credentials: { email: string; password: string; name: string }) => Promise<any>;
  updateSession: (newSession: Session) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isPending, setIsPending] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/api/auth/get-session`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.user) {
            setSession(data);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsPending(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/auth/sign-in/email`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setSession(data);
        return { data };
      } else {
        return { error: { message: data.detail || 'Login failed' } };
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      return { error: { message: 'Network error' } };
    }
  };

  const signUp = async (credentials: { email: string; password: string; name: string }) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/auth/sign-up/email`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setSession(data);
        return { data };
      } else {
        return { error: { message: data.detail || 'Sign up failed' } };
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      return { error: { message: 'Network error' } };
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${getBaseUrl()}/api/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSession(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const updateSession = (newSession: Session) => {
    setSession(newSession);
  };

  const authContextValue: AuthContextType = {
    session: {
      data: session,
      isPending,
    },
    signIn: {
      email: signIn,
    },
    signOut,
    signUp,
    updateSession,
  };

  return React.createElement(AuthContext.Provider, { value: authContextValue }, children);
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://hafizubaid-todo-wep-app.hf.space';
  }

  return 'http://localhost:8001';
};

// Import React at the top to ensure JSX works properly
import React from 'react';