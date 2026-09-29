import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TransactionFilters } from '../types/transaction.ts';
import { subscribeToWalletChange } from './wallet.store.ts';

export const getDefaultMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

  return {
    due_date_from: `${year}-${month}-01`,
    due_date_to: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
  };
};

export const getDefaultTransactionFilters = (): TransactionFilters => {
  return {
    ...getDefaultMonthRange(),
    order_by: 'due_date',
    order_dir: 'DESC',
    limit: 20,
    page: 1,
  };
};

export const isDefaultTransactionFilters = (filters: TransactionFilters): boolean => {
  const defaults = getDefaultMonthRange();
  const isSameMonth =
    filters.due_date_from === defaults.due_date_from &&
    filters.due_date_to === defaults.due_date_to;

  const hasCategory = Array.isArray(filters.category_id)
    ? filters.category_id.length > 0
    : Boolean(filters.category_id);
  const hasPayMethod = Array.isArray(filters.pay_methods_id)
    ? filters.pay_methods_id.length > 0
    : Boolean(filters.pay_methods_id);
  const hasBankAccount = Array.isArray(filters.bank_account_id)
    ? filters.bank_account_id.length > 0
    : Boolean(filters.bank_account_id);
  const hasValue = filters.value_min !== undefined || filters.value_max !== undefined;

  return (
    isSameMonth &&
    !filters.description &&
    !filters.type &&
    !filters.status &&
    !hasCategory &&
    !hasPayMethod &&
    !hasBankAccount &&
    !hasValue
  );
};

export interface FilterState {
  transactionFilters: TransactionFilters;
  dashboardDate: string;
  recentTransactionsMode: 'month' | 'all';
  setTransactionFilters: (
    updater: TransactionFilters | ((prev: TransactionFilters) => TransactionFilters)
  ) => void;
  resetTransactionFilters: () => TransactionFilters;
  setDashboardDate: (date: Date | string) => void;
  resetDashboardDate: () => void;
  setRecentTransactionsMode: (mode: 'month' | 'all') => void;
  resetWalletSpecificFilters: () => void;
}

const memoryStorage = new Map<string, string>();
const storage =
  typeof window !== 'undefined' && window.localStorage
    ? window.localStorage
    : {
        getItem: (key: string) => memoryStorage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          memoryStorage.set(key, value);
        },
        removeItem: (key: string) => {
          memoryStorage.delete(key);
        },
      };

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      transactionFilters: getDefaultTransactionFilters(),
      dashboardDate: new Date().toISOString(),

      setTransactionFilters: (updater) => {
        set((state) => ({
          transactionFilters:
            typeof updater === 'function' ? updater(state.transactionFilters) : updater,
        }));
      },

      resetTransactionFilters: () => {
        const current = get().transactionFilters;
        const defaults = getDefaultTransactionFilters();
        const nextFilters: TransactionFilters = {
          ...defaults,
          order_by: current.order_by || 'due_date',
          order_dir: current.order_dir || 'DESC',
        };
        set({ transactionFilters: nextFilters });
        return nextFilters;
      },

      setDashboardDate: (date) => {
        const iso = typeof date === 'string' ? date : date.toISOString();
        set({ dashboardDate: iso });
      },

      resetDashboardDate: () => {
        set({ dashboardDate: new Date().toISOString() });
      },

      recentTransactionsMode: 'month',

      setRecentTransactionsMode: (mode) => {
        set({ recentTransactionsMode: mode });
      },

      resetWalletSpecificFilters: () => {
        set((state) => ({
          transactionFilters: {
            ...state.transactionFilters,
            category_id: undefined,
            pay_methods_id: undefined,
            bank_account_id: undefined,
          },
        }));
      },
    }),
    {
      name: 'finflow_filters',
      storage: createJSONStorage(() => storage),
    }
  )
);

subscribeToWalletChange(() => {
  useFilterStore.getState().resetWalletSpecificFilters();
});
