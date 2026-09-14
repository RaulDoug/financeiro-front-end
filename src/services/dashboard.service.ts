import { api } from '../lib/axios.ts';
import {
  type DashboardSummary,
  type AccountBalancesReport,
  type ExpenseByCategoryReport,
  type IncomeVsExpenseReport,
  type CreditCardSummaryReport,
  type OverdueAlertsReport,
  type RecentTransactionsReport,
} from '../types/dashboard.ts';

export const dashboardService = {
  async getSummary(params?: { startDate?: string; endDate?: string }): Promise<DashboardSummary> {
    const response = await api.get<DashboardSummary>('/dashboard-report/summary', { params });
    return response.data;
  },

  async getAccountBalances(): Promise<AccountBalancesReport> {
    const response = await api.get<AccountBalancesReport>('/dashboard-report/account-balances');
    return response.data;
  },

  async getExpenseByCategory(params?: { startDate?: string; endDate?: string }): Promise<ExpenseByCategoryReport> {
    const response = await api.get<ExpenseByCategoryReport>('/dashboard-report/expense-by-category', { params });
    return response.data;
  },

  async getIncomeVsExpense(year?: number): Promise<IncomeVsExpenseReport> {
    const response = await api.get<IncomeVsExpenseReport>('/dashboard-report/income-vs-expense', {
      params: year ? { year } : undefined,
    });
    return response.data;
  },

  async getCreditCardSummary(params?: {
    startDate?: string;
    endDate?: string;
    includeTransactions?: boolean;
  }): Promise<CreditCardSummaryReport> {
    const response = await api.get<CreditCardSummaryReport>('/dashboard-report/credit-card-summary', { params });
    return response.data;
  },

  async getOverdueAlerts(): Promise<OverdueAlertsReport> {
    const response = await api.get<OverdueAlertsReport>('/dashboard-report/overdue-alerts');
    return response.data;
  },

  async getRecentTransactions(limit = 5): Promise<RecentTransactionsReport> {
    const response = await api.get<RecentTransactionsReport>('/dashboard-report/recent-transactions', {
      params: { limit },
    });
    return response.data;
  },
};

export default dashboardService;
