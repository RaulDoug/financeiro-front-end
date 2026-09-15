import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useAnnualReport } from '../../hooks/useReports.ts';
import { AnnualChart } from './AnnualChart.tsx';
import { formatCurrency } from '../../utils/formatCurrency.ts';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const AnnualReport: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data, isLoading } = useAnnualReport(selectedYear);

  const yearlyData = data?.incomeVsExpense?.yearly || [];

  // Calcular estatísticas dos 12 meses
  const monthlyRows = Array.from({ length: 12 }, (_, index) => {
    const monthNum = index + 1;
    const found = yearlyData.find((item) => item.month === monthNum);
    const income = found ? Number(found.income) : 0;
    const expense = found ? Number(found.expense) : 0;
    const balance = found ? Number(found.balance) : income - expense;

    let savingsRate = 0;
    if (income > 0) {
      savingsRate = ((income - expense) / income) * 100;
    } else if (expense > 0) {
      savingsRate = -100;
    }

    return {
      monthNumber: monthNum,
      monthName: MONTHS[index],
      income,
      expense,
      balance,
      savingsRate,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Controls: Year Selector (AC-097) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Demonstrativo do Exercício (DRE Anual)</h3>
            <p className="text-xs text-slate-500">Fluxo de caixa consolidado mês a mês</p>
          </div>
        </div>

        {/* Seletor de Ano */}
        <div
          data-testid="annual-year-selector"
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 self-start sm:self-auto"
        >
          <button
            type="button"
            aria-label="Ano anterior"
            onClick={() => setSelectedYear((y) => y - 1)}
            className="p-1.5 hover:bg-white rounded-lg text-slate-600 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-slate-900 px-3 min-w-[60px] text-center">
            {selectedYear}
          </span>
          <button
            type="button"
            aria-label="Próximo ano"
            onClick={() => setSelectedYear((y) => y + 1)}
            className="p-1.5 hover:bg-white rounded-lg text-slate-600 cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gráfico de Barras DRE (AC-098) */}
      <AnnualChart yearlyData={yearlyData} isLoading={isLoading} />

      {/* Tabela Resumo Mensal DRE com os 12 meses (AC-096) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Detalhamento Mensal DRE</h3>
          <p className="text-xs text-slate-500">
            Entradas, despesas, resultado líquido e taxa de poupança/déficit por mês.
          </p>
        </div>

        {/* Layout Mobile: Cards em Grid multi-linhas sem scroll lateral (AC-152) */}
        <div className="block md:hidden divide-y divide-slate-100" data-testid="dre-mobile-grid">
          {monthlyRows.map((row) => {
            const isPositive = row.balance >= 0;
            const formattedRate = `${Math.abs(row.savingsRate).toFixed(1)}%`;

            return (
              <div
                key={row.monthNumber}
                className="p-4 space-y-3"
                data-testid={`dre-mobile-card-${row.monthNumber}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{row.monthName}</span>
                  {isPositive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <TrendingUp className="w-3 h-3" />
                      Poupança: {formattedRate}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                      <TrendingDown className="w-3 h-3" />
                      Déficit: -{formattedRate}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Receitas</span>
                    <span className="font-semibold text-emerald-600 truncate block">
                      {formatCurrency(row.income)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Despesas</span>
                    <span className="font-semibold text-rose-600 truncate block">
                      {formatCurrency(row.expense)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Resultado</span>
                    <span className={`font-bold truncate block ${isPositive ? 'text-slate-900' : 'text-rose-600'}`}>
                      {formatCurrency(row.balance)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layout Desktop: Tabela clássica */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500">
                <th className="py-3 px-5">Mês</th>
                <th className="py-3 px-5">Receitas</th>
                <th className="py-3 px-5">Despesas</th>
                <th className="py-3 px-5">Saldo Resultante</th>
                <th className="py-3 px-5 text-right">Taxa de Economia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {monthlyRows.map((row) => {
                const isPositive = row.balance >= 0;
                const formattedRate = `${Math.abs(row.savingsRate).toFixed(1)}%`;

                return (
                  <tr
                    key={row.monthNumber}
                    className="hover:bg-slate-50/50 transition-colors"
                    data-testid={`dre-row-${row.monthNumber}`}
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {row.monthName}
                    </td>
                    <td className="py-3.5 px-5 text-emerald-600 font-medium">
                      {formatCurrency(row.income)}
                    </td>
                    <td className="py-3.5 px-5 text-rose-600 font-medium">
                      {formatCurrency(row.expense)}
                    </td>
                    <td
                      className={`py-3.5 px-5 font-bold ${
                        isPositive ? 'text-slate-900' : 'text-rose-600'
                      }`}
                    >
                      {formatCurrency(row.balance)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {/* AC-096: Badge verde "Poupança: X%" quando positivo ou vermelho "Déficit: -X%" quando negativo */}
                      {isPositive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <TrendingUp className="w-3 h-3" />
                          Poupança: {formattedRate}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                          <TrendingDown className="w-3 h-3" />
                          Déficit: -{formattedRate}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnnualReport;

