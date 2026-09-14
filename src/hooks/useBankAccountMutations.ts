import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bankAccountService, type CreateBankAccountDTO } from '../services/bankAccount.service.ts';

export const useBankAccountMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateBankAccountDTO) => bankAccountService.registerBankAccount(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<CreateBankAccountDTO> }) =>
      bankAccountService.updateBankAccount(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => bankAccountService.deleteBankAccount(id),
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

