// src/utils/useAuth.ts
// Hook global untuk mendapatkan user yang sedang login secara reaktif.
// Bungkus App dengan <AuthProvider> lalu pakai useAuth() di mana saja.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  displayName: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  displayName: '',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil session awal
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Subscribe perubahan
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const displayName =
    (user?.user_metadata?.name as string) || user?.email?.split('@')[0] || '';

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, displayName } },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
