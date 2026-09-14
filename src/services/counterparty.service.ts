import { api } from '../lib/axios.ts';

export interface CounterpartyItem {
  id: string;
  display_id?: number;
  wallet_id?: string;
  name: string;
  type: 'payer' | 'payee';
  created_at?: string;
}

export interface CounterpartyResponse {
  message?: string;
  item?: CounterpartyItem;
}

export const counterpartyService = {
  async getCounterparties(type?: 'payer' | 'payee'): Promise<CounterpartyItem[]> {
    const params = type ? { type } : undefined;
    const response = await api.get('/counterpartie', { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data?.item) return [data.item];
    return [];
  },

  async createCounterparty(payload: { name: string; type: 'payer' | 'payee' }): Promise<CounterpartyResponse> {
    const response = await api.post('/counterpartie/register', payload);
    return response.data;
  },

  async updateCounterparty(
    id: number | string,
    payload: { name?: string; type?: 'payer' | 'payee' }
  ): Promise<CounterpartyResponse> {
    const response = await api.patch(`/counterpartie/update/${id}`, payload);
    return response.data;
  },

  async deleteCounterparty(id: number | string): Promise<CounterpartyResponse> {
    const response = await api.delete(`/counterpartie/delete/${id}`);
    return response.data;
  },
};

export default counterpartyService;

