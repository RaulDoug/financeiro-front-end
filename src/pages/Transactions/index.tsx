import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions.ts';
import { useTransactionMutations } from '../../hooks/useTransactionMutations.ts';
import { TransactionFilters } from '../../components/transactions/TransactionFilters.tsx';
import { TransactionTable } from '../../components/transactions/TransactionTable.tsx';
import { TransactionModal } from '../../components/transactions/TransactionModal.tsx';
import { TransactionDeleteDialog } from '../../components/transactions/TransactionDeleteDialog.tsx';
import type { Transaction, TransactionFilters as FiltersType } from '../../types/transaction.ts';

const getInitialMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

  return {
    due_date_from: `${year}-${month}-01`,
    due_date_to: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
  };
};

export const TransactionsPage: React.FC = () => {
  const [filters, setFilters] = useState<FiltersType>(() => ({
    ...getInitialMonthRange(),
    order_by: 'due_date',
    order_dir: 'ASC',
    limit: 20,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useTransactions(filters);

  const { createMutation, updateMutation, deleteMutation } = useTransactionMutations();

  // Achatar as páginas da rolagem infinita
  const allTransactions = data?.pages.flatMap((page) => page.rows) || [];

  const handleOpenNew = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const handleModalSubmit = async (formData: any) => {
    if (editingTransaction) {
      await updateMutation.mutateAsync({
        id: editingTransaction.id,
        payload: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleConfirmDelete = async (payload: { all_installments?: boolean; redistribute?: boolean }) => {
    if (!deletingTransaction) return;
    try {
      await deleteMutation.mutateAsync({
        id: deletingTransaction.id,
        payload,
      });
      setDeletingTransaction(null);
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Gerencie e acompanhe todas as movimentações financeiras da sua carteira.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Transação
        </button>
      </div>

      {/* Filtros */}
      <TransactionFilters filters={filters} onChange={setFilters} />

      {/* Tabela de Lançamentos com Infinite Scroll */}
      <TransactionTable
        transactions={allTransactions}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal de Criação / Edição */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        initialData={editingTransaction}
        onSubmit={handleModalSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Diálogo de Exclusão */}
      <TransactionDeleteDialog
        isOpen={Boolean(deletingTransaction)}
        transaction={deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default TransactionsPage;
