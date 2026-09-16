export interface DashboardSummary {
  completedIncomes: number;
  completedExpenses: number;
  pendingIncomes: number;
  pendingExpenses: number;
  totalBalance: number;
  monthForecast: number;
}

export interface AccountBalanceItem {
  id: string;
  bank_name: string;
  balance: number;
}

export interface AccountBalancesReport {
  accountBalances: AccountBalanceItem[];
  totalBalances: number;
}

export interface ExpenseByCategoryItem {
  category_id: string;
  category_name: string;
  total_amount: number;
  percentage: number;
}

export interface ExpenseByCategoryReport {
  expensesByCategory: ExpenseByCategoryItem[];
}

export interface MonthlyFlowSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRatePercentage: number;
}

export interface YearlyFlowItem {
  month: number;
  income: number;
  expense: number;
  balance: number;
}

export interface IncomeVsExpenseReport {
  incomeVsExpense: {
    monthly: MonthlyFlowSummary;
    yearly: YearlyFlowItem[];
  };
}

export interface CreditCardTransaction {
  id: string;
  description: string;
  value: string | number;
  status: string;
  due_date: string;
}

export interface CreditCardSummaryItem {
  pay_method_id: string;
  name: string;
  credit_limit: number;
  used_credit_limit: number;
  available_limit: number;
  current_invoice_total: number;
  transactions?: CreditCardTransaction[];
}

export interface CreditCardSummaryReport {
  creditCardSummary: CreditCardSummaryItem[];
}

export interface OverdueAlertItem {
  id: string;
  description: string;
  value: number;
  due_date: string;
  type: 'expenses' | 'incomings' | string;
  days_overdue: number;
}

export interface OverdueAlertsReport {
  overdueAlerts: {
    total_overdue: number;
    items: OverdueAlertItem[];
  };
}

import type { TransactionType } from './transaction.ts';

export interface RecentTransactionItem {
  id: string;
  description: string;
  value: number;
  type: TransactionType;
  status: 'completed' | 'pending' | 'expired' | 'cancelled';
  date: string;
  category_name?: string;
  pay_method_name?: string;
}

export interface RecentTransactionsReport {
  recentTransactions: RecentTransactionItem[];
}
