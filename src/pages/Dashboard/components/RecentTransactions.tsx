import React from 'react';
import { Link } from 'react-router-dom';
import { type RecentTransactionItem } from '../../../types/dashboard.ts';
import { type Transaction } from '../../../types/transaction.ts';
import { useTransactionDetailsModalStore } from '../../../stores/transactionDetailsModal.store.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { formatDate, resolveTransactionDate } from '../../../utils/formatDate.ts';
import { History, ArrowRight, Tag, ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions?: RecentTransactionItem[];
  isLoading?: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions = [],
  isLoading,
}) => {
  const openModal = useTransactionDetailsModalStore((state) => state.openModal);

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

  const handleSelect = (tx: RecentTransactionItem) => {
    const fullTx: Transaction = {
      id: tx.id,
      description: tx.description,
      value: String(tx.value),
      type: tx.type,
      status: tx.status,
      due_date: tx.date || '',
      payment_date: tx.status === 'completed' ? tx.date : null,
      purchase_date: tx.date,
      category_name: tx.category_name || null,
      pay_method_name: tx.pay_method_name || '',
      bank_account_name: '',
      counterparty_name: null,
      creator_user_name: '',
      transfers_id: null,
      invoice_id: null,
      current_installment: null,
      created_at: '',
    };
    openModal(fullTx);
  };

  const renderStatusBadge = (status: string, dateStr: string) => {
    const isOverdue =
      (status === 'pending' || status === 'expired') &&
      dateStr &&
      new Date(dateStr) < new Date();

    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Atrasada
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Concluída
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pendente
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Cancelada
      </span>
    );
  };

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm"
      data-testid="recent-transactions"
    >
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

      {sorted.length === 0 ? (
        <div className="py-8 text-center" data-testid="empty-recent-transactions">
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Nenhuma transação recente</p>
        </div>
      ) : (
        <>
          {/* Tabela Desktop similar à tela de transações */}
          <div className="hidden md:block mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="px-3 py-2.5">Descrição</th>
                  <th className="px-3 py-2.5">Data</th>
                  <th className="px-3 py-2.5">Categoria</th>
                  <th className="px-3 py-2.5 text-right">Valor</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {sorted.map((tx) => {
                  const isIncome = tx.type === 'incomings' || tx.type === 'transfer_in';
                  const isTransfer = tx.type === 'transfers';
                  const displayDate = resolveTransactionDate(tx);

                  return (
                    <tr
                      key={tx.id}
                      data-testid={`recent-tx-${tx.id}`}
                      onClick={() => handleSelect(tx)}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                    >
                      <td className="px-3 py-3 font-medium text-gray-900 dark:text-slate-100 max-w-[220px]">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isIncome
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                                : isTransfer
                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : isTransfer ? (
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {tx.description}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3 text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(displayDate)}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap">
                        {tx.category_name ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {tx.category_name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <span
                          className={`font-semibold text-sm ${
                            isIncome
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isTransfer
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isIncome ? '+ ' : isTransfer ? '' : '- '}
                          {formatCurrency(tx.value)}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {renderStatusBadge(tx.status, displayDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Lista Mobile com cards compactos */}
          <div className="md:hidden mt-3 divide-y divide-gray-100 dark:divide-slate-800">
            {sorted.map((tx) => {
              const isIncome = tx.type === 'incomings' || tx.type === 'transfer_in';
              const isTransfer = tx.type === 'transfers';
              const displayDate = resolveTransactionDate(tx);

              return (
                <div
                  key={tx.id}
                  data-testid={`recent-tx-${tx.id}`}
                  onClick={() => handleSelect(tx)}
                  className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/60 px-2 rounded-xl transition cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isIncome
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          : isTransfer
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : isTransfer ? (
                        <ArrowLeftRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-gray-900 dark:text-slate-200 text-sm truncate">
                        {tx.description}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          {formatDate(displayDate)}
                        </span>
                        {tx.category_name && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-md truncate max-w-[110px]">
                            {tx.category_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`font-semibold text-sm ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isTransfer
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+ ' : isTransfer ? '' : '- '}
                      {formatCurrency(tx.value)}
                    </span>
                    {renderStatusBadge(tx.status, displayDate)}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RecentTransactions;
