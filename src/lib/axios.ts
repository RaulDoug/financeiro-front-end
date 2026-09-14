import axios from 'axios';
import { useAuthStore } from '../stores/auth.store.ts';

export const api = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const state = useAuthStore.getState();
  const token = state.token || (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null);
  const activeWalletId = state.activeWalletId || (typeof localStorage !== 'undefined' ? localStorage.getItem('active_wallet_id') : null);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (activeWalletId) {
    config.headers['x-wallet-id'] = activeWalletId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const store = useAuthStore.getState();
      store.setSessionExpired(true);
      store.logout();

      if (typeof window !== 'undefined' && window.location) {
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
