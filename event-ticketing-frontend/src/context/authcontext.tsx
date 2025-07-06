'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type UserType = {
  name: string;
  role: string;
};

type AuthContextType = {
  showSignIn: boolean;
  showSignUp: boolean;
  toggleSignIn: () => void;
  toggleSignUp: () => void;
  closeAll: () => void;
  user?: UserType; // ✅ tambahan: user
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // ✅ tambahkan user dummy dulu
  const [user, setUser] = useState<UserType | undefined>({
    name: "Buyer",
    role: "buyer"
  });

  const toggleSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const toggleSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const closeAll = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  return (
    <AuthContext.Provider
      value={{
        showSignIn,
        showSignUp,
        toggleSignIn,
        toggleSignUp,
        closeAll,
        user, // ✅ disediakan di context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
