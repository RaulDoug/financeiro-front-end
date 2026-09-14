import { api } from '../lib/axios.ts';

export interface BankAccountItem {
  id: string;
  display_id?: number;
  wallet_id?: string;
  bank_name: string;
  balance: number | string;
  allow_negative_balance: boolean;
  created_at?: string;
}

export interface CreateBankAccountDTO {
  bank_name: string;
  balance?: number;
  allow_negative_balance?: boolean;
}

export interface BankAccountResponse {
  message: string;
  item: BankAccountItem;
}

export const bankAccountService = {
  async getBankAccounts(params?: { display_id?: number; bank_name?: string; wallet_id?: string }) {
    const response = await api.get('/bank-account', { params });
    return response.data;
  },

  async registerBankAccount(
    data: CreateBankAccountDTO,
    walletId?: string
  ): Promise<BankAccountResponse> {
    const config = walletId
      ? { headers: { 'x-wallet-id': walletId } }
      : undefined;

    const payload = {
      bank_name: data.bank_name,
      balance: data.balance ?? 0,
      allow_negative_balance: data.allow_negative_balance ?? false,
    };

    const response = await api.post<BankAccountResponse>(
      '/bank-account/register',
      payload,
      config
    );
    return response.data;
  },

  async updateBankAccount(
    id: number | string,
    data: Partial<CreateBankAccountDTO>
  ): Promise<BankAccountResponse> {
    const response = await api.patch<BankAccountResponse>(
      `/bank-account/update/${id}`,
      data
    );
    return response.data;
  },

  async deleteBankAccount(id: number | string): Promise<BankAccountResponse> {
    const response = await api.delete<BankAccountResponse>(
      `/bank-account/delete/${id}`
    );
    return response.data;
  },
};

export default bankAccountService;

