import { api } from '../lib/axios.ts';
import type {
  InvestmentAssetItem,
  CreateInvestmentAssetDTO,
  UpdateInvestmentAssetDTO,
  InvestmentAssetResponse,
} from '../types/investment.ts';

export const investmentAssetService = {
  async getAssets(params?: {
    display_id?: number;
    name?: string;
    bank_account_id?: string;
    due_date?: string;
  }): Promise<InvestmentAssetItem[]> {
    const response = await api.get('/investiment-asset', { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    if (data?.item) return [data.item];
    return [];
  },

  async createAsset(payload: CreateInvestmentAssetDTO): Promise<InvestmentAssetResponse> {
    const response = await api.post('/investiment-asset/register', payload);
    return response.data;
  },

  async updateAsset(
    id: number | string,
    payload: UpdateInvestmentAssetDTO
  ): Promise<InvestmentAssetResponse> {
    const response = await api.patch(`/investiment-asset/update/${id}`, payload);
    return response.data;
  },

  async deleteAsset(id: number | string): Promise<InvestmentAssetResponse> {
    const response = await api.delete(`/investiment-asset/delete/${id}`);
    return response.data;
  },
};

export default investmentAssetService;

