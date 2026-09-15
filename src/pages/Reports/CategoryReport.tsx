import React, { useState } from 'react';
import { Calendar, Tag } from 'lucide-react';
import { useCategoryReport } from '../../hooks/useReports.ts';
import { CategoryChart } from './CategoryChart.tsx';
import { formatCurrency } from '../../utils/formatCurrency.ts';

export const CategoryReport: React.FC = () => {
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

  return (
    <div className="space-y-6">
      {/* Top Filter: Date Range (AC-100) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Despesas por Categoria</h3>
            <p className="text-xs text-slate-500">
              Analise para onde seu dinheiro foi direcionado no período selecionado.
            </p>
          </div>
        </div>

        {/* Filtro de Período para Categorias (AC-100) */}
        <div
          data-testid="category-date-filter"
          className="flex items-center gap-2 self-start sm:self-auto flex-wrap"
        >
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">De:</span>
            <input
              type="date"
              value={startDate}
              aria-label="Data de início"
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Até:</span>
            <input
              type="date"
              value={endDate}
              aria-label="Data de fim"
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid: Gráfico de Pizza/Rosca (AC-101) e Tabela Ranqueada (AC-099) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gráfico de Rosca (AC-101) */}
        <div className="lg:col-span-5">
          <CategoryChart categories={categories} isLoading={isLoading} />
        </div>

        {/* Tabela de Categorias com Posição, Nome, Total e Porcentagem (AC-099) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Detalhamento por Categoria</h3>
            <p className="text-xs text-slate-500">
              Ranking de gastos do maior para o menor volume acumulado.
            </p>
          </div>

          {/* Layout Mobile: Cards compactos sem rolagem lateral (AC-153) */}
          <div className="block md:hidden divide-y divide-slate-100" data-testid="category-mobile-list">
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
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                    data-testid={`category-mobile-card-${rank}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                        {rank}
                      </span>
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                        {cat.category_name}
                      </span>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-rose-600 whitespace-nowrap">
                        {formatCurrency(Number(cat.total_amount))}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
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
                <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500">
                  <th className="py-3 px-5">Posição</th>
                  <th className="py-3 px-5">Categoria</th>
                  <th className="py-3 px-5">Total Gasto</th>
                  <th className="py-3 px-5 text-right">Participação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
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
                        className="hover:bg-slate-50/50 transition-colors"
                        data-testid={`category-row-${rank}`}
                      >
                        <td className="py-3.5 px-5 font-bold text-slate-500">
                          #{rank}
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-900">
                          {cat.category_name}
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-rose-600">
                          {formatCurrency(Number(cat.total_amount))}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
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

