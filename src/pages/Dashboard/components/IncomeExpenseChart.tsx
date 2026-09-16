import React, { useRef, useEffect } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1 a 12
  const isCurrentYear = selectedYear === currentYear;

  // Centralização automática no mês vigente quando for o ano corrente
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoading) return;

    const timer = setTimeout(() => {
      if (!container) return;
      if (isCurrentYear) {
        const monthIndex = currentMonth - 1; // 0 a 11
        const totalMonths = 12;
        const monthWidth = container.scrollWidth / totalMonths;
        const monthCenter = monthWidth * monthIndex + monthWidth / 2;
        const targetScrollLeft = monthCenter - container.clientWidth / 2;

        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth',
        });
      } else {
        container.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [selectedYear, isCurrentYear, currentMonth, isLoading]);

  useEffect(() => {
    const handleResize = () => {
      const container = scrollContainerRef.current;
      if (!container || !isCurrentYear) return;
      const monthIndex = currentMonth - 1;
      const monthWidth = container.scrollWidth / 12;
      const monthCenter = monthWidth * monthIndex + monthWidth / 2;
      const targetScrollLeft = monthCenter - container.clientWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'auto',
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCurrentYear, currentMonth]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm animate-pulse h-80" />
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
      className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between"
      data-testid="income-expense-chart"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Receitas vs Despesas</h3>
        </div>

        {/* Seletor de Ano */}
        <div className="flex items-center gap-2" data-testid="year-selector">
          <button
            type="button"
            aria-label="Ano anterior"
            onClick={() => onYearChange(selectedYear - 1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-600 dark:text-slate-400 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-800 dark:text-slate-200" data-testid="selected-year">
            {selectedYear}
          </span>
          <button
            type="button"
            aria-label="Próximo ano"
            onClick={() => onYearChange(selectedYear + 1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-600 dark:text-slate-400 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="h-72 w-full mt-4 overflow-x-auto pb-2 scrollbar-thin outline-none focus:outline-none"
        data-testid="income-expense-chart-scroll-container"
      >
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
          <div className="h-full min-w-[540px] sm:min-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedChartData}
                barGap={3}
                barCategoryGap="18%"
                margin={{ top: 10, right: 10, left: -20, bottom: 6 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="monthLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={(props: any) => {
                    const { x, y, payload } = props;
                    const isCurrent = isCurrentYear && payload?.value === MONTH_NAMES[currentMonth - 1];
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={0}
                          dy={12}
                          textAnchor="middle"
                          fill={isCurrent ? '#059669' : '#64748b'}
                          fontWeight={isCurrent ? 700 : 400}
                          fontSize={isCurrent ? 13 : 12}
                          data-testid={isCurrent ? 'current-month-tick' : undefined}
                        >
                          {payload?.value}
                        </text>
                        {isCurrent && (
                          <circle
                            cx={0}
                            cy={20}
                            r={2.5}
                            fill="#10b981"
                            data-testid="current-month-indicator"
                          />
                        )}
                      </g>
                    );
                  }}
                />
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
