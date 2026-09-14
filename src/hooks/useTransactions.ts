import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService.ts';
import { useWalletStore } from '../stores/wallet.store.ts';
import type { TransactionFilters, TransactionListResponse } from '../types/transaction.ts';

export const useTransactions = (filters: TransactionFilters = {}) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useInfiniteQuery<TransactionListResponse>({
    queryKey: ['transactions', currentWalletId, filters],
    queryFn: ({ pageParam = 1 }) =>
      transactionService.getTransactions({
        ...filters,
        page: pageParam as number,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.has_more) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    enabled: Boolean(currentWalletId),
  });
};

export const useInvalidateTransactions = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };
};

