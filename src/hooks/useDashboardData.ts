import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service.ts';
import { useWalletStore } from '../stores/wallet.store.ts';

export const DASHBOARD_QUERY_KEYS = {
  all: ['dashboard'] as const,
  summary: (walletId: string | null, params?: { startDate?: string; endDate?: string }) =>
    ['dashboard', walletId, 'summary', params] as const,
  accountBalances: (walletId: string | null) =>
    ['dashboard', walletId, 'account-balances'] as const,
  expenseByCategory: (walletId: string | null, params?: { startDate?: string; endDate?: string }) =>
    ['dashboard', walletId, 'expense-by-category', params] as const,
  incomeVsExpense: (walletId: string | null, year?: number) =>
    ['dashboard', walletId, 'income-vs-expense', year] as const,
  creditCardSummary: (walletId: string | null, params?: { startDate?: string; endDate?: string }) =>
    ['dashboard', walletId, 'credit-card-summary', params] as const,
  overdueAlerts: (walletId: string | null) =>
    ['dashboard', walletId, 'overdue-alerts'] as const,
  recentTransactions: (walletId: string | null, limit?: number) =>
    ['dashboard', walletId, 'recent-transactions', limit] as const,
};

export function useDashboardSummary(params?: { startDate?: string; endDate?: string }) {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.summary(currentWalletId, params),
    queryFn: () => dashboardService.getSummary(params),
    enabled: !!currentWalletId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useAccountBalances() {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.accountBalances(currentWalletId),
    queryFn: () => dashboardService.getAccountBalances(),
    enabled: !!currentWalletId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useExpenseByCategory(params?: { startDate?: string; endDate?: string }) {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.expenseByCategory(currentWalletId, params),
    queryFn: () => dashboardService.getExpenseByCategory(params),
    enabled: !!currentWalletId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useIncomeVsExpense(year?: number) {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.incomeVsExpense(currentWalletId, year),
    queryFn: () => dashboardService.getIncomeVsExpense(year),
    enabled: !!currentWalletId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreditCardSummary(params?: { startDate?: string; endDate?: string }) {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.creditCardSummary(currentWalletId, params),
    queryFn: () => dashboardService.getCreditCardSummary(params),
    enabled: !!currentWalletId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useOverdueAlerts() {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.overdueAlerts(currentWalletId),
    queryFn: () => dashboardService.getOverdueAlerts(),
    enabled: !!currentWalletId,
    staleTime: 1000 * 60 * 1, // 1 minuto
  });
}

export function useRecentTransactions(limit = 5) {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.recentTransactions(currentWalletId, limit),
    queryFn: () => dashboardService.getRecentTransactions(limit),
    enabled: !!currentWalletId,
    staleTime: 1000 * 60 * 1,
  });
}
