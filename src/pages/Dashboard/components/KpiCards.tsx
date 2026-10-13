import React, { useState } from 'react';
import { type DashboardSummary } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Sparkles, Info } from 'lucide-react';

const STORAGE_KEY = 'app:forecast_include_balance';

interface KpiCardsProps {
  summary?: DashboardSummary | null;
  isLoading?: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary, isLoading }) => {
  const [includeBalance, setIncludeBalance] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleToggle = () => {
    setIncludeBalance((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignora erros de acesso ao storage
      }
      return next;
    });
  };

  const defaultForecast = summary?.projected_balance ?? summary?.monthForecast ?? 0;
  const finalForecast = summary?.projected_final_balance ?? summary?.monthForecastFinal ?? defaultForecast;
  const currentForecast = includeBalance ? finalForecast : defaultForecast;
  const isNegativeForecast = currentForecast < 0;

  const forecastTooltip = includeBalance
    ? 'Saldo Final Projetado (com saldo em conta): Quanto sobrará na conta bancária ao final do mês, calculando Saldo Atual em Conta + Receitas Pendentes - Restante Previsto a Gastar do orçamento e despesas.'
    : 'Sobra do Mês (sem saldo em conta): Fluxo puro do mês calculando Receitas Totais - Despesas Totais Previstas, considerando metas por categoria e despesas não orçadas.';

  const forecastLegend = includeBalance
    ? 'Saldo em conta + receitas pendentes menos restante previsto a gastar.'
    : 'Fluxo puro: receitas totais menos despesas previstas no orçamento.';

  const cards = [
    {
      id: 'totalBalance',
      title: 'Saldo Total',
      value: summary?.totalBalance ?? 0,
      icon: Wallet,
      color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-400',
      textColor: 'text-blue-700 dark:text-blue-400',
      isForecast: false,
    },
    {
      id: 'completedIncomes',
      title: 'Entradas Realizadas',
      value: summary?.completedIncomes ?? 0,
      icon: ArrowUpCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-400',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      isForecast: false,
    },
    {
      id: 'completedExpenses',
      title: 'Saídas Realizadas',
      value: summary?.completedExpenses ?? 0,
      icon: ArrowDownCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400',
      textColor: 'text-rose-700 dark:text-rose-400',
      isForecast: false,
    },
    {
      id: 'monthForecast',
      title: includeBalance ? 'Saldo Final Projetado' : 'Sobra Projetada',
      value: currentForecast,
      icon: Sparkles,
      color: isNegativeForecast
        ? 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400'
        : 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-400',
      textColor: isNegativeForecast
        ? 'text-rose-700 dark:text-rose-400'
        : 'text-emerald-700 dark:text-emerald-400',
      isForecast: true,
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
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider truncate" title={card.title}>
                    {card.title}
                  </span>
                  {card.isForecast && (
                    <div className="relative group shrink-0">
                      <button
                        type="button"
                        aria-label="Explicação da previsão"
                        className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 w-60 sm:w-64 p-2.5 text-[11px] leading-relaxed text-white bg-slate-900/95 dark:bg-slate-800/95 rounded-xl shadow-xl pointer-events-none border border-slate-700/50 backdrop-blur-xs font-normal normal-case">
                        {forecastTooltip}
                      </div>
                    </div>
                  )}
                </div>
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

            {card.isForecast && (
              <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="toggle-forecast-balance"
                    className="text-[11px] font-medium text-gray-500 dark:text-slate-400 cursor-pointer select-none truncate"
                    title="Alternar entre sobra operacional do mês e saldo final projetado em conta"
                  >
                    Considerar saldo em conta
                  </label>
                  <button
                    type="button"
                    id="toggle-forecast-balance"
                    role="switch"
                    aria-checked={includeBalance}
                    data-testid="toggle-forecast-balance"
                    onClick={handleToggle}
                    title="Considerar saldo em conta"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      includeBalance ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        includeBalance ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Alternância em Tabs Rápidas */}
                <div
                  data-testid="forecast-mode-selector"
                  className="mt-2.5 flex items-center bg-gray-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-[10px] font-medium"
                >
                  <button
                    type="button"
                    data-testid="forecast-mode-pure"
                    onClick={() => {
                      if (includeBalance) handleToggle();
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-md text-center transition-all cursor-pointer truncate ${
                      !includeBalance
                        ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-semibold shadow-xs'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                    }`}
                    title="Previsão de Sobra do Mês (Sem saldo em conta)"
                  >
                    Sobra do Mês
                  </button>
                  <button
                    type="button"
                    data-testid="forecast-mode-final"
                    onClick={() => {
                      if (!includeBalance) handleToggle();
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-md text-center transition-all cursor-pointer truncate ${
                      includeBalance
                        ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-semibold shadow-xs'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                    }`}
                    title="Saldo Projetado em Conta (Com saldo em conta)"
                  >
                    Saldo em Conta
                  </button>
                </div>

                {/* Legenda explicativa contextual */}
                <p
                  data-testid="forecast-legend"
                  className="mt-2 text-[10px] text-gray-500 dark:text-slate-400 leading-tight"
                >
                  {forecastLegend}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
