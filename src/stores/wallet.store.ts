import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../lib/axios.ts';
import { useAuthStore } from './auth.store.ts';

export interface Wallet {
  id: string;
  name: string;
  role?: 'owner' | 'editor' | 'viewer';
  created_at?: string;
  user_id?: string;
}

export interface WalletState {
  wallets: Wallet[];
  currentWalletId: string | null;
  currentWallet: Wallet | null;
  isLoading: boolean;
  hasCheckedWallets: boolean;
  error: string | null;
  setWallets: (wallets: Wallet[]) => void;
  setCurrentWalletId: (id: string | null) => void;
  fetchWallets: () => Promise<Wallet[]>;
  addWallet: (wallet: Wallet) => void;
  clearWallets: () => void;
}

const memoryStorage = new Map<string, string>();
const storage = typeof window !== 'undefined' && window.localStorage
  ? window.localStorage
  : {
      getItem: (key: string) => memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string) => { memoryStorage.set(key, value); },
      removeItem: (key: string) => { memoryStorage.delete(key); },
    };

const walletChangeListeners = new Set<(newWalletId: string | null) => void>();

export const subscribeToWalletChange = (listener: (newWalletId: string | null) => void) => {
  walletChangeListeners.add(listener);
  return () => {
    walletChangeListeners.delete(listener);
  };
};

export const notifyWalletChanged = (newWalletId: string | null) => {
  walletChangeListeners.forEach((fn) => {
    try {
      fn(newWalletId);
    } catch {
      // ignore
    }
  });
};

export function resolveDefaultWallet(
  currentWalletId: string | null,
  wallets: { id: string }[]
): string | null {
  if (currentWalletId && wallets.some((w) => w.id === currentWalletId)) {
    return currentWalletId;
  }
  return wallets.length > 0 ? wallets[0].id : null;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallets: [],
      currentWalletId: null,
      currentWallet: null,
      isLoading: false,
      hasCheckedWallets: false,
      error: null,

      setWallets: (wallets: Wallet[]) => {
        const currentId = get().currentWalletId;
        const currentStillExists = wallets.find((w) => w.id === currentId);
        const selectedWallet = currentStillExists || (wallets.length > 0 ? wallets[0] : null);
        const selectedId = selectedWallet ? selectedWallet.id : null;

        if (selectedId) {
          useAuthStore.getState().setActiveWalletId(selectedId);
        }

        set({
          wallets,
          currentWallet: selectedWallet,
          currentWalletId: selectedId,
          hasCheckedWallets: true,
        });
      },

      setCurrentWalletId: (id: string | null) => {
        const previousId = get().currentWalletId;
        const wallet = get().wallets.find((w) => w.id === id) || null;
        useAuthStore.getState().setActiveWalletId(id);
        set({
          currentWalletId: id,
          currentWallet: wallet || (id ? ({ id, name: '' } as Wallet) : null),
        });

        if (previousId !== id) {
          notifyWalletChanged(id);
        }
      },

      fetchWallets: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/wallet');
          const list: Wallet[] = response.data?.walletsList || [];
          get().setWallets(list);
          set({ isLoading: false, hasCheckedWallets: true });
          return list;
        } catch (err: any) {
          const message = err?.response?.data?.message || err.message || 'Erro ao carregar carteiras';
          set({ isLoading: false, error: message, hasCheckedWallets: true });
          throw err;
        }
      },

      addWallet: (wallet: Wallet) => {
        const currentWallets = get().wallets;
        const updated = [...currentWallets, wallet];
        useAuthStore.getState().setActiveWalletId(wallet.id);
        set({
          wallets: updated,
          currentWallet: wallet,
          currentWalletId: wallet.id,
          hasCheckedWallets: true,
        });
      },

      clearWallets: () => {
        set({
          wallets: [],
          currentWalletId: null,
          currentWallet: null,
          hasCheckedWallets: false,
          error: null,
        });
      },
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => storage as Storage),
      partialize: (state) => ({
        currentWalletId: state.currentWalletId,
        wallets: state.wallets,
      }),
    }
  )
);
