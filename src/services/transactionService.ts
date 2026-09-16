import { api } from '../lib/axios.ts';
import type {
  TransactionListResponse,
  TransactionFilters,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  DeleteTransactionPayload,
  Transaction,
} from '../types/transaction.ts';

export const transactionService = {
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionListResponse> {
    const params = new URLSearchParams();

    // Helper to append either a single value or an array of values
    const appendParam = (key: string, value: unknown) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.append(key, String(value));
      }
    };

    appendParam('type', filters.type);
    appendParam('status', filters.status);
    appendParam('bank_account_id', filters.bank_account_id);
    appendParam('category_id', filters.category_id);
    appendParam('pay_methods_id', filters.pay_methods_id);
    appendParam('counterparty_id', filters.counterparty_id);
    appendParam('description', filters.description);
    appendParam('value', filters.value);
    appendParam('value_min', filters.value_min);
    appendParam('value_max', filters.value_max);
    appendParam('due_date_from', filters.due_date_from);
    appendParam('due_date_to', filters.due_date_to);
    appendParam('purchase_date_from', filters.purchase_date_from);
    appendParam('purchase_date_to', filters.purchase_date_to);
    appendParam('created_at_from', filters.created_at_from);
    appendParam('created_at_to', filters.created_at_to);
    if (filters.is_recurrent !== undefined) appendParam('is_recurrent', String(filters.is_recurrent));
    appendParam('order_by', filters.order_by);
    appendParam('order_dir', filters.order_dir);
    appendParam('page', filters.page ?? 1);
    appendParam('limit', filters.limit ?? 20);

    const response = await api.get<TransactionListResponse>(`/transaction?${params.toString()}`);
    return response.data;
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    if (!id) return null;
    const response = await api.get<TransactionListResponse>(`/transaction?id=${encodeURIComponent(id)}`);
    const rows = response.data?.rows || [];
    return rows.length > 0 ? rows[0] : null;
  },

  async createTransaction(payload: CreateTransactionPayload): Promise<any> {
    const response = await api.post('/transaction/register', payload);
    return response.data;
  },

  async updateTransaction(id: string, payload: UpdateTransactionPayload): Promise<any> {
    const response = await api.patch(`/transaction/update/${id}`, payload);
    return response.data;
  },

  async deleteTransaction(id: string, payload: DeleteTransactionPayload = {}): Promise<any> {
    const response = await api.delete(`/transaction/delete/${id}`, { data: payload });
    return response.data;
  },

  calculateOverdue(dueDate: string | null, status: string): { isOverdue: boolean; daysOverdue: number } | null {
    if (!dueDate || (status !== 'pending' && status !== 'expired')) {
      return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cleanDueDate = dueDate.split('T')[0];
    const [year, month, day] = cleanDueDate.split('-').map(Number);
    const due = new Date(year, month - 1, day);
    due.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - due.getTime();
    const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (daysOverdue > 0 || status === 'expired') {
      return { isOverdue: true, daysOverdue: Math.max(daysOverdue, 0) };
    }
    return null;
  },
};

