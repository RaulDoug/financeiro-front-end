import { useQuery, useQueryClient } from '@tanstack/react-query';
import { walletService, type WalletItem } from '../services/wallet.service.ts';
import { useWalletStore } from '../stores/wallet.store.ts';

export function useWallets() {
  const queryClient = useQueryClient();
  const { currentWalletId, setCurrentWalletId, setWallets } = useWalletStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const res = await walletService.getWallets();
      const list = res.walletsList || [];
      setWallets(list);
      return list;
    },
    staleTime: 1000 * 60 * 5,
  });

  const wallets: WalletItem[] = data || useWalletStore.getState().wallets;
  const currentWallet =
    wallets.find((w) => w.id === currentWalletId) ||
    (wallets.length > 0 ? wallets[0] : null);

  const switchWallet = async (walletId: string) => {
    setCurrentWalletId(walletId);
    await queryClient.invalidateQueries();
  };

  return {
    wallets,
    currentWallet,
    currentWalletId,
    isLoading,
    error,
    refetch,
    switchWallet,
  };
}

export default useWallets;
