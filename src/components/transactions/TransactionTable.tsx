import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { transactionService } from '../../services/transactionService.ts';
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

  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(num) ? 0 : num);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
        Carregando transações...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
        <p className="text-base font-medium text-gray-600">Nenhuma transação encontrada</p>
        <p className="text-xs text-gray-400 mt-1">Ajuste os filtros ou registre um novo lançamento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-400 font-semibold">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Conta / Cartão</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((t) => {
              const overdueInfo = transactionService.calculateOverdue(t.due_date, t.status);
              const isIncome = t.type === 'incomings';
              const isTransfer = t.type === 'transfers';

              return (
                <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                  {/* Data */}
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(t.payment_date || t.purchase_date || t.due_date)}
                  </td>

                  {/* Descrição + Chips */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{t.description}</span>
                      {t.current_installment && (
                        <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                          {t.current_installment}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {t.category_name && (
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded">
                          {t.category_name}
                        </span>
                      )}
                      {t.counterparty_name && (
                        <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded">
                          {t.counterparty_name}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Conta / Método */}
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    <div>{t.bank_account_name}</div>
                    <div className="text-[11px] text-gray-400">{t.pay_method_name}</div>
                  </td>

                  {/* Valor */}
                  <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                    isIncome ? 'text-emerald-600' : isTransfer ? 'text-blue-600' : 'text-rose-600'
                  }`}>
                    {isIncome ? '+ ' : isTransfer ? '' : '- '}
                    {formatCurrency(t.value)}
                  </td>

                  {/* Status & Alerta de Atraso */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center gap-1">
                      {t.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                        </span>
                      )}
                      {t.status === 'pending' && !overdueInfo && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Clock className="w-3.5 h-3.5" /> Pendente
                        </span>
                      )}
                      {t.status === 'pending' && overdueInfo && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" /> Atrasada ({overdueInfo.daysOverdue}d)
                        </span>
                      )}
                      {t.status === 'expired' && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3.5 h-3.5" /> Vencido
                        </span>
                      )}
                      {t.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <XCircle className="w-3.5 h-3.5" /> Cancelado
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(t)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(t)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
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
