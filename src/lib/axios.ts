import axios from 'axios';
import { useAuthStore } from '../stores/auth.store.ts';
import { useWalletStore } from '../stores/wallet.store.ts';
import { isDemoRequest, handleDemoMockRequest } from './demoAxiosAdapter.ts';

const isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);

export const api = axios.create({
  baseURL: isDev ? 'http://localhost:3000/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (isDemoRequest(config)) {
    config.adapter = handleDemoMockRequest;
    return config;
  }
  const authState = useAuthStore.getState();
  const token = authState.token || (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null);
  const walletState = useWalletStore.getState();
  const activeWalletId =
    authState.activeWalletId ||
    walletState.currentWalletId ||
    walletState.wallets[0]?.id ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('active_wallet_id') : null);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (activeWalletId) {
    config.headers['x-wallet-id'] = activeWalletId;
    config.headers['x-active-wallet-id'] = activeWalletId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalizar mensagens de validação da API (ex: Zod { status: 'fail', errors: [{ message, field }] })
    if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      interface ApiValidationError {
        message?: string;
        error?: string;
        field?: string;
      }
      const errorList = error.response.data.errors as ApiValidationError[];
      const combined = errorList
        .map((e) => e.message || e.error)
        .filter(Boolean)
        .join('. ');
      if (combined && !error.response.data.message) {
        error.response.data.message = combined;
      }
    }

    // 401: Sessão expirada ou token inválido -> Desloga o usuário
    if (error?.response?.status === 401) {
      const store = useAuthStore.getState();
      store.setSessionExpired(true);
      store.logout();
      useWalletStore.getState().clearWallets();
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('active_wallet_id');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('wallet-storage');
        localStorage.removeItem('auth-storage');
      }

      if (typeof window !== 'undefined' && window.location) {
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login?expired=true';
        }
      }
    }

    // 403: Falta de permissão ou carteira inacessível -> NÃO desloga, apenas limpa carteira órfã
    if (error?.response?.status === 403) {
      const isWalletError = error?.response?.data?.message?.toLowerCase().includes('carteira');
      if (isWalletError) {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('active_wallet_id');
        }
        useAuthStore.getState().setActiveWalletId(null);
        useWalletStore.getState().fetchWallets().catch(() => {});
      }
    }
    return Promise.reject(error);
  }
);

export default api;
