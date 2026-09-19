// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../src/lib/api';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import React from 'react';
import { supabase } from '../src/lib/supabase';

// Mock Supabase
vi.mock('../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn()
    }
  }
}));

// Mock axios
vi.mock('../src/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

const TestComponent = () => {
  const { currentUser, loading, signInAsDevUser, signOut } = useAuth();

  if (loading) return <div>Loading Auth...</div>;

  return (
    <div>
      <div data-testid="user-id">{currentUser ? currentUser.id : 'none'}</div>
      <button onClick={() => signInAsDevUser('test@test.com')}>Sign In</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

describe('Frontend Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthContext', () => {
    it('initializes with no user if no session exists', async () => {
      (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
      (supabase.auth.onAuthStateChange as any).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByText('Loading Auth...')).toBeDefined();
      
      await waitFor(() => {
        expect(screen.getByTestId('user-id').textContent).toBe('none');
      });
    });

    it('fetches /me and sets currentUser if session exists', async () => {
      (supabase.auth.getSession as any).mockResolvedValue({ data: { session: { access_token: 'fake-token' } } });
      (supabase.auth.onAuthStateChange as any).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      });

      (api.get as any).mockResolvedValue({
        data: { data: { id: 'usr-123', email: 'student@test.com', role: 'STUDENT', profile: { name: 'Test Student' } } }
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-id').textContent).toBe('usr-123');
      });
      
      expect(api.get).toHaveBeenCalledWith('/auth/me');
    });
  });
});
