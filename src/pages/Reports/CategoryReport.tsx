import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';
import { useCategoryReport } from '../../hooks/useReports.ts';
import { CategoryChart } from './CategoryChart.tsx';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import { useFilterStore } from '../../stores/filter.store.ts';
import type { ExpenseByCategoryItem } from '../../types/dashboard.ts';

export const CategoryReport: React.FC = () => {
  const navigate = useNavigate();
  const setTransactionFilters = useFilterStore((state) => state.setTransactionFilters);

  // Padrão: primeiro ao último dia do mês corrente
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const { data, isLoading } = useCategoryReport(startDate, endDate);

  const categories = data?.expensesByCategory || [];

  const handleCategoryClick = (cat: ExpenseByCategoryItem) => {
    if (!cat.category_id) return;

    setTransactionFilters((prev) => ({
      ...prev,
      category_id: [cat.category_id],
      due_date_from: startDate,
      due_date_to: endDate,
      page: 1,
    }));

    navigate(
      `/transactions?category_id=${encodeURIComponent(cat.category_id)}&due_date_from=${encodeURIComponent(startDate)}&due_date_to=${encodeURIComponent(endDate)}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Filter: Date Range (AC-100) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Despesas por Categoria</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analise para onde seu dinheiro foi direcionado no período selecionado.
            </p>
          </div>
        </div>

        {/* Filtro de Período para Categorias (AC-100) */}
        <div
          data-testid="category-date-filter"
          className="flex items-center gap-2 self-start sm:self-auto flex-wrap"
        >
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">De:</span>
            <input
              type="date"
              value={startDate}
              aria-label="Data de início"
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs font-semibold text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Até:</span>
            <input
              type="date"
              value={endDate}
              aria-label="Data de fim"
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs font-semibold text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid: Gráfico de Pizza/Rosca (AC-101) e Tabela Ranqueada (AC-099) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gráfico de Rosca (AC-101) */}
        <div className="lg:col-span-5">
          <CategoryChart
            categories={categories}
            isLoading={isLoading}
            onSelectCategory={handleCategoryClick}
          />
        </div>

        {/* Tabela de Categorias com Posição, Nome, Total e Porcentagem (AC-099) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Detalhamento por Categoria</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranking de gastos do maior para o menor volume acumulado. Clique em uma categoria para ver os lançamentos.
            </p>
          </div>

          {/* Layout Mobile: Cards compactos sem rolagem lateral (AC-153) */}
          <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800" data-testid="category-mobile-list">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Carregando dados por categoria...
              </div>
            ) : categories.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Nenhuma despesa encontrada para o período selecionado.
              </div>
            ) : (
              categories.map((cat, index) => {
                const rank = index + 1;
                const percent = Number(cat.percentage || 0).toFixed(1);

                return (
                  <div
                    key={cat.category_id || index}
                    onClick={() => handleCategoryClick(cat)}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer active:scale-[0.99]"
                    data-testid={`category-mobile-card-${rank}`}
                    title={`Filtrar transações de ${cat.category_name}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCategoryClick(cat);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {rank}
                      </span>
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {cat.category_name}
                      </span>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-rose-600 dark:text-rose-400 whitespace-nowrap">
                        {formatCurrency(Number(cat.total_amount))}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Layout Desktop: Tabela clássica */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-5">Posição</th>
                  <th className="py-3 px-5">Categoria</th>
                  <th className="py-3 px-5">Total Gasto</th>
                  <th className="py-3 px-5 text-right">Participação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      Carregando dados por categoria...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      Nenhuma despesa encontrada para o período selecionado.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat, index) => {
                    const rank = index + 1;
                    const percent = Number(cat.percentage || 0).toFixed(1);

                    return (
                      <tr
                        key={cat.category_id || index}
                        onClick={() => handleCategoryClick(cat)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        data-testid={`category-row-${rank}`}
                        title={`Filtrar transações de ${cat.category_name}`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCategoryClick(cat);
                          }
                        }}
                      >
                        <td className="py-3.5 px-5 font-bold text-slate-500 dark:text-slate-400">
                          #{rank}
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                          {cat.category_name}
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-rose-600 dark:text-rose-400">
                          {formatCurrency(Number(cat.total_amount))}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                            {percent}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryReport;
