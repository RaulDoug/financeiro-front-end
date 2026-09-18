export type TransactionType = 'incomings' | 'expenses' | 'transfers' | 'transfer_in' | 'transfer_out';

export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'expired';

export interface Transaction {
  id: string;
  value: string;
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  due_date: string | null;
  payment_date: string | null;
  purchase_date: string | null;
  transfers_id: string | null;
  invoice_id: string | null;
  current_installment: string | null;
  bank_account_name: string;
  bank_account_id?: string;
  category_name: string | null;
  category_id?: string;
  pay_method_name: string;
  pay_methods_id?: string;
  counterparty_name: string | null;
  counterparty_id?: string;
  creator_user_name: string;
  created_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_more: boolean;
}

export interface TransactionListResponse {
  rows: Transaction[];
  pagination: PaginationMeta;
  totals?: {
    incomings: number;
    expenses: number;
  };
}

export interface TransactionFilters {
  type?: TransactionType | TransactionType[];
  status?: TransactionStatus | TransactionStatus[];
  bank_account_id?: string | string[];
  category_id?: string | string[];
  pay_methods_id?: string | string[];
  counterparty_id?: string | string[];
  description?: string;
  value?: number;
  value_min?: number;
  value_max?: number;
  due_date_from?: string;
  due_date_to?: string;
  purchase_date_from?: string;
  purchase_date_to?: string;
  created_at_from?: string;
  created_at_to?: string;
  is_recurrent?: boolean;
  order_by?: string;
  order_dir?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface CreateTransactionPayload {
  value: number;
  description: string;
  bank_account_id: string;
  pay_methods_id?: string;
  category_id?: string;
  counterparty_id?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  due_date: string;
  payment_date?: string;
  purchase_date?: string;
  destiny_bank_account_id?: string;
  installments_number?: number;
  due_day?: number;
  first_this_month?: boolean;
}

export interface UpdateTransactionPayload {
  value?: number;
  description?: string;
  bank_account_id?: string;
  pay_methods_id?: string;
  category_id?: string;
  counterparty_id?: string;
  due_date?: string;
  payment_date?: string;
  purchase_date?: string;
  status?: TransactionStatus;
  all_installments?: boolean;
}

export interface DeleteTransactionPayload {
  all_installments?: boolean;
  redistribute?: boolean;
}

