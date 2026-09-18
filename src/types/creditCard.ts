export interface CreditCardItem {
  id: string;
  display_id?: number;
  wallet_id?: string;
  name: string;
  credit_card: true;
  bank_account_id: string;
  bank_account_name?: string;
  due_day: number;
  closing_day: number;
  last_four_digits: string;
  credit_limit: number;
  used_credit_limit?: number;
  available_limit?: number;
  current_invoice_total?: number;
  color?: string;
  brand?: string;
  icon?: string;
  created_at?: string;
}

export interface CreditCardTransaction {
  id: string;
  description: string;
  value: string | number;
  status: string;
  due_date: string;
  purchase_date?: string | null;
  category_name?: string | null;
  pay_method_name?: string;
  bank_account_name?: string;
  current_installment?: number | string | null;
  total_installments?: number | string | null;
  installments_group_id?: string | null;
}

export interface CreditCardSummaryWithTransactions {
  pay_method_id: string;
  name: string;
  credit_limit: number;
  used_credit_limit: number;
  available_limit: number;
  current_invoice_total: number;
  transactions?: CreditCardTransaction[];
}

export interface CreditCardFormData {
  name: string;
  bank_account_id: string;
  due_day: number;
  closing_day: number;
  last_four_digits: string;
  credit_limit: number;
  color?: string;
  brand?: string;
  icon?: string;
}

