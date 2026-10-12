import React, { useState } from 'react';
import { Target, TrendingDown, PiggyBank, Sparkles, Info, AlertCircle } from 'lucide-react';
import type { BudgetSummary } from '../../types/budget.ts';
import { formatCurrency } from '../../utils/formatCurrency.ts';

interface BudgetSummaryCardsProps {
  summary?: BudgetSummary | null;
  isLoading?: boolean;
  totalPending?: number;
}

export const BudgetSummaryCards: React.FC<BudgetSummaryCardsProps> = ({
  summary,
  isLoading = false,
  totalPending = 0,
}) => {
  const [savingsMode, setSavingsMode] = useState<'ideal' | 'realistic'>('realistic');

  if (isLoading) {
    return (
      <div
        data-testid="budget-summary-skeleton"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const target = summary?.total_target ?? 0;
  const used = summary?.total_used ?? 0;
  const remaining = summary?.total_remaining_budget ?? 0;
  const forecastedSavings = summary?.forecasted_savings_if_budget_kept ?? 0;
  const realisticSavings =
    summary?.projected_savings_realistic ?? forecastedSavings;
  const unbudgetedExpenses = summary?.unbudgeted_expenses ?? 0;

  const currentSavingsValue =
    savingsMode === 'realistic' ? realisticSavings : forecastedSavings;

  const cards = [
    {
      id: 'target',
      title: 'Total Orçado',
      value: target,
      icon: Target,
      color:
        'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-400',
      textColor: 'text-slate-900 dark:text-white',
      testId: 'summary-card-target',
    },
    {
      id: 'used',
      title: 'Total Gasto (Comprometido)',
      value: used,
      icon: TrendingDown,
      color:
        'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-400',
      textColor: 'text-amber-700 dark:text-amber-400',
      testId: 'summary-card-used',
      tooltip:
        'Total gasto no mês somando transações já realizadas e transações ainda pendentes.',
    },
    {
      id: 'remaining',
      title: 'Margem Restante',
      value: remaining,
      icon: PiggyBank,
      color:
        remaining >= 0
          ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-400'
          : 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400',
      textColor:
        remaining >= 0
          ? 'text-emerald-700 dark:text-emerald-400'
          : 'text-rose-700 dark:text-rose-400',
      testId: 'summary-card-remaining',
    },
    {
      id: 'forecastedSavings',
      title: 'Previsão de Sobra',
      value: currentSavingsValue,
      icon: Sparkles,
      color:
        'text-purple-600 bg-purple-50 border-purple-100 dark:bg-purple-950/40 dark:border-purple-900/50 dark:text-purple-400',
      textColor:
        currentSavingsValue >= 0
          ? 'text-purple-700 dark:text-purple-300'
          : 'text-rose-700 dark:text-rose-400',
      testId: 'summary-card-forecasted-savings',
      tooltip:
        savingsMode === 'ideal'
          ? 'Projeção calculada subtraindo o total das suas metas das receitas totais previstas no mês. Mostra quanto sobrará na sua conta caso você cumpra exatamente o orçamento planejado.'
          : 'Projeção realista considerando as metas orçadas (pagas e pendentes) mais eventuais estouros e deduzindo despesas fora do orçamento.',
      isSavingsCard: true,
    },
  ];

  return (
    <div
      data-testid="budget-summary-cards"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.id}
            data-testid={c.testId}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    {c.title}
                  </span>
                  {c.tooltip && (
                    <div className="relative group shrink-0">
                      <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 w-52 sm:w-60 p-2 text-[11px] leading-tight text-white bg-slate-900/95 dark:bg-slate-800/95 rounded-xl shadow-xl pointer-events-none border border-slate-700/50 backdrop-blur-xs">
                        {c.tooltip}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`p-1.5 sm:p-2 rounded-xl border shrink-0 ${c.color}`}
                >
                  <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
              </div>

              {c.isSavingsCard && (
                <div
                  data-testid="budget-savings-mode-switch"
                  className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold mb-2.5 w-fit"
                >
                  <button
                    type="button"
                    data-testid="savings-mode-ideal"
                    onClick={() => setSavingsMode('ideal')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      savingsMode === 'ideal'
                        ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                    }`}
                  >
                    Plano Ideal
                  </button>
                  <button
                    type="button"
                    data-testid="savings-mode-realistic"
                    onClick={() => setSavingsMode('realistic')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      savingsMode === 'realistic'
                        ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                    }`}
                  >
                    Projeção Realista
                  </button>
                </div>
              )}
            </div>

            <div>
              <span
                className={`text-base sm:text-xl font-bold tracking-tight block ${c.textColor}`}
              >
                {formatCurrency(c.value)}
              </span>

              {c.id === 'used' && totalPending > 0 && (
                <p
                  data-testid="summary-used-pending-warning"
                  className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium leading-tight"
                >
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>
                    Inclui {formatCurrency(totalPending)} ainda pendente
                  </span>
                </p>
              )}

              {c.isSavingsCard &&
                savingsMode === 'realistic' &&
                unbudgetedExpenses > 0 && (
                  <p
                    data-testid="unbudgeted-expenses-warning"
                    className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium leading-tight"
                  >
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>
                      Inclui {formatCurrency(unbudgetedExpenses)} em despesas fora do orçamento
                    </span>
                  </p>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
