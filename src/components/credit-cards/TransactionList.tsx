import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import { formatDate } from '../../utils/formatDate.ts';
import { useTransactionDetailsModalStore } from '../../stores/transactionDetailsModal.store.ts';
import type { CreditCardTransaction } from '../../types/creditCard.ts';
import type { Transaction } from '../../types/transaction.ts';

interface TransactionListProps {
  transactions?: CreditCardTransaction[];
  isLoading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions = [],
  isLoading = false,
}) => {
  const openModal = useTransactionDetailsModalStore((state) => state.openModal);

  const handleSelectTransaction = (tx: CreditCardTransaction) => {
    const transaction: Transaction = {
      id: tx.id,
      description: tx.description,
      value: String(tx.value),
      type: 'expenses',
      status: (tx.status as any) || 'pending',
      due_date: tx.due_date || null,
      purchase_date: tx.purchase_date || tx.due_date || null,
      payment_date: null,
      transfers_id: null,
      invoice_id: null,
      current_installment: null,
      bank_account_name: tx.bank_account_name || '',
      category_name: tx.category_name || null,
      pay_method_name: tx.pay_method_name || '',
      counterparty_name: null,
      creator_user_name: '',
      created_at: '',
    };
    openModal(transaction);
  };

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
          onClick={() => handleSelectTransaction(tx)}
          className="py-3 flex items-center justify-between text-sm hover:bg-slate-50/50 px-2 rounded-lg transition-colors cursor-pointer"
          data-testid={`invoice-tx-${tx.id}`}
        >
          <div className="flex flex-col min-w-0 pr-4">
            <span className="font-medium text-slate-800 truncate">{tx.description}</span>
            <span className="text-[11px] text-slate-400" data-testid="tx-purchase-date">
              {formatDate(tx.purchase_date || tx.due_date)}
            </span>
          </div>
          <span className="font-semibold text-slate-900 whitespace-nowrap">
            {formatCurrency(typeof tx.value === 'string' ? parseFloat(tx.value) : tx.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

