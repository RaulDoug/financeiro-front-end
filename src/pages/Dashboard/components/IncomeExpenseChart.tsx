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
import { type YearlyFlowItem } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

interface IncomeExpenseChartProps {
  yearlyData?: YearlyFlowItem[];
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

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  yearlyData = [],
  selectedYear,
  onYearChange,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-pulse h-80" />
    );
  }

  // Verificar se há dados suficientes
  const hasData =
    yearlyData.length > 0 &&
    yearlyData.some((item) => Number(item.income) > 0 || Number(item.expense) > 0);

  const formattedChartData = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const found = yearlyData.find((d) => d.month === monthNum);
    return {
      monthLabel: MONTH_NAMES[i],
      Receitas: found ? Number(found.income) : 0,
      Despesas: found ? Number(found.expense) : 0,
    };
  });

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between"
      data-testid="income-expense-chart"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Receitas vs Despesas</h3>
        </div>

        {/* Seletor de Ano */}
        <div className="flex items-center gap-2" data-testid="year-selector">
          <button
            type="button"
            aria-label="Ano anterior"
            onClick={() => onYearChange(selectedYear - 1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-800" data-testid="selected-year">
            {selectedYear}
          </span>
          <button
            type="button"
            aria-label="Próximo ano"
            onClick={() => onYearChange(selectedYear + 1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-72 w-full mt-4">
        {!hasData ? (
          <div
            className="h-full flex flex-col items-center justify-center text-center p-4"
            data-testid="chart-empty-state"
          >
            <BarChart3 className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">
              Não há dados suficientes para exibição
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `R$ ${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                formatter={(value: any, name: any) => [formatCurrency(Number(value)), String(name)]}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
              <Bar dataKey="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Despesas" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
