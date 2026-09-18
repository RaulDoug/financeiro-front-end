import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { transactionService } from '../../services/transactionService.ts';
import { useTransactionDetailsModalStore } from '../../stores/transactionDetailsModal.store.ts';
import { TransactionMobileList } from './TransactionMobileList.tsx';
import { formatInstallment } from '../../utils/formatInstallment.ts';
import type { Transaction } from '../../types/transaction.ts';

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export const TransactionTable: React.FC<Props> = ({
  transactions,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onEdit,
  onDelete,
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !onFetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onFetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  const canEdit = Boolean(onEdit || onDelete);
  const openDetailsModal = useTransactionDetailsModalStore((state) => state.openModal);

  const handleSelectTransaction = (t: Transaction) => {
    openDetailsModal(t, canEdit ? { onEdit, onDelete } : {});
  };

  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(num) ? 0 : num);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    const datePart = String(dateStr).split('T')[0];
    const parts = datePart.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    return dateStr;
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-8 text-center text-gray-400 dark:text-slate-500">
        Carregando transações...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-12 text-center text-gray-400 dark:text-slate-500">
        <p className="text-base font-medium text-gray-600 dark:text-slate-300">Nenhuma transação encontrada</p>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Ajuste os filtros ou registre um novo lançamento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Visualização Mobile: Cards compactos verticais */}
      <div className="block md:hidden">
        <TransactionMobileList
          transactions={transactions}
          onSelect={handleSelectTransaction}
        />
      </div>

      {/* Visualização Desktop: Tabela clássica */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-800 text-xs uppercase text-gray-400 dark:text-slate-400 font-semibold">
            <tr>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Compra</th>
              <th className="px-4 py-3">Vencimento</th>
              <th className="px-4 py-3">Pagamento</th>
              <th className="px-4 py-3">Conta / Cartão</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-center">Status</th>
              {canEdit && <th className="px-4 py-3 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
            {transactions.map((t) => {
              const overdueInfo = transactionService.calculateOverdue(t.due_date, t.status);
              const isIncome = t.type === 'incomings' || t.type === 'transfer_in';
              const isTransfer = t.type === 'transfers';

              return (
                <tr
                  key={t.id}
                  onClick={() => handleSelectTransaction(t)}
                  className="hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  {/* Descrição + Chips */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 dark:text-slate-200">{t.description}</span>
                      {t.current_installment && (
                        <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/50">
                          {formatInstallment(t.current_installment, t.total_installments) ?? t.current_installment}
                          {/* compat: {t.current_installment} */}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {t.category_name && (
                        <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded">
                          {t.category_name}
                        </span>
                      )}
                      {t.counterparty_name && (
                        <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] px-1.5 py-0.5 rounded">
                          {t.counterparty_name}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Data da Compra */}
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(t.purchase_date)}
                  </td>

                  {/* Data de Vencimento */}
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(t.due_date)}
                  </td>

                  {/* Data de Pagamento */}
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(t.payment_date)}
                  </td>

                  {/* Conta / Método */}
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-slate-300 whitespace-nowrap">
                    <div>{t.bank_account_name || '—'}</div>
                    <div className="text-[11px] text-gray-400 dark:text-slate-500">{t.pay_method_name || '—'}</div>
                  </td>

                  {/* Valor */}
                  <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                    isIncome ? 'text-emerald-600 dark:text-emerald-400' : isTransfer ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {isIncome ? '+ ' : isTransfer ? '' : '- '}
                    {formatCurrency(t.value)}
                  </td>

                  {/* Status & Alerta de Atraso */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center gap-1">
                      {t.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                        </span>
                      )}
                      {t.status === 'pending' && !overdueInfo && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                          <Clock className="w-3.5 h-3.5" /> Pendente
                        </span>
                      )}
                      {t.status === 'pending' && overdueInfo && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                          <AlertCircle className="w-3.5 h-3.5" /> Atrasada ({overdueInfo.daysOverdue}d)
                        </span>
                      )}
                      {t.status === 'expired' && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3.5 h-3.5" /> Vencido
                        </span>
                      )}
                      {t.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
                          <XCircle className="w-3.5 h-3.5" /> Cancelado
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Ações */}
                  {canEdit && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(t);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 dark:hover:text-blue-400 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(t);
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 dark:hover:text-rose-400 rounded-md transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Trigger de Rolagem Infinita */}
      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage && (
          <p className="text-xs text-blue-600 font-medium animate-pulse">Carregando mais lançamentos...</p>
        )}
      </div>
    </div>
  );
};
