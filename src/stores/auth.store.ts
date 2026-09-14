import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  activeWalletId: string | null;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
  setAuth: (user: User, token: string) => void;
  setActiveWalletId: (walletId: string | null) => void;
  setSessionExpired: (expired: boolean) => void;
  logout: () => void;
}

const memoryStorage = new Map<string, string>();
const storage = typeof window !== 'undefined' && window.localStorage
  ? window.localStorage
  : {
      getItem: (key: string) => memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string) => { memoryStorage.set(key, value); },
      removeItem: (key: string) => { memoryStorage.delete(key); },
    };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      activeWalletId: null,
      isAuthenticated: false,
      isSessionExpired: false,

      setAuth: (user, token) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isSessionExpired: false,
        });
      },

      setActiveWalletId: (walletId) => {
        if (typeof localStorage !== 'undefined') {
          if (walletId) {
            localStorage.setItem('active_wallet_id', walletId);
          } else {
            localStorage.removeItem('active_wallet_id');
          }
        }
        set({ activeWalletId: walletId });
      },

      setSessionExpired: (expired) => {
        set({ isSessionExpired: expired });
      },

      logout: () => {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('active_wallet_id');
        }
        set({
          user: null,
          token: null,
          activeWalletId: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage as Storage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        activeWalletId: state.activeWalletId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

