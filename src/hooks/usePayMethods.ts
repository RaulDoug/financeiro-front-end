import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  payMethodService,
  type PayMethodItem,
  type CreatePayMethodDTO,
} from '../services/payMethod.service.ts';
import { useWalletStore } from '../stores/wallet.store.ts';

export const usePayMethods = (params?: { display_id?: number; name?: string }) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery<PayMethodItem[]>({
    queryKey: ['pay-methods', currentWalletId, params],
    queryFn: async () => {
      const res = await payMethodService.getPayMethods(params);
      if (Array.isArray(res)) return res;
      if (res?.items && Array.isArray(res.items)) return res.items;
      if (res?.item) return [res.item];
      return [];
    },
    enabled: Boolean(currentWalletId),
  });
};

export const usePayMethodMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['pay-methods'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreatePayMethodDTO) => payMethodService.registerPayMethod(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<CreatePayMethodDTO> }) =>
      payMethodService.updatePayMethod(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => payMethodService.deletePayMethod(id),
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

