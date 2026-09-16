import React, { useState, useMemo, useEffect } from 'react';
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
import { useTransactionModalStore } from '../../stores/transactionModal.store.ts';
import { KpiCards } from './components/KpiCards.tsx';
import { AccountBalances } from './components/AccountBalances.tsx';
import { CreditCardSummary } from './components/CreditCardSummary.tsx';
import { RecentTransactions } from './components/RecentTransactions.tsx';
import { OverdueAlerts } from './components/OverdueAlerts.tsx';
import { QuickActions } from './components/QuickActions.tsx';
import { IncomeExpenseChart } from './components/IncomeExpenseChart.tsx';
import { CategoryExpenseChart } from './components/CategoryExpenseChart.tsx';
import { DashboardSkeleton } from './DashboardSkeleton.tsx';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const selectedYear = selectedDate.getFullYear();

  const dateParams = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const pad = (n: number) => String(n).padStart(2, '0');
    const startStr = `${firstDay.getFullYear()}-${pad(firstDay.getMonth() + 1)}-${pad(firstDay.getDate())}`;
    const endStr = `${lastDay.getFullYear()}-${pad(lastDay.getMonth() + 1)}-${pad(lastDay.getDate())}`;

    return { startDate: startStr, endDate: endStr };
  }, [selectedDate]);

  const { closeModal } = useTransactionModalStore();

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

  // Suporte e documentação de integração reativa com useTransactionMutations (AC-213):
  // await createMutation.mutateAsync(data)
  // isSubmitting={createMutation.isPending}

  const summaryQuery = useDashboardSummary(dateParams);
  const balancesQuery = useAccountBalances();
  const creditCardsQuery = useCreditCardSummary(dateParams);
  const recentTransactionsQuery = useRecentTransactions(5);
  const overdueAlertsQuery = useOverdueAlerts();
  const incomeVsExpenseQuery = useIncomeVsExpense(selectedYear);
  const expenseByCategoryQuery = useExpenseByCategory(dateParams);

  const isInitialLoading =
    summaryQuery.isLoading &&
    balancesQuery.isLoading &&
    creditCardsQuery.isLoading;

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        queryClient.refetchQueries({ queryKey: DASHBOARD_QUERY_KEYS.all }),
        queryClient.refetchQueries({ queryKey: ['transactions'] }),
        queryClient.refetchQueries({ queryKey: ['bank-accounts'] }),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-testid="dashboard-page">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Visão geral da sua saúde financeira e movimentações recentes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Seletor de Mês do Dashboard */}
          <div
            className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-2xs text-sm"
            data-testid="dashboard-month-selector"
          >
            <button
              type="button"
              aria-label="Mês anterior"
              onClick={() =>
                setSelectedDate(
                  new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
                )
              }
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span
              className="px-2 font-medium text-slate-800 dark:text-slate-200 min-w-[120px] text-center capitalize text-xs sm:text-sm"
              data-testid="dashboard-selected-month"
            >
              {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              aria-label="Próximo mês"
              onClick={() =>
                setSelectedDate(
                  new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
                )
              }
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <QuickActions />
          <button
            type="button"
            data-testid="btn-dashboard-refresh"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Atualizar dados"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
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
            onYearChange={(year) => setSelectedDate(new Date(year, selectedDate.getMonth(), 1))}
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

      {/* Modal de Transação gerenciado globalmente no AppLayout (AC-221) com sincronização reativa (AC-213)
          isSubmitting={createMutation.isPending} */}
    </div>
  );
};

export default DashboardPage;
