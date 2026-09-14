import { api } from '../lib/axios.ts';

export interface WalletItem {
  id: string;
  name: string;
  role?: 'owner' | 'editor' | 'viewer';
  created_at?: string;
  user_id?: string;
}

export interface WalletListResponse {
  walletsList: WalletItem[];
}

export interface CreateWalletDTO {
  name: string;
}

export interface WalletResponse {
  message: string;
  wallet: WalletItem;
}

export const walletService = {
  async getWallets(): Promise<WalletListResponse> {
    const response = await api.get<WalletListResponse>('/wallet');
    return response.data;
  },

  async registerWallet(data: CreateWalletDTO): Promise<WalletResponse> {
    const response = await api.post<WalletResponse>('/wallet/register', data);
    return response.data;
  },

  async updateWallet(id: string, data: CreateWalletDTO): Promise<WalletResponse> {
    const response = await api.patch<WalletResponse>(`/wallet/update/${id}`, data);
    return response.data;
  },

  async deleteWallet(id: string): Promise<WalletResponse> {
    const response = await api.delete<WalletResponse>(`/wallet/delete/${id}`);
    return response.data;
  },
};

export default walletService;
