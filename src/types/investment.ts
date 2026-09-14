export interface InvestmentAssetItem {
  id: string;
  display_id?: number;
  wallet_id?: string;
  bank_account_id: string;
  bank_account_name?: string;
  name: string;
  due_date?: string | null;
  created_at?: string;
}

export interface CreateInvestmentAssetDTO {
  name: string;
  bank_account_id: string;
  due_date?: string | null;
}

export interface UpdateInvestmentAssetDTO {
  name?: string;
  due_date?: string | null;
}

export interface InvestmentAssetResponse {
  message?: string;
  item?: InvestmentAssetItem;
}

