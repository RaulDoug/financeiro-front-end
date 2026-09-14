import { useQuery } from '@tanstack/react-query';
import { bankAccountService, type BankAccountItem } from '../services/bankAccount.service.ts';
import { dashboardService } from '../services/dashboard.service.ts';
import { useWalletStore } from '../stores/wallet.store.ts';

export const useBankAccounts = () => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery<BankAccountItem[]>({
    queryKey: ['bank-accounts', currentWalletId],
    queryFn: async () => {
      const res = await bankAccountService.getBankAccounts();
      const rawItems = Array.isArray(res)
        ? res
        : res?.items || (res?.item ? [res.item] : []);

      return rawItems.map((item: any) => ({
        ...item,
        balance: typeof item.balance === 'string' ? parseFloat(item.balance) : Number(item.balance ?? 0),
      }));
    },
    enabled: Boolean(currentWalletId),
  });
};

export const useAccountBalancesReport = () => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: ['dashboard', 'account-balances', currentWalletId],
    queryFn: () => dashboardService.getAccountBalances(),
    enabled: Boolean(currentWalletId),
  });
};

