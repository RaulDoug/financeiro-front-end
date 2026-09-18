import React from 'react';
import { type DashboardSummary } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Sparkles } from 'lucide-react';

interface KpiCardsProps {
  summary?: DashboardSummary | null;
  isLoading?: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary, isLoading }) => {
  const isNegativeForecast = (summary?.monthForecast ?? 0) < 0;

  const cards = [
    {
      id: 'totalBalance',
      title: 'Saldo Total',
      value: summary?.totalBalance ?? 0,
      icon: Wallet,
      color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-400',
      textColor: 'text-blue-700 dark:text-blue-400',
    },
    {
      id: 'completedIncomes',
      title: 'Entradas Realizadas',
      value: summary?.completedIncomes ?? 0,
      icon: ArrowUpCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-400',
      textColor: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      id: 'completedExpenses',
      title: 'Saídas Realizadas',
      value: summary?.completedExpenses ?? 0,
      icon: ArrowDownCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400',
      textColor: 'text-rose-700 dark:text-rose-400',
    },
    {
      id: 'monthForecast',
      title: 'Sobra Projetada',
      value: summary?.monthForecast ?? 0,
      icon: Sparkles,
      color: isNegativeForecast
        ? 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400'
        : 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400',
      textColor: isNegativeForecast
        ? 'text-rose-700 dark:text-rose-400'
        : 'text-indigo-700 dark:text-indigo-400',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="kpi-cards-loading">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-xl border border-gray-200 dark:border-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="kpi-cards">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            data-testid={`kpi-card-${card.id}`}
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider truncate" title={card.title}>
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border shrink-0 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 min-w-0">
              {/* Opção para escala variável: text-[18px] sm:text-xl lg:text-2xl com tracking-tight truncate block */}
              <span className={`text-2xl font-bold truncate block ${card.textColor}`}>
                {formatCurrency(card.value)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
