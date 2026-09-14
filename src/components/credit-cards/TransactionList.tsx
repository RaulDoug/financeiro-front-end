import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import { formatDate } from '../../utils/formatDate.ts';
import type { CreditCardTransaction } from '../../types/creditCard.ts';

interface TransactionListProps {
  transactions?: CreditCardTransaction[];
  isLoading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
        Carregando transações da fatura...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-xs">
        Nenhuma compra registrada nesta fatura.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100" data-testid="invoice-transaction-list">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="py-3 flex items-center justify-between text-sm hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
          data-testid={`invoice-tx-${tx.id}`}
        >
          <div className="flex flex-col min-w-0 pr-4">
            <span className="font-medium text-slate-800 truncate">{tx.description}</span>
            <span className="text-[11px] text-slate-400">{formatDate(tx.due_date)}</span>
          </div>
          <span className="font-semibold text-slate-900 whitespace-nowrap">
            {formatCurrency(typeof tx.value === 'string' ? parseFloat(tx.value) : tx.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

