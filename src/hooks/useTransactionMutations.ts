import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService.ts';
import type {
  CreateTransactionPayload,
  UpdateTransactionPayload,
  DeleteTransactionPayload,
} from '../types/transaction.ts';

export const useTransactionMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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

