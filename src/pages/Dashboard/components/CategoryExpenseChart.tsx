import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { type ExpenseByCategoryItem } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryExpenseChartProps {
  categories?: ExpenseByCategoryItem[];
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#6366f1',
];

export const CategoryExpenseChart: React.FC<CategoryExpenseChartProps> = ({
  categories = [],
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm animate-pulse h-80" />
    );
  }

  const hasData =
    categories.length > 0 &&
    categories.some((item) => Number(item.total_amount) > 0);

  const chartData = categories.map((cat) => ({
    name: cat.category_name,
    value: Number(cat.total_amount),
    percentage: cat.percentage,
  }));

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between"
      data-testid="category-expense-chart"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg">
          <PieChartIcon className="w-4 h-4" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Despesas por Categoria</h3>
      </div>

      <div className="w-full mt-4">
        {!hasData ? (
          <div
            className="h-72 flex flex-col items-center justify-center text-center p-4"
            data-testid="category-empty-state"
          >
            <PieChartIcon className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">
              Não há dados suficientes para exibição
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Donut Chart Container com altura contida */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatCurrency(Number(value)),
                      String(name),
                    ]}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda Customizada HTML com truncamento seguro e acessibilidade via title (Opção 1 - AC-302 / AC-303) */}
            <div
              className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-wrap justify-center gap-x-3 gap-y-2 max-h-28 overflow-y-auto px-1"
              data-testid="category-custom-legend"
            >
              {chartData.map((cat, index) => (
                <div
                  key={cat.name || index}
                  className="flex items-center gap-1.5 min-w-0 max-w-[130px] sm:max-w-[150px]"
                  title={cat.name}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-gray-600 dark:text-slate-300 font-medium truncate">
                    {cat.name}
                  </span>
                  {cat.percentage !== undefined && (
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 shrink-0">
                      {Number(cat.percentage).toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
