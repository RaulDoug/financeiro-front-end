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
  created_at?: string;
}

export interface CreditCardTransaction {
  id: string;
  description: string;
  value: string | number;
  status: string;
  due_date: string;
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
}

