import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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
import { formatCurrency } from '../../utils/formatCurrency.ts';
import { ChartEmptyState } from '../../components/ChartEmptyState.tsx';
import type { YearlyFlowItem } from '../../types/dashboard.ts';

interface AnnualChartProps {
  yearlyData?: YearlyFlowItem[];
  isLoading?: boolean;
}

const MONTH_NAMES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export const AnnualChart: React.FC<AnnualChartProps> = ({
  yearlyData = [],
  isLoading = false,
}) => {
  const [zoom, setZoom] = useState(1);
  if (isLoading) {
    return <div className="h-80 bg-slate-50 rounded-2xl animate-pulse" />;
  }

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
      data-testid="annual-dre-chart"
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Evolução Mensal: Receitas vs Despesas</h3>
          <p className="text-xs text-slate-500">
            Comparação mês a mês das entradas e saídas consolidadas do ano.
          </p>
        </div>

        {/* Controles de Zoom */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.5).toFixed(1)))}
            data-testid="btn-chart-zoom-in"
            title="Aproximar (Zoom In)"
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
            data-testid="btn-chart-zoom-out"
            title="Afastar (Zoom Out)"
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {zoom > 1 && (
            <button
              type="button"
              onClick={() => setZoom(1)}
              data-testid="btn-chart-zoom-reset"
              title="Restaurar visualização"
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer text-[10px] font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>100%</span>
            </button>
          )}
        </div>
      </div>

      <div className="h-80 w-full overflow-x-auto" data-testid="chart-scroll-container">
        {!hasData ? (
          <ChartEmptyState message="Nenhuma movimentação registrada no ano selecionado." />
        ) : (
          <div style={{ minWidth: zoom > 1 ? `${zoom * 650}px` : '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                barGap={4}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `R$ ${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    formatCurrency(Number(value)),
                    String(name),
                  ]}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                <Bar
                  dataKey="Receitas"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  stroke="none"
                  activeBar={{ fillOpacity: 0.85, stroke: 'none' }}
                />
                <Bar
                  dataKey="Despesas"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  stroke="none"
                  activeBar={{ fillOpacity: 0.85, stroke: 'none' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnualChart;

