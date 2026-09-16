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
  icon?: string;
  color?: string;
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
  icon?: string;
  color?: string;
}

export interface PayMethodResponse {
  message: string;
  item: PayMethodItem;
}

export function sanitizeRegisterPayMethodPayload(data: Partial<CreatePayMethodDTO> & Record<string, any>): Record<string, any> {
  const payload: Record<string, any> = {};

  if (typeof data.name === 'string' && data.name.trim().length > 0) {
    payload.name = data.name.trim();
  }

  if (data.credit_card !== undefined) {
    payload.credit_card = Boolean(data.credit_card);
  }

  if (typeof data.bank_account_id === 'string' && data.bank_account_id.trim().length > 0) {
    payload.bank_account_id = data.bank_account_id.trim();
  }

  if (data.due_day !== undefined && data.due_day !== null && String(data.due_day).trim() !== '') {
    const due = Number(data.due_day);
    if (!isNaN(due)) payload.due_day = due;
  }

  if (data.closing_day !== undefined && data.closing_day !== null && String(data.closing_day).trim() !== '') {
    const closing = Number(data.closing_day);
    if (!isNaN(closing)) payload.closing_day = closing;
  }

  if (data.last_four_digits !== undefined && data.last_four_digits !== null && String(data.last_four_digits).trim() !== '') {
    payload.last_four_digits = String(data.last_four_digits).trim();
  }

  if (data.credit_limit !== undefined && data.credit_limit !== null && String(data.credit_limit).trim() !== '') {
    const limit = Number(data.credit_limit);
    if (!isNaN(limit)) payload.credit_limit = limit;
  }

  if (typeof data.icon === 'string' && data.icon.trim().length > 0) {
    payload.icon = data.icon.trim();
  }

  if (typeof data.color === 'string' && data.color.trim().length > 0) {
    payload.color = data.color.trim();
  }

  return payload;
}

export function sanitizeUpdatePayMethodPayload(data: Partial<CreatePayMethodDTO> & Record<string, any>): Record<string, any> {
  const payload: Record<string, any> = {};

  if (typeof data.name === 'string' && data.name.trim().length > 0) {
    payload.name = data.name.trim();
  }

  if (typeof data.bank_account_id === 'string' && data.bank_account_id.trim().length > 0) {
    payload.bank_account_id = data.bank_account_id.trim();
  }

  if (data.due_day !== undefined && data.due_day !== null && String(data.due_day).trim() !== '') {
    const due = Number(data.due_day);
    if (!isNaN(due)) payload.due_day = due;
  }

  if (data.closing_day !== undefined && data.closing_day !== null && String(data.closing_day).trim() !== '') {
    const closing = Number(data.closing_day);
    if (!isNaN(closing)) payload.closing_day = closing;
  }

  if (data.last_four_digits !== undefined && data.last_four_digits !== null && String(data.last_four_digits).trim() !== '') {
    payload.last_four_digits = String(data.last_four_digits).trim();
  }

  if (data.credit_limit !== undefined && data.credit_limit !== null && String(data.credit_limit).trim() !== '') {
    const limit = Number(data.credit_limit);
    if (!isNaN(limit)) payload.credit_limit = limit;
  }

  if (typeof data.icon === 'string' && data.icon.trim().length > 0) {
    payload.icon = data.icon.trim();
  }

  if (typeof data.color === 'string' && data.color.trim().length > 0) {
    payload.color = data.color.trim();
  }

  return payload;
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

    const payload = sanitizeRegisterPayMethodPayload(data);

    const response = await api.post<PayMethodResponse>(
      '/pay-method/register',
      payload,
      config
    );
    return response.data;
  },

  async updatePayMethod(
    id: number | string,
    data: Partial<CreatePayMethodDTO>
  ): Promise<PayMethodResponse> {
    const payload = sanitizeUpdatePayMethodPayload(data);

    const response = await api.patch<PayMethodResponse>(
      `/pay-method/update/${id}`,
      payload
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

