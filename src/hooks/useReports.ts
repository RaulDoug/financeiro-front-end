import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service.ts';
import { transactionService } from '../services/transactionService.ts';
import { consolidateCounterparties } from '../lib/reportUtils.ts';
import { useWalletStore } from '../stores/wallet.store.ts';

export const useAnnualReport = (year: number) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: ['report-annual', currentWalletId, year],
    queryFn: () => reportsService.getAnnualDRE(year),
    enabled: Boolean(currentWalletId),
  });
};

export const useCategoryReport = (startDate?: string, endDate?: string) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: ['report-category', currentWalletId, startDate, endDate],
    queryFn: () => reportsService.getExpenseByCategory({ startDate, endDate }),
    enabled: Boolean(currentWalletId),
  });
};

export const useCounterpartyReport = (startDate?: string, endDate?: string) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: ['report-counterparty', currentWalletId, startDate, endDate],
    queryFn: async () => {
      const response = await transactionService.getTransactions({
        due_date_from: startDate,
        due_date_to: endDate,
        limit: 100,
      });
      const transactions = response?.rows || [];
      return consolidateCounterparties(transactions);
    },
    enabled: Boolean(currentWalletId),
  });
};
