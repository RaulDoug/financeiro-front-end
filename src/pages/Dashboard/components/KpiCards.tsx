import React from 'react';
import { type DashboardSummary } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Sparkles } from 'lucide-react';

interface KpiCardsProps {
  summary?: DashboardSummary | null;
  isLoading?: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary, isLoading }) => {
  const cards = [
    {
      id: 'totalBalance',
      title: 'Saldo Total',
      value: summary?.totalBalance ?? 0,
      icon: Wallet,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      textColor: 'text-blue-700',
    },
    {
      id: 'completedIncomes',
      title: 'Entradas Realizadas',
      value: summary?.completedIncomes ?? 0,
      icon: ArrowUpCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      textColor: 'text-emerald-700',
    },
    {
      id: 'completedExpenses',
      title: 'Saídas Realizadas',
      value: summary?.completedExpenses ?? 0,
      icon: ArrowDownCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      textColor: 'text-rose-700',
    },
    {
      id: 'monthForecast',
      title: 'Sobra Projetada',
      value: summary?.monthForecast ?? 0,
      icon: Sparkles,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      textColor: 'text-indigo-700',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="kpi-cards-loading">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-xl border border-gray-200" />
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
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{card.title}</span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-2xl font-bold tracking-tight ${card.textColor}`}>
                {formatCurrency(card.value)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
