import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTransactions } from '../../hooks/useTransactions.ts';
import { useTransactionMutations } from '../../hooks/useTransactionMutations.ts';
import { transactionService } from '../../services/transactionService.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';
import { TransactionFilters } from '../../components/transactions/TransactionFilters.tsx';
import { TransactionSummaryCards } from '../../components/transactions/TransactionSummaryCards.tsx';
import { TransactionTable } from '../../components/transactions/TransactionTable.tsx';
import { TransactionModal } from '../../components/transactions/TransactionModal.tsx';
import { TransactionDeleteDialog } from '../../components/transactions/TransactionDeleteDialog.tsx';
import { useTransactionModalStore } from '../../stores/transactionModal.store.ts';
import { useFilterStore } from '../../stores/filter.store.ts';
import type { Transaction, TransactionFilters as FiltersType } from '../../types/transaction.ts';

export const TransactionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filters = useFilterStore((state) => state.transactionFilters);
  const setFilters = useFilterStore((state) => state.setTransactionFilters);

  useEffect(() => {
    const status = searchParams.get('status') as FiltersType['status'];
    const categoryId = searchParams.get('category_id');
    const dueDateFrom = searchParams.get('due_date_from');
    const dueDateTo = searchParams.get('due_date_to');

    if (status || categoryId || dueDateFrom || dueDateTo) {
      setFilters((prev) => {
        const next = { ...prev, page: 1 };
        if (status) {
          next.status = status;
          if (!dueDateFrom) next.due_date_from = undefined;
          if (!dueDateTo) next.due_date_to = undefined;
        }
        if (categoryId) {
          next.category_id = [categoryId];
        }
        if (dueDateFrom) {
          next.due_date_from = dueDateFrom;
        }
        if (dueDateTo) {
          next.due_date_to = dueDateTo;
        }
        return next;
      });
    }
  }, [searchParams, setFilters]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const {
    isOpen: isGlobalModalOpen,
    closeModal: closeGlobalModal,
  } = useTransactionModalStore();

  const currentWallet = useWalletStore((state) => state.currentWallet);
  const currentWalletId = useWalletStore((state) => state.currentWalletId);
  const isViewer = currentWallet?.role === 'viewer';

  useEffect(() => {
    if (isGlobalModalOpen) {
      if (isViewer) {
        closeGlobalModal();
        return;
      }
      setEditingTransaction(null);
      setIsModalOpen(true);
      closeGlobalModal();
    }
  }, [isGlobalModalOpen, closeGlobalModal, isViewer]);

  useEffect(() => {
    return () => {
      closeGlobalModal();
    };
  }, [closeGlobalModal]);

  // AC-243 / AC-244: Quando não houver status selecionado ("Todas as transações"), solicitar apenas status ativos (não cancelados)
  // Quando filtro for 'expired', solicitar tanto 'expired' quanto 'pending' para que transações com vencimento anterior a hoje
  // que ainda constam como 'pending' no banco apareçam.
  const queryFilters = React.useMemo<FiltersType>(() => {
    let q: FiltersType = { ...filters };

    // Se o filtro for 'transfers', enviar os tipos reais suportados pelo schema da API ('transfer_in' e 'transfer_out')
    if (filters.type === 'transfers') {
      q.type = ['transfer_in', 'transfer_out'];
    }

    if (!filters.status) {
      q = {
        ...q,
        status: ['pending', 'completed', 'expired'],
      };
    } else if (filters.status === 'expired') {
      q = {
        ...q,
        status: ['expired', 'pending'],
      };
    }
    return q;
  }, [filters]);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useTransactions(queryFilters);

  // Buscar transações vencidas de períodos anteriores caso haja filtro de data início ativo
  const { data: pastOverdueData, refetch: refetchPastOverdue } = useQuery({
    queryKey: [
      'transactions-overdue-past',
      currentWalletId,
      filters.due_date_from,
      filters.status,
      filters.type,
      filters.value_min,
      filters.value_max,
      filters.category_id,
      filters.pay_methods_id,
      filters.bank_account_id,
    ],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const maxDate = filters.due_date_from && filters.due_date_from < today ? filters.due_date_from : today;
      const res = await transactionService.getTransactions({
        type: filters.type,
        category_id: filters.category_id,
        pay_methods_id: filters.pay_methods_id,
        bank_account_id: filters.bank_account_id,
        due_date_to: maxDate,
        value_min: filters.value_min,
        value_max: filters.value_max,
        order_by: 'due_date',
        order_dir: 'DESC',
        limit: 50,
      });
      return (res.rows || []).filter(
        (t) => t.status === 'expired' || (t.status === 'pending' && Boolean(t.due_date && t.due_date < today))
      );
    },
    enabled: Boolean(
      currentWalletId &&
      filters.due_date_from &&
      (!filters.status || filters.status === 'pending' || filters.status === 'expired') &&
      filters.type !== 'transfers'
    ),
  });

  const { createMutation, updateMutation, deleteMutation } = useTransactionMutations();

  // Achatar as páginas da rolagem infinita
  const rawTransactions = data?.pages.flatMap((page) => page.rows) || [];

  // Combinar transações vencidas de meses anteriores com as transações da página atual
  // e aplicar filtragem estrita para transações canceladas (AC-243, AC-244) e tipo de transação ativo
  const allTransactions = React.useMemo(() => {
    const list = [...rawTransactions];
    const existingIds = new Set(list.map((t) => t.id));
    if (pastOverdueData && pastOverdueData.length > 0 && filters.type !== 'transfers') {
      for (const ot of pastOverdueData) {
        if (filters.type && ot.type !== filters.type) {
          continue;
        }
        if (!existingIds.has(ot.id)) {
          existingIds.add(ot.id);
          list.unshift(ot);
        }
      }
    }

    let filteredList = list;
    if (filters.type) {
      filteredList = filteredList.filter((t) => {
        if (filters.type === 'transfers') {
          return t.type === 'transfers' || t.type === 'transfer_in' || t.type === 'transfer_out';
        }
        return t.type === filters.type;
      });
    }

    // Regra US-067: Transações canceladas aparecem somente quando o filtro 'cancelled' for explicitamente selecionado.
    // Em todas as transações ou outros filtros, não mostra as canceladas.
    if (filters.status === 'cancelled') {
      return filteredList.filter((t) => t.status === 'cancelled');
    }

    // Regra Vencidos / Pendentes:
    // Se filtro for 'expired', exibir transações cujo status seja 'expired' OU que sejam 'pending' com due_date < today
    if (filters.status === 'expired') {
      const today = new Date().toISOString().split('T')[0];
      return filteredList.filter(
        (t) =>
          t.status !== 'cancelled' &&
          (t.status === 'expired' || (t.status === 'pending' && Boolean(t.due_date && t.due_date < today)))
      );
    }

    // Se filtro for 'pending', exibir transações 'pending' que NÃO estejam vencidas (due_date >= today ou sem data)
    if (filters.status === 'pending') {
      const today = new Date().toISOString().split('T')[0];
      return filteredList.filter(
        (t) => t.status === 'pending' && (!t.due_date || t.due_date >= today)
      );
    }

    return filteredList.filter((t) => t.status !== 'cancelled');
  }, [rawTransactions, pastOverdueData, filters.status, filters.type]);

  // US-083 / AC-300: Totais dinâmicos conforme filtros aplicados
  const { incomingsTotal, expensesTotal } = React.useMemo(() => {
    const backendTotals = data?.pages?.[0]?.totals;
    if (
      backendTotals &&
      typeof backendTotals.incomings === 'number' &&
      typeof backendTotals.expenses === 'number'
    ) {
      return {
        incomingsTotal: backendTotals.incomings,
        expensesTotal: backendTotals.expenses,
      };
    }
    // Fallback defensivo em memória caso backend ainda não tenha retornado totals
    let inc = 0;
    let exp = 0;
    for (const t of allTransactions) {
      if (t.status === 'cancelled' && filters.status !== 'cancelled') continue;
      const val = Number(t.value) || 0;
      if (t.type === 'incomings') inc += val;
      else if (t.type === 'expenses') exp += val;
    }
    return {
      incomingsTotal: inc,
      expensesTotal: exp,
    };
  }, [data?.pages, allTransactions, filters.status]);

  const handleSort = (column: string) => {
    setFilters((prev) => {
      const isSame = prev.order_by === column;
      const nextDir: 'ASC' | 'DESC' = isSame
        ? prev.order_dir === 'ASC'
          ? 'DESC'
          : 'ASC'
        : column === 'due_date' || column === 'purchase_date' || column === 'payment_date' || column === 'value'
        ? 'DESC'
        : 'ASC';

      return {
        ...prev,
        order_by: column,
        order_dir: nextDir,
        page: 1,
      };
    });
  };

  const handleOpenNew = () => {
    if (isViewer) return;
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    if (isViewer) return;
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    if (isViewer) return;
    setDeletingTransaction(transaction);
  };

  const closeEditWithoutChanges = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleModalSubmit = async (formData: any) => {
    if (isViewer) return;
    if (editingTransaction) {
      if (Object.keys(formData).length === 0) {
        closeEditWithoutChanges();
        return;
      }
      await updateMutation.mutateAsync({
        id: editingTransaction.id,
        payload: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    await Promise.all([refetch(), refetchPastOverdue()]);
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleConfirmDelete = async (payload: { all_installments?: boolean; redistribute?: boolean }) => {
    if (isViewer || !deletingTransaction) return;
    try {
      await deleteMutation.mutateAsync({
        id: deletingTransaction.id,
        payload,
      });
      await Promise.all([refetch(), refetchPastOverdue()]);
      setDeletingTransaction(null);
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Gerencie e acompanhe todas as movimentações financeiras da sua carteira.
          </p>
        </div>

        {!isViewer && (
          <button
            onClick={handleOpenNew}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        )}
      </div>

      {/* Filtros */}
      <TransactionFilters filters={filters} onChange={setFilters} />

      {/* Cards de Total de Entradas e Saídas (AC-301) */}
      <TransactionSummaryCards
        incomings={incomingsTotal}
        expenses={expensesTotal}
        isLoading={isLoading}
      />

      {/* Tabela de Lançamentos com Infinite Scroll e Ordenação Dinâmica */}
      <TransactionTable
        transactions={allTransactions}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
        onEdit={isViewer ? undefined : handleEdit}
        onDelete={isViewer ? undefined : handleDelete}
        orderBy={filters.order_by}
        orderDir={filters.order_dir}
        onSort={handleSort}
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
