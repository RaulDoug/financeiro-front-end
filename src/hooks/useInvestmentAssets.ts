import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  investmentAssetService,
} from '../services/investment-asset.service.ts';
import type {
  InvestmentAssetItem,
  CreateInvestmentAssetDTO,
  UpdateInvestmentAssetDTO,
} from '../types/investment.ts';
import { useWalletStore } from '../stores/wallet.store.ts';

export const useInvestmentAssets = (params?: {
  display_id?: number;
  name?: string;
  bank_account_id?: string;
}) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  return useQuery<InvestmentAssetItem[]>({
    queryKey: ['investment-assets', currentWalletId, params],
    queryFn: () => investmentAssetService.getAssets(params),
    enabled: Boolean(currentWalletId),
  });
};

export const useInvestmentAssetMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['investment-assets'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateInvestmentAssetDTO) =>
      investmentAssetService.createAsset(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateInvestmentAssetDTO;
    }) => investmentAssetService.updateAsset(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) =>
      investmentAssetService.deleteAsset(id),
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

export default useInvestmentAssets;

