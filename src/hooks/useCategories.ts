import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, type CategoryItem } from '../services/category.service.ts';
import { useWalletStore } from '../stores/wallet.store.ts';

export const useCategories = (type?: 'incomings' | 'expenses') => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery<CategoryItem[]>({
    queryKey: ['categories', currentWalletId, type],
    queryFn: () => categoryService.getCategories(type),
    enabled: Boolean(currentWalletId),
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: { name: string; type: 'incomings' | 'expenses' }) =>
      categoryService.createCategory(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: { name?: string; type?: 'incomings' | 'expenses' } }) =>
      categoryService.updateCategory(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => categoryService.deleteCategory(id),
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

