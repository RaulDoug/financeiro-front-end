import React from 'react';
import { useTransactionModalStore } from '../../../stores/transactionModal.store.ts';
import { Plus, Minus, ArrowLeftRight } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const openModal = useTransactionModalStore((state) => state.openModal);

  return (
    <div className="hidden md:flex flex-wrap items-center gap-3" data-testid="quick-actions">
      <button
        type="button"
        data-testid="btn-quick-income"
        onClick={() => openModal('incomings')}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 dark:hover:bg-emerald-900/40 rounded-xl transition shadow-2xs cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Nova Receita
      </button>

      <button
        type="button"
        data-testid="btn-quick-expense"
        onClick={() => openModal('expenses')}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60 dark:hover:bg-rose-900/40 rounded-xl transition shadow-2xs cursor-pointer"
      >
        <Minus className="w-4 h-4" />
        Nova Despesa
      </button>

      <button
        type="button"
        data-testid="btn-quick-transfer"
        onClick={() => openModal('transfers')}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60 dark:hover:bg-blue-900/40 rounded-xl transition shadow-2xs cursor-pointer"
      >
        <ArrowLeftRight className="w-4 h-4" />
        Transferência
      </button>
    </div>
  );
};
