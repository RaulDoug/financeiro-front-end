import React, { useState, useEffect } from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories.ts';
import { usePayMethods } from '../../hooks/usePayMethods.ts';
import { useBankAccounts } from '../../hooks/useBankAccounts.ts';
import type { TransactionFilters, TransactionStatus, TransactionType } from '../../types/transaction.ts';

interface TransactionAdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  onApply: (newFilters: Partial<TransactionFilters>) => void;
  onReset: () => void;
}

export const TransactionAdvancedFiltersModal: React.FC<TransactionAdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const { data: categories = [] } = useCategories();
  const { data: payMethods = [] } = usePayMethods();
  const { data: bankAccounts = [] } = useBankAccounts();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    typeof filters.category_id === 'string' ? filters.category_id : ''
  );
  const [selectedPayMethod, setSelectedPayMethod] = useState<string>(
    typeof filters.pay_methods_id === 'string' ? filters.pay_methods_id : ''
  );
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>(
    typeof filters.bank_account_id === 'string' ? filters.bank_account_id : ''
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    typeof filters.status === 'string' ? filters.status : ''
  );
  const [selectedType, setSelectedType] = useState<string>(
    typeof filters.type === 'string' ? filters.type : ''
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(typeof filters.category_id === 'string' ? filters.category_id : '');
      setSelectedPayMethod(typeof filters.pay_methods_id === 'string' ? filters.pay_methods_id : '');
      setSelectedBankAccount(typeof filters.bank_account_id === 'string' ? filters.bank_account_id : '');
      setSelectedStatus(typeof filters.status === 'string' ? filters.status : '');
      setSelectedType(typeof filters.type === 'string' ? filters.type : '');
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      category_id: selectedCategory || undefined,
      pay_methods_id: selectedPayMethod || undefined,
      bank_account_id: selectedBankAccount || undefined,
      status: (selectedStatus as TransactionStatus) || undefined,
      type: (selectedType as TransactionType) || undefined,
      page: 1,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategory('');
    setSelectedPayMethod('');
    setSelectedBankAccount('');
    setSelectedStatus('');
    setSelectedType('');
    onReset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      data-testid="advanced-filters-modal"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Filtros Avançados</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Refine a listagem de transações</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Categoria */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              data-testid="filter-category-select"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Método de Pagamento */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Método de Pagamento
            </label>
            <select
              value={selectedPayMethod}
              onChange={(e) => setSelectedPayMethod(e.target.value)}
              data-testid="filter-pay-method-select"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os Métodos</option>
              {payMethods.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Conta Bancária */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Conta Bancária
            </label>
            <select
              value={selectedBankAccount}
              onChange={(e) => setSelectedBankAccount(e.target.value)}
              data-testid="filter-bank-account-select"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as Contas</option>
              {bankAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.bank_name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Status da Transação
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              data-testid="filter-status-select"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os Status</option>
              <option value="pending">Pendente / A vencer</option>
              <option value="completed">Concluída / Paga</option>
              <option value="expired">Atrasada / Vencida</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Tipo de Movimentação
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              data-testid="filter-type-select"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os Tipos</option>
              <option value="incomings">Receitas</option>
              <option value="expenses">Despesas</option>
              <option value="transfers">Transferências</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpar
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              data-testid="btn-apply-advanced-filters"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
