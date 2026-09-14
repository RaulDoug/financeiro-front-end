import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creditCardService } from '../services/api/creditCards.ts';
import type { CreditCardFormData } from '../types/creditCard.ts';

export const useCreditCardMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
    queryClient.invalidateQueries({ queryKey: ['credit-card-summary'] });
    queryClient.invalidateQueries({ queryKey: ['pay-methods'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreditCardFormData) => creditCardService.createCreditCard(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreditCardFormData> }) =>
      creditCardService.updateCreditCard(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => creditCardService.deleteCreditCard(id),
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

