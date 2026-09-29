import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service.ts';
import { transactionService } from '../services/transactionService.ts';
import { useWalletStore } from '../stores/wallet.store.ts';
import { resolveTransactionDate } from '../utils/formatDate.ts';
import type { RecentTransactionItem, RecentTransactionsReport } from '../types/dashboard.ts';

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
  recentTransactions: (
    walletId: string | null,
    limit?: number,
    options?: { mode?: 'month' | 'all'; startDate?: string; endDate?: string }
  ) => ['dashboard', walletId, 'recent-transactions', limit, options] as const,
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

export interface UseRecentTransactionsOptions {
  limit?: number;
  mode?: 'month' | 'all';
  startDate?: string;
  endDate?: string;
}

export function useRecentTransactions(
  optionsOrLimit: number | UseRecentTransactionsOptions = 5
) {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  const opts: UseRecentTransactionsOptions =
    typeof optionsOrLimit === 'number'
      ? { limit: optionsOrLimit, mode: 'month' }
      : { limit: 5, mode: 'month', ...optionsOrLimit };

  const { limit = 5, mode = 'month', startDate, endDate } = opts;

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.recentTransactions(currentWalletId, limit, {
      mode,
      startDate,
      endDate,
    }),
    queryFn: async (): Promise<RecentTransactionsReport> => {
      if (mode === 'month' && startDate && endDate) {
        const res = await transactionService.getTransactions({
          due_date_from: startDate,
          due_date_to: endDate,
          limit: Math.max(20, limit),
          order_by: 'due_date',
          order_dir: 'DESC',
          status: ['pending', 'completed', 'expired'],
        });

        const recentTransactions: RecentTransactionItem[] = (res.rows || [])
          .slice(0, limit)
          .map((tx) => ({
            id: tx.id,
            description: tx.description,
            value: Number(tx.value),
            type: tx.type,
            status: tx.status as RecentTransactionItem['status'],
            date: resolveTransactionDate(tx) || tx.due_date || '',
            category_name: tx.category_name || undefined,
            pay_method_name: tx.pay_method_name || undefined,
          }));

        return { recentTransactions };
      }

      return dashboardService.getRecentTransactions(limit);
    },
    enabled: !!currentWalletId,
    staleTime: 1000 * 60 * 1,
  });
}

