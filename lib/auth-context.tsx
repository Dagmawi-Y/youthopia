'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { pb, type PBUser } from './pocketbase';

type AuthContextType = {
  user: PBUser | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Update state based on initial auth
    setUser(pb.authStore.model as PBUser | null);
    setIsLoading(false);

    // Listen for auth changes
    pb.authStore.onChange((token, model) => {
      setUser(model as PBUser | null);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 