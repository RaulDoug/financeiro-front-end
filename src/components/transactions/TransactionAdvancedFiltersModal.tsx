import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const TransactionAdvancedFiltersModal: React.FC<TransactionAdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  containerRef,
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

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(typeof filters.category_id === 'string' ? filters.category_id : '');
      setSelectedPayMethod(typeof filters.pay_methods_id === 'string' ? filters.pay_methods_id : '');
      setSelectedBankAccount(typeof filters.bank_account_id === 'string' ? filters.bank_account_id : '');
      setSelectedStatus(typeof filters.status === 'string' ? filters.status : '');
      setSelectedType(typeof filters.type === 'string' ? filters.type : '');
    }
  }, [isOpen, filters]);

  // Fechamento no desktop ao clicar fora ou pressionar Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile) return;
      const target = e.target as Node;
      if (
        (containerRef?.current && containerRef.current.contains(target)) ||
        (popoverRef.current && popoverRef.current.contains(target))
      ) {
        return;
      }
      onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile, onClose, containerRef]);

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

  // Formulário compartilhado entre desktop (popover) e mobile (modal)
  const renderFilterFields = () => (
    <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto">
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
  );

  // Footer compartilhado
  const renderFooter = () => (
    <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800 rounded-b-2xl">
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
          className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleApply}
          data-testid="btn-apply-advanced-filters"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  // Renderização Desktop: Popover flutuante ancorado ao botão (estilo sino / carteiras)
  if (!isMobile) {
    return (
      <div
        ref={popoverRef}
        data-testid="advanced-filters-popover"
        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
      >
        {/* Header Desktop */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Filtros Avançados</h2>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Refine a listagem de transações</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {renderFilterFields()}
        {renderFooter()}
      </div>
    );
  }

  // Renderização Mobile: Modal montado via Portal em document.body cobrindo 100% da tela
  const mobileModalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      data-testid="advanced-filters-modal"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Mobile */}
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

        {renderFilterFields()}
        {renderFooter()}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(mobileModalContent, document.body)
    : mobileModalContent;
};

