import { useState } from 'react';
import { useWalletStore } from '../stores/wallet.store.ts';
import { walletService } from '../services/wallet.service.ts';

export const useWalletSettings = () => {
  const currentWallet = useWalletStore((state) => state.currentWallet);
  const currentWalletId = useWalletStore((state) => state.currentWalletId);
  const fetchWallets = useWalletStore((state) => state.fetchWallets);
  const setWallets = useWalletStore((state) => state.setWallets);
  const wallets = useWalletStore((state) => state.wallets);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = currentWallet?.role === 'owner' || !currentWallet?.role;

  const updateWalletName = async (name: string) => {
    if (!currentWalletId) throw new Error('Nenhuma carteira selecionada');
    setIsLoading(true);
    setError(null);
    try {
      const res = await walletService.updateWallet(currentWalletId, { name });
      const updatedWallets = wallets.map((w) =>
        w.id === currentWalletId ? { ...w, name } : w
      );
      setWallets(updatedWallets);
      return res;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao atualizar carteira';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCurrentWallet = async () => {
    if (!currentWalletId) throw new Error('Nenhuma carteira selecionada');
    setIsLoading(true);
    setError(null);
    try {
      const res = await walletService.deleteWallet(currentWalletId);
      await fetchWallets();
      return res;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao excluir carteira';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentWallet,
    currentWalletId,
    isOwner,
    isLoading,
    error,
    updateWalletName,
    deleteCurrentWallet,
  };
};

export default useWalletSettings;

