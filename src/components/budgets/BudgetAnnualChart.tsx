import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { BudgetAnnualResponse } from '../../types/budget.ts';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import { ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';

interface BudgetAnnualChartProps {
  annualData?: BudgetAnnualResponse | null;
  selectedYear: number;
  onYearChange: (year: number) => void;
  isLoading?: boolean;
}

const MONTH_NAMES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export const BudgetAnnualChart: React.FC<BudgetAnnualChartProps> = ({
  annualData,
  selectedYear,
  onYearChange,
  isLoading = false,
}) => {
  const chartData = MONTH_NAMES.map((name, index) => {
    const monthNum = index + 1;
    const monthSummary = annualData?.months?.find((m) => m.month === monthNum);
    return {
      name,
      month: monthNum,
      target: Number(monthSummary?.total_target) || 0,
      used: Number(monthSummary?.total_used) || 0,
    };
  });

  const totalAnnualTarget = chartData.reduce((acc, curr) => acc + curr.target, 0);
  const totalAnnualUsed = chartData.reduce((acc, curr) => acc + curr.used, 0);
  const totalAnnualRemaining = totalAnnualTarget - totalAnnualUsed;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const targetVal = payload.find((p: any) => p.dataKey === 'target')?.value ?? 0;
      const usedVal = payload.find((p: any) => p.dataKey === 'used')?.value ?? 0;
      const diff = targetVal - usedVal;

      return (
        <div className="bg-white/95 dark:bg-slate-900/95 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xs text-xs space-y-1 min-w-40">
          <p className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
            {label} de {selectedYear}
          </p>
          <div className="flex justify-between items-center text-indigo-600 dark:text-indigo-400">
            <span>Meta Planejada:</span>
            <span className="font-semibold">{formatCurrency(targetVal)}</span>
          </div>
          <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
            <span>Comprometido:</span>
            <span className="font-semibold">{formatCurrency(usedVal)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Margem:</span>
            <span
              className={`font-semibold ${
                diff >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(diff)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      data-testid="budget-annual-chart-container"
      className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-6"
    >
      {/* Header com Navegação de Ano */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Visão Anual Panorâmica
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comparativo mês a mês do teto orçado versus gastos comprometidos (pagos + pendentes).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => onYearChange(selectedYear - 1)}
            aria-label="Ano anterior"
            className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-sm px-2 text-slate-800 dark:text-slate-100">
            {selectedYear}
          </span>
          <button
            type="button"
            onClick={() => onYearChange(selectedYear + 1)}
            aria-label="Próximo ano"
            className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-72 sm:h-80 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center animate-pulse bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-xs text-slate-400">Carregando comparativo anual...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
                opacity={0.15}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(val) =>
                  val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                formatter={(value) =>
                  value === 'target' ? 'Teto Orçado' : 'Comprometido'
                }
              />
              <Bar
                dataKey="target"
                name="target"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="used"
                name="used"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Resumo do Ano */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            Total Orçado em {selectedYear}
          </span>
          <span className="text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(totalAnnualTarget)}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            Total Comprometido em {selectedYear}
          </span>
          <span className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400">
            {formatCurrency(totalAnnualUsed)}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            Margem Acumulada no Ano
          </span>
          <span
            className={`text-sm sm:text-base font-bold ${
              totalAnnualRemaining >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatCurrency(totalAnnualRemaining)}
          </span>
        </div>
      </div>
    </div>
  );
};
