export type BudgetStatus = 'within_budget' | 'exceeded';

export interface BudgetItem {
  id: string;
  display_id: number;
  wallet_id: string;
  category_id: string;
  recurrence_group_id: string | null;
  year: number;
  month: number;
  target_amount: number | string;
  used_amount: number | string;
  created_at: string;
  updated_at: string | null;
  remaining_amount?: number;
  percentage_used?: number;
  status?: BudgetStatus;
  pending_amount?: number;
}

export interface BudgetSummary {
  total_target: number;
  total_used: number;
  total_remaining_budget: number;
  forecasted_savings_if_budget_kept: number;
  projected_savings_realistic?: number;
  unbudgeted_expenses?: number;
  total_pending?: number;
}

export interface BudgetAnnualMonthSummary {
  month: number;
  total_target: number;
  total_used: number;
}

export interface BudgetAnnualResponse {
  year: number;
  items: BudgetItem[];
  months: BudgetAnnualMonthSummary[];
}

export interface BudgetListMonthlyResponse {
  items: BudgetItem[];
}

export interface CreateBudgetPayload {
  category_id: string;
  year: number;
  month: number;
  target_amount: number;
  mode?: 'single' | 'recurrent';
  months_quantity?: number;
}

export interface UpdateBudgetPayload {
  target_amount: number;
  scope?: 'single' | 'following';
}

export interface EnrichedBudgetItem extends BudgetItem {
  category_name: string;
  category_color?: string;
  category_icon?: string;
}

export interface BudgetResponse {
  message?: string;
  item?: BudgetItem;
  items?: BudgetItem[];
}

export interface BudgetSummaryApiResponse {
  summary?: Partial<BudgetSummary>;
  total_target?: number | string;
  total_used?: number | string;
  total_remaining_budget?: number | string;
  forecasted_savings_if_budget_kept?: number | string;
  projected_savings_realistic?: number | string;
  unbudgeted_expenses?: number | string;
}

