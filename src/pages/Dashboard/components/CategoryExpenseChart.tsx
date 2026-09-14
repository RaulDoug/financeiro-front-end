import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-pulse h-80" />
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
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between"
      data-testid="category-expense-chart"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
          <PieChartIcon className="w-4 h-4" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Despesas por Categoria</h3>
      </div>

      <div className="h-72 w-full mt-4">
        {!hasData ? (
          <div
            className="h-full flex flex-col items-center justify-center text-center p-4"
            data-testid="category-empty-state"
          >
            <PieChartIcon className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">
              Não há dados suficientes para exibição
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
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
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
