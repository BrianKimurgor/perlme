// hooks/useAuth.ts
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Use useCallback to memoize the functions
  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => setIsLoggedIn(false), []);

  // Use useMemo to memoize the context value
  const value: AuthContextType = useMemo(() => ({
    isLoggedIn,
    login,
    logout
  }), [isLoggedIn, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};