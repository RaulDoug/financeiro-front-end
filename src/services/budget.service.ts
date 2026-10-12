import { api } from '../lib/axios.ts';
import type {
  BudgetItem,
  BudgetSummary,
  BudgetAnnualResponse,
  BudgetListMonthlyResponse,
  BudgetResponse,
  BudgetSummaryApiResponse,
  CreateBudgetPayload,
  UpdateBudgetPayload,
} from '../types/budget.ts';

export const budgetService = {
  async getBudgets(year: number, month?: number): Promise<BudgetListMonthlyResponse | BudgetAnnualResponse> {
    const params: Record<string, number> = { year };
    if (month !== undefined && month !== null) {
      params.month = month;
    }
    const response = await api.get<BudgetListMonthlyResponse | BudgetAnnualResponse>('/budget', { params });
    return response.data;
  },

  async getMonthlyBudgets(year: number, month: number): Promise<BudgetItem[]> {
    const response = await api.get<BudgetListMonthlyResponse>('/budget', {
      params: { year, month },
    });
    return response.data?.items ?? [];
  },

  async getAnnualBudgets(year: number): Promise<BudgetAnnualResponse> {
    const response = await api.get<BudgetAnnualResponse>('/budget', {
      params: { year },
    });
    return response.data;
  },

  async getSummary(year: number, month: number): Promise<BudgetSummary> {
    const response = await api.get<BudgetSummaryApiResponse>('/budget/summary', {
      params: { year, month },
    });
    const payload = response.data?.summary ?? response.data ?? {};
    const forecasted = Number(payload.forecasted_savings_if_budget_kept ?? 0);
    return {
      total_target: Number(payload.total_target ?? 0),
      total_used: Number(payload.total_used ?? 0),
      total_remaining_budget: Number(payload.total_remaining_budget ?? 0),
      forecasted_savings_if_budget_kept: forecasted,
      projected_savings_realistic: Number(
        payload.projected_savings_realistic ?? forecasted
      ),
      unbudgeted_expenses: Number(payload.unbudgeted_expenses ?? 0),
    };
  },

  async createBudget(payload: CreateBudgetPayload): Promise<BudgetResponse> {
    const response = await api.post<BudgetResponse>('/budget/register', payload);
    return response.data;
  },

  async updateBudget(id: string, payload: UpdateBudgetPayload): Promise<BudgetResponse> {
    const response = await api.patch<BudgetResponse>(`/budget/update/${id}`, payload);
    return response.data;
  },

  async deleteBudget(id: string, scope: 'single' | 'following' = 'single'): Promise<BudgetResponse> {
    const response = await api.delete<BudgetResponse>(`/budget/delete/${id}`, {
      params: { scope },
    });
    return response.data;
  },

  async recalculateUsedAmount(category_id: string, year: number, month: number): Promise<BudgetResponse> {
    const response = await api.patch<BudgetResponse>(
      '/budget/recalculate_used_amount',
      {},
      {
        params: { category_id, year, month },
      }
    );
    return response.data;
  },
};

