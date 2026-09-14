export interface BankAccountItem {
  id: string;
  display_id?: number;
  wallet_id?: string;
  bank_name: string;
  balance: number | string;
  allow_negative_balance: boolean;
  created_at?: string;
}

export interface BankAccountFormData {
  bank_name: string;
  balance?: number;
  allow_negative_balance?: boolean;
}

