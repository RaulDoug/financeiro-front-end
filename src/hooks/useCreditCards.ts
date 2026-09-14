import { useQuery } from '@tanstack/react-query';
import { creditCardService } from '../services/api/creditCards.ts';
import { useWalletStore } from '../stores/wallet.store.ts';

export const useCreditCards = () => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: ['credit-cards', currentWalletId],
    queryFn: () => creditCardService.getCreditCards(),
    enabled: Boolean(currentWalletId),
  });
};

export const useCreditCardSummary = (params: {
  startDate?: string;
  endDate?: string;
} = {}) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery({
    queryKey: ['credit-card-summary', currentWalletId, params.startDate, params.endDate],
    queryFn: () => creditCardService.getCreditCardSummary(params),
    enabled: Boolean(currentWalletId),
  });
};

