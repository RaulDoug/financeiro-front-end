import { api } from '../lib/axios.ts';
import {
  type IncomeVsExpenseReport,
  type ExpenseByCategoryReport,
} from '../types/dashboard.ts';

export const reportsService = {
  async getAnnualDRE(year?: number): Promise<IncomeVsExpenseReport> {
    const response = await api.get<IncomeVsExpenseReport>('/dashboard-report/income-vs-expense', {
      params: year ? { year } : undefined,
    });
    return response.data;
  },

  async getExpenseByCategory(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ExpenseByCategoryReport> {
    const response = await api.get<ExpenseByCategoryReport>(
      '/dashboard-report/expense-by-category',
      { params }
    );
    return response.data;
  },
};

export default reportsService;

