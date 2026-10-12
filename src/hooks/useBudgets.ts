import { useQuery } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service.ts';
import { transactionService } from '../services/transactionService.ts';
import { useCategories } from './useCategories.ts';
import { useWalletStore } from '../stores/wallet.store.ts';
import type {
  BudgetItem,
  BudgetSummary,
  BudgetAnnualResponse,
  EnrichedBudgetItem,
} from '../types/budget.ts';

export const BUDGET_QUERY_KEYS = {
  all: ['budgets'] as const,
  monthly: (walletId?: string, year?: number, month?: number) =>
    ['budgets', walletId, year, month] as const,
  summary: (walletId?: string, year?: number, month?: number) =>
    ['budgetSummary', walletId, year, month] as const,
  annual: (walletId?: string, year?: number) =>
    ['budgetAnnual', walletId, year] as const,
};

export const useMonthlyBudgets = (year: number, month: number) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery<BudgetItem[]>({
    queryKey: BUDGET_QUERY_KEYS.monthly(currentWalletId ?? undefined, year, month),
    queryFn: () => budgetService.getMonthlyBudgets(year, month),
    enabled: Boolean(currentWalletId) && Boolean(year) && Boolean(month),
  });
};

export const useBudgetSummary = (year: number, month: number) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery<BudgetSummary>({
    queryKey: BUDGET_QUERY_KEYS.summary(currentWalletId ?? undefined, year, month),
    queryFn: () => budgetService.getSummary(year, month),
    enabled: Boolean(currentWalletId) && Boolean(year) && Boolean(month),
  });
};

export const useAnnualBudgets = (year: number) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery<BudgetAnnualResponse>({
    queryKey: BUDGET_QUERY_KEYS.annual(currentWalletId ?? undefined, year),
    queryFn: () => budgetService.getAnnualBudgets(year),
    enabled: Boolean(currentWalletId) && Boolean(year),
  });
};

export const useEnrichedBudgets = (year: number, month: number) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);
  const budgetsQuery = useMonthlyBudgets(year, month);
  const categoriesQuery = useCategories('expenses');

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const transactionsQuery = useQuery({
    queryKey: ['transactions', currentWalletId, 'month-expenses', year, month],
    queryFn: async () => {
      let allRows: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore && page <= 5) {
        const res = await transactionService.getTransactions({
          due_date_from: startDate,
          due_date_to: endDate,
          type: 'expenses',
          limit: 100,
          page,
        });
        const rows = res?.rows || [];
        allRows = allRows.concat(rows);
        hasMore = Boolean(res?.pagination?.has_more) && rows.length > 0;
        page += 1;
      }

      return { rows: allRows };
    },
    enabled: Boolean(currentWalletId) && Boolean(year) && Boolean(month),
  });

  const categories = categoriesQuery.data ?? [];
  const budgets = budgetsQuery.data ?? [];
  const transactions = transactionsQuery.data?.rows ?? [];

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const pendingMap = new Map<string, number>();
  let totalPending = 0;

  transactions.forEach((tx) => {
    if (tx.status !== 'cancelled' && tx.status !== 'completed') {
      const val = Number(tx.value) || 0;
      totalPending += val;
      if (tx.category_id) {
        pendingMap.set(
          tx.category_id,
          (pendingMap.get(tx.category_id) ?? 0) + val
        );
      }
    }
  });

  const enrichedBudgets: EnrichedBudgetItem[] = budgets.map((b) => {
    const category = categoryMap.get(b.category_id);
    const pendingAmount = pendingMap.get(b.category_id) ?? 0;
    return {
      ...b,
      category_name: category?.name ?? 'Categoria',
      category_color: category?.color ?? '#6366f1',
      category_icon: category?.icon ?? 'Folder',
      pending_amount: pendingAmount,
    };
  });

  return {
    ...budgetsQuery,
    data: enrichedBudgets,
    totalPending,
    isCategoriesLoading: categoriesQuery.isLoading,
    isTransactionsLoading: transactionsQuery.isLoading,
  };
};
