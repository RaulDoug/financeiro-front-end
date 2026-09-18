import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.ts';

interface TransactionSummaryCardsProps {
  incomings: number;
  expenses: number;
  isLoading?: boolean;
}

export const TransactionSummaryCards: React.FC<TransactionSummaryCardsProps> = ({
  incomings,
  expenses,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4"
        data-testid="transactions-summary-cards"
      >
        <div className="h-20 sm:h-24 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-xl border border-gray-200 dark:border-slate-800" />
        <div className="h-20 sm:h-24 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-xl border border-gray-200 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4"
      data-testid="transactions-summary-cards"
    >
      {/* Card de Total de Entradas */}
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between"
        data-testid="card-total-incomings"
      >
        <div className="min-w-0 pr-2">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Entradas
          </span>
          <span className="text-base sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1 block truncate">
            {formatCurrency(incomings)}
          </span>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
          <ArrowUpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Card de Total de Saídas */}
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between"
        data-testid="card-total-expenses"
      >
        <div className="min-w-0 pr-2">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Saídas
          </span>
          <span className="text-base sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5 sm:mt-1 block truncate">
            {formatCurrency(expenses)}
          </span>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shrink-0">
          <ArrowDownCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

