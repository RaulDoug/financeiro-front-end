import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { counterpartyService, type CounterpartyItem } from '../services/counterparty.service.ts';
import { useWalletStore } from '../stores/wallet.store.ts';

export const useCounterparties = (type?: 'payer' | 'payee') => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery<CounterpartyItem[]>({
    queryKey: ['counterparties', currentWalletId, type],
    queryFn: () => counterpartyService.getCounterparties(type),
    enabled: Boolean(currentWalletId),
  });
};

export const useCounterpartyMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['counterparties'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: { name: string; type: 'payer' | 'payee' }) =>
      counterpartyService.createCounterparty(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: { name?: string; type?: 'payer' | 'payee' } }) =>
      counterpartyService.updateCounterparty(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => counterpartyService.deleteCounterparty(id),
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

