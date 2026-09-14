import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import { ChartEmptyState } from '../../components/ChartEmptyState.tsx';
import type { ExpenseByCategoryItem } from '../../types/dashboard.ts';

interface CategoryChartProps {
  categories?: ExpenseByCategoryItem[];
  isLoading?: boolean;
}

const COLORS = [
  '#2563eb', // cobalt blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#64748b', // slate
];

export const CategoryChart: React.FC<CategoryChartProps> = ({
  categories = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="h-80 bg-slate-50 rounded-2xl animate-pulse" />;
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
      data-testid="category-donut-chart"
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between"
    >
      <div>
        <h3 className="text-base font-bold text-slate-900">Distribuição Proporcional</h3>
        <p className="text-xs text-slate-500">Participação das categorias no total de despesas.</p>
      </div>

      <div className="h-72 w-full mt-4">
        {!hasData ? (
          <ChartEmptyState message="Nenhuma despesa no período selecionado." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
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
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={40}
                formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;

