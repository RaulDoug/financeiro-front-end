import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService.ts';
import type {
  CreateTransactionPayload,
  UpdateTransactionPayload,
  DeleteTransactionPayload,
} from '../types/transaction.ts';

export const useTransactionMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      queryClient.invalidateQueries({ queryKey: ['transactions-overdue-past'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] }),
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] }),
      queryClient.invalidateQueries({ queryKey: ['credit-card-summary'] }),
      queryClient.invalidateQueries({ queryKey: ['reports'] }),
      queryClient.refetchQueries({ queryKey: ['transactions'], type: 'active' }),
      queryClient.refetchQueries({ queryKey: ['transactions-overdue-past'], type: 'active' }),
      queryClient.refetchQueries({ queryKey: ['dashboard'], type: 'active' }),
      queryClient.refetchQueries({ queryKey: ['bank-accounts'], type: 'active' }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) => transactionService.createTransaction(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      transactionService.updateTransaction(id, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: DeleteTransactionPayload }) =>
      transactionService.deleteTransaction(id, payload),
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

