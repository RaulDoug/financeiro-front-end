import { useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service.ts';
import type { CreateBudgetPayload, UpdateBudgetPayload } from '../types/budget.ts';

export const useBudgetMutations = () => {
  const queryClient = useQueryClient();

  const invalidateBudgets = () => {
    queryClient.invalidateQueries({ queryKey: ['budgets'] });
    queryClient.invalidateQueries({ queryKey: ['budgetSummary'] });
    queryClient.invalidateQueries({ queryKey: ['budgetAnnual'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateBudgetPayload) => budgetService.createBudget(payload),
    onSuccess: invalidateBudgets,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBudgetPayload }) =>
      budgetService.updateBudget(id, payload),
    onSuccess: invalidateBudgets,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, scope }: { id: string; scope?: 'single' | 'following' }) =>
      budgetService.deleteBudget(id, scope),
    onSuccess: invalidateBudgets,
  });

  const recalculateMutation = useMutation({
    mutationFn: ({
      categoryId,
      year,
      month,
    }: {
      categoryId: string;
      year: number;
      month: number;
    }) => budgetService.recalculateUsedAmount(categoryId, year, month),
    onSuccess: invalidateBudgets,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    recalculateMutation,
  };
};
