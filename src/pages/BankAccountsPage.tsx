import React, { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useBankAccounts, useAccountBalancesReport } from '../hooks/useBankAccounts.ts';
import { useBankAccountMutations } from '../hooks/useBankAccountMutations.ts';
import { AccountsTotalizer } from '../components/bank-accounts/AccountsTotalizer.tsx';
import { AccountCard } from '../components/bank-accounts/AccountCard.tsx';
import { AccountFormModal } from '../components/bank-accounts/AccountFormModal.tsx';
import { DeleteConfirmModal } from '../components/bank-accounts/DeleteConfirmModal.tsx';
import type { BankAccountItem, BankAccountFormData } from '../types/bankAccount.ts';

export const BankAccountsPage: React.FC = () => {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useBankAccounts();
  const { data: reportData, isLoading: isLoadingReport } = useAccountBalancesReport();
  const { createMutation, updateMutation, deleteMutation } = useBankAccountMutations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccountItem | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<BankAccountItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  // Total acumulado
  const calculatedTotal = accounts.reduce((acc, curr) => {
    const val = typeof curr.balance === 'string' ? parseFloat(curr.balance) : Number(curr.balance ?? 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const totalBalances = reportData?.totalBalances ?? calculatedTotal;

  const handleOpenNew = () => {
    setErrorFeedback(null);
    setEditingAccount(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (account: BankAccountItem) => {
    setErrorFeedback(null);
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (account: BankAccountItem) => {
    setDeleteError(null);
    setDeletingAccount(account);
  };

  const handleSubmit = async (data: BankAccountFormData) => {
    try {
      setErrorFeedback(null);
      if (editingAccount) {
        const idToUpdate = (editingAccount.display_id ?? editingAccount.id) as any;
        await updateMutation.mutateAsync({ id: idToUpdate, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingAccount(null);
    } catch (error: any) {
      console.error('Erro ao salvar conta bancária:', error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        'Erro ao salvar conta bancária.';
      setErrorFeedback(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAccount) return;
    setDeleteError(null);
    try {
      const idToDelete = (deletingAccount.display_id ?? deletingAccount.id) as any;
      await deleteMutation.mutateAsync(idToDelete);
      setDeletingAccount(null);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        'Não foi possível excluir esta conta porque existem transações ou cartões vinculados a ela.';
      setDeleteError(msg);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto" data-testid="bank-accounts-page">
      {errorFeedback && (
        <div
          data-testid="bank-account-error-banner"
          className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center justify-between text-sm"
        >
          <span>{errorFeedback}</span>
          <button
            type="button"
            onClick={() => setErrorFeedback(null)}
            className="text-rose-500 hover:text-rose-700 font-bold ml-4 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contas Bancárias</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize e gerencie suas contas correntes, saldos e limites de crédito.
          </p>
        </div>

        <button
          type="button"
          data-testid="new-account-button"
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nova Conta
        </button>
      </div>

      {/* Totalizador Geral (AC-083) */}
      <AccountsTotalizer
        total={totalBalances}
        accountsCount={accounts.length}
        isLoading={isLoadingAccounts || isLoadingReport}
      />

      {/* Grid de Contas (AC-081, AC-082) */}
      {isLoadingAccounts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Nenhuma conta cadastrada</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Cadastre sua conta corrente para organizar seus saldos e registrar receitas e despesas.
          </p>
          <button
            type="button"
            onClick={handleOpenNew}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Cadastrar Conta Agora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="accounts-grid">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={() => handleOpenEdit(account)}
              onDelete={() => handleOpenDelete(account)}
            />
          ))}
        </div>
      )}

      {/* Modal Formulário */}
      <AccountFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAccount(null);
        }}
        initialData={editingAccount}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Modal Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingAccount)}
        account={deletingAccount}
        onClose={() => {
          setDeletingAccount(null);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteError}
      />
    </div>
  );
};

export default BankAccountsPage;

