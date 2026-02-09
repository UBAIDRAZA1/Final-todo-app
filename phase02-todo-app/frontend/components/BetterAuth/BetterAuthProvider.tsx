// This file is no longer needed since we're using the direct auth implementation
// This is just a placeholder to avoid breaking existing imports
"use client";
import React, { createContext, ReactNode } from "react";

// Define the shape of the authentication context
export interface AuthContextType {
  user: any;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the BetterAuthProvider component
interface BetterAuthProviderProps {
  children: ReactNode;
}

// BetterAuthProvider component - placeholder
export const BetterAuthProvider: React.FC<BetterAuthProviderProps> = ({ children }) => {
  return <>{children}</>;
};
