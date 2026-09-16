import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle, ChevronRight } from 'lucide-react';
import { transactionService } from '../../services/transactionService.ts';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import type { Transaction } from '../../types/transaction.ts';

interface TransactionMobileListProps {
  transactions: Transaction[];
  onSelect: (transaction: Transaction) => void;
}

export const TransactionMobileList: React.FC<TransactionMobileListProps> = ({
  transactions,
  onSelect,
}) => {
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

  return (
    <div className="divide-y divide-gray-100 dark:divide-slate-800" data-testid="transaction-mobile-list">
      {transactions.map((t) => {
        const overdueInfo = transactionService.calculateOverdue(t.due_date, t.status);
        const isIncome = t.type === 'incomings' || t.type === 'transfer_in';
        const isTransfer = t.type === 'transfers';

        return (
          <div
            key={t.id}
            onClick={() => onSelect(t)}
            data-testid={`mobile-transaction-item-${t.id}`}
            className="p-3.5 hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1 space-y-1">
              {/* Linha 1: Descrição e Parcela */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-semibold text-sm text-gray-900 dark:text-slate-100 truncate">
                  {t.description}
                </span>
                {t.current_installment && (
                  <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                    {t.current_installment}
                  </span>
                )}
              </div>

              {/* Linha 2: Chips de Categoria e Conta */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                {t.category_name && (
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                    {t.category_name}
                  </span>
                )}
                {t.bank_account_name && (
                  <span className="text-gray-400 dark:text-slate-500 truncate max-w-[120px]">
                    • {t.bank_account_name}
                  </span>
                )}
              </div>

              {/* Linha 3: Data e Status */}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  {formatDate(t.due_date || t.purchase_date)}
                </span>

                {t.status === 'cancelled' ? (
                  <span className="inline-flex items-center gap-0.5 text-gray-400 font-medium">
                    <XCircle className="w-3 h-3" />
                    Cancelada
                  </span>
                ) : overdueInfo?.isOverdue ? (
                  <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-bold">
                    <AlertCircle className="w-3 h-3" />
                    {overdueInfo.daysOverdue > 0 ? `${overdueInfo.daysOverdue}d atrasada` : 'Vencida'}
                  </span>
                ) : t.status === 'expired' ? (
                  <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-bold">
                    <AlertCircle className="w-3 h-3" />
                    Vencida
                  </span>
                ) : t.status === 'completed' ? (
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Paga
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
                    <Clock className="w-3 h-3" />
                    Pendente
                  </span>
                )}
              </div>
            </div>

            {/* Lado Direito: Valor e Seta */}
            <div className="flex items-center gap-1 shrink-0 text-right">
              <span
                className={`text-sm font-bold whitespace-nowrap ${
                  isIncome
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isTransfer
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isIncome ? '+ ' : isTransfer ? '' : '- '}
                {formatCurrency(Number(t.value))}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
