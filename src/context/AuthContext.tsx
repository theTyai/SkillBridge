import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import api from '../lib/api';

export interface PlatformIdentity {
  id: string;
  email: string;
  role: 'STUDENT' | 'INDUSTRY' | 'ACADEMICIAN' | 'ADMIN';
  institutionId?: string;
  organizationId?: string;
  profile: {
    name: string;
    avatarUrl: string;
    portfolioSlug?: string;
    designation?: string;
  };
}

interface AuthContextType {
  currentUser: PlatformIdentity | null;
  loading: boolean;
  error: string | null;
  signInAsDevUser: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  error: null,
  signInAsDevUser: async () => {},
  signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<PlatformIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data.data);
      setError(null);
    } catch (err) {
      setCurrentUser(null);
      setError('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchMe();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchMe();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInAsDevUser = async (email: string) => {
    setLoading(true);
    // Note: For dev personas, we seed them with a known password
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'password123'
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, signInAsDevUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
