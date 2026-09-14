import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useDashboardSummary,
  useAccountBalances,
  useCreditCardSummary,
  useRecentTransactions,
  useOverdueAlerts,
  useIncomeVsExpense,
  useExpenseByCategory,
  DASHBOARD_QUERY_KEYS,
} from '../../hooks/useDashboardData.ts';
import { KpiCards } from './components/KpiCards.tsx';
import { AccountBalances } from './components/AccountBalances.tsx';
import { CreditCardSummary } from './components/CreditCardSummary.tsx';
import { RecentTransactions } from './components/RecentTransactions.tsx';
import { OverdueAlerts } from './components/OverdueAlerts.tsx';
import { QuickActions } from './components/QuickActions.tsx';
import { IncomeExpenseChart } from './components/IncomeExpenseChart.tsx';
import { CategoryExpenseChart } from './components/CategoryExpenseChart.tsx';
import { DashboardSkeleton } from './DashboardSkeleton.tsx';
import { RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const queryClient = useQueryClient();

  const summaryQuery = useDashboardSummary();
  const balancesQuery = useAccountBalances();
  const creditCardsQuery = useCreditCardSummary();
  const recentTransactionsQuery = useRecentTransactions(5);
  const overdueAlertsQuery = useOverdueAlerts();
  const incomeVsExpenseQuery = useIncomeVsExpense(selectedYear);
  const expenseByCategoryQuery = useExpenseByCategory();

  const isInitialLoading =
    summaryQuery.isLoading &&
    balancesQuery.isLoading &&
    creditCardsQuery.isLoading;

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.all });
  };

  if (isInitialLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6" data-testid="dashboard-page">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Visão geral da sua saúde financeira e movimentações recentes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <QuickActions />
          <button
            type="button"
            data-testid="btn-dashboard-refresh"
            onClick={handleRefresh}
            title="Atualizar dados"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPIs Principais */}
      <KpiCards
        summary={summaryQuery.data}
        isLoading={summaryQuery.isLoading}
      />

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart
            yearlyData={incomeVsExpenseQuery.data?.incomeVsExpense?.yearly}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            isLoading={incomeVsExpenseQuery.isLoading}
          />
        </div>
        <div>
          <CategoryExpenseChart
            categories={expenseByCategoryQuery.data?.expensesByCategory}
            isLoading={expenseByCategoryQuery.isLoading}
          />
        </div>
      </div>

      {/* Saldos, Cartões e Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OverdueAlerts
          alerts={overdueAlertsQuery.data?.overdueAlerts?.items}
          totalOverdue={overdueAlertsQuery.data?.overdueAlerts?.total_overdue}
          isLoading={overdueAlertsQuery.isLoading}
        />
        <AccountBalances
          accounts={balancesQuery.data?.accountBalances}
          totalBalances={balancesQuery.data?.totalBalances}
          isLoading={balancesQuery.isLoading}
        />
        <CreditCardSummary
          cards={creditCardsQuery.data?.creditCardSummary}
          isLoading={creditCardsQuery.isLoading}
        />
      </div>

      {/* Transações Recentes */}
      <RecentTransactions
        transactions={recentTransactionsQuery.data?.recentTransactions}
        isLoading={recentTransactionsQuery.isLoading}
      />
    </div>
  );
};

export default DashboardPage;
