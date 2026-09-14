import { api } from '../lib/axios.ts';

export interface PayMethodItem {
  id: string;
  display_id?: number;
  wallet_id?: string;
  name: string;
  credit_card: boolean;
  bank_account_id?: string | null;
  due_day?: number | null;
  closing_day?: number | null;
  last_four_digits?: string | null;
  credit_limit?: number | string | null;
  created_at?: string;
}

export interface CreatePayMethodDTO {
  name: string;
  credit_card?: boolean;
  bank_account_id?: string;
  due_day?: number;
  closing_day?: number;
  last_four_digits?: string;
  credit_limit?: number;
}

export interface PayMethodResponse {
  message: string;
  item: PayMethodItem;
}

export const payMethodService = {
  async getPayMethods(params?: { display_id?: number; name?: string; wallet_id?: string }) {
    const response = await api.get('/pay-method', { params });
    return response.data;
  },

  async registerPayMethod(
    data: CreatePayMethodDTO,
    walletId?: string
  ): Promise<PayMethodResponse> {
    const config = walletId
      ? { headers: { 'x-wallet-id': walletId } }
      : undefined;

    const response = await api.post<PayMethodResponse>(
      '/pay-method/register',
      data,
      config
    );
    return response.data;
  },

  async updatePayMethod(
    id: number | string,
    data: Partial<CreatePayMethodDTO>
  ): Promise<PayMethodResponse> {
    const response = await api.patch<PayMethodResponse>(
      `/pay-method/update/${id}`,
      data
    );
    return response.data;
  },

  async deletePayMethod(id: number | string): Promise<PayMethodResponse> {
    const response = await api.delete<PayMethodResponse>(
      `/pay-method/delete/${id}`
    );
    return response.data;
  },
};

export default payMethodService;

