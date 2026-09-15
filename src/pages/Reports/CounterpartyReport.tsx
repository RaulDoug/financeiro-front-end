import React, { useState } from 'react';
import { Calendar, Users2, ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react';
import { useCounterpartyReport } from '../../hooks/useReports.ts';
import { formatCurrency } from '../../utils/formatCurrency.ts';

export const CounterpartyReport: React.FC = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const { data: counterparties = [], isLoading } = useCounterpartyReport(startDate, endDate);

  return (
    <div className="space-y-6">
      {/* Top Filter: Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Relatório por Contraparte</h3>
            <p className="text-xs text-slate-500">
              Consolidação analítica de valores movimentados por pessoas ou empresas.
            </p>
          </div>
        </div>

        {/* Date Filter */}
        <div
          data-testid="counterparty-date-filter"
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

      {/* Tabela de Contrapartes (AC-103, AC-104) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Ranking por Volume Transacionado</h3>
          <p className="text-xs text-slate-500">
            Contrapartes ordenadas pelo maior volume total movimentado no período.
          </p>
        </div>

        {/* Layout Mobile: Cards compactos sem rolagem lateral (AC-153) */}
        <div className="block md:hidden divide-y divide-slate-100" data-testid="counterparty-mobile-list">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Consolidando transações por contraparte...
            </div>
          ) : counterparties.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Nenhuma contraparte vinculada a transações no período selecionado.
            </div>
          ) : (
            counterparties.map((cp, index) => {
              const rank = index + 1;
              const percent = cp.percentage.toFixed(1);

              return (
                <div
                  key={cp.name}
                  className="p-4 space-y-2.5 hover:bg-slate-50/60 transition-colors"
                  data-testid={`counterparty-mobile-card-${rank}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                        {rank}
                      </span>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate block">
                          {cp.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {cp.transactionCount} {cp.transactionCount === 1 ? 'lançamento' : 'lançamentos'}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {cp.type === 'payer' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <ArrowDownLeft className="w-3 h-3" />
                          Receita
                        </span>
                      ) : cp.type === 'payee' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                          <ArrowUpRight className="w-3 h-3" />
                          Despesa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          <Scale className="w-3 h-3" />
                          Misto
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Volume Total</span>
                      <span className="font-bold text-slate-900 block">
                        {formatCurrency(cp.totalAmount)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Participação</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                        {percent}%
                      </span>
                    </div>
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
                <th className="py-3 px-5">Contraparte</th>
                <th className="py-3 px-5">Tipo Predominante</th>
                <th className="py-3 px-5">Receitas</th>
                <th className="py-3 px-5">Despesas</th>
                <th className="py-3 px-5">Volume Total</th>
                <th className="py-3 px-5 text-right">Participação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Consolidando transações por contraparte...
                  </td>
                </tr>
              ) : counterparties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhuma contraparte vinculada a transações no período selecionado.
                  </td>
                </tr>
              ) : (
                counterparties.map((cp, index) => {
                  const rank = index + 1;
                  const percent = cp.percentage.toFixed(1);

                  return (
                    <tr
                      key={cp.name}
                      className="hover:bg-slate-50/50 transition-colors"
                      data-testid={`counterparty-row-${rank}`}
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-500">#{rank}</td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{cp.name}</div>
                        <span className="text-xs text-slate-400">
                          {cp.transactionCount} {cp.transactionCount === 1 ? 'lançamento' : 'lançamentos'}
                        </span>
                      </td>
                      {/* AC-104: Diferenciação de Despesas e Receitas por Contraparte */}
                      <td className="py-3.5 px-5">
                        {cp.type === 'payer' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <ArrowDownLeft className="w-3 h-3" />
                            Receita (Pagador)
                          </span>
                        ) : cp.type === 'payee' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                            <ArrowUpRight className="w-3 h-3" />
                            Despesa (Recebedor)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            <Scale className="w-3 h-3" />
                            Misto
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-emerald-600">
                        {formatCurrency(cp.totalIncome)}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-rose-600">
                        {formatCurrency(cp.totalExpense)}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {formatCurrency(cp.totalAmount)}
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
  );
};

export default CounterpartyReport;

