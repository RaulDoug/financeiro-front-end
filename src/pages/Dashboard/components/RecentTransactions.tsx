import React from 'react';
import { Link } from 'react-router-dom';
import { type RecentTransactionItem } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { formatDate, resolveTransactionDate } from '../../../utils/formatDate.ts';
import { History, ArrowRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions?: RecentTransactionItem[];
  isLoading?: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions = [],
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm animate-pulse h-72" />
    );
  }

  // Ordenar e limitar em no máximo 5 itens caso a API retorne mais
  const sorted = [...transactions]
    .sort((a, b) => {
      const dateA = new Date(resolveTransactionDate(a)).getTime() || 0;
      const dateB = new Date(resolveTransactionDate(b)).getTime() || 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm" data-testid="recent-transactions">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg">
            <History className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Transações Recentes</h3>
        </div>
        <Link
          to="/transacoes"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition"
        >
          Ver todas <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-gray-100 dark:divide-slate-800">
        {sorted.length === 0 ? (
          <div className="py-8 text-center" data-testid="empty-recent-transactions">
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Nenhuma transação recente</p>
          </div>
        ) : (
          sorted.map((tx) => {
            const isIncome = tx.type === 'incomings';
            const displayDate = resolveTransactionDate(tx);

            return (
              <div
                key={tx.id}
                data-testid={`recent-tx-${tx.id}`}
                className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/60 px-2 rounded transition"
              >
                <div className="flex flex-col min-w-0 pr-3">
                  <span className="font-medium text-gray-900 dark:text-slate-200 text-sm truncate">{tx.description}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-slate-400">{formatDate(displayDate)}</span>
                    {tx.category_name && (
                      <span className="text-[11px] px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded">
                        {tx.category_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-semibold text-sm ${
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isIncome ? '+ ' : '- '}
                    {formatCurrency(tx.value)}
                  </span>
                  <div className="text-[11px] text-gray-500 capitalize">{tx.status}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
