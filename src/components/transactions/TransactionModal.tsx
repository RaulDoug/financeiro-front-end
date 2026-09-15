import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { TransactionFormBase } from './TransactionFormBase.tsx';
import type { Transaction, TransactionType } from '../../types/transaction.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
  initialData?: Transaction | null;
  onSubmit: (data: any) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const TransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialType = 'expenses',
  initialData = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const [activeTab, setActiveTab] = useState<TransactionType>(initialData?.type || initialType);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialData?.type || initialType);
      setErrorBanner(null);
    }
  }, [isOpen, initialType, initialData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (data: any) => {
    try {
      setErrorBanner(null);
      await onSubmit(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Não foi possível salvar a transação. Verifique os dados.';
      setErrorBanner(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-gray-100 dark:border-slate-800 my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {initialData ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorBanner && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}

        {/* Abas de Tipo (apenas se for novo registro) */}
        {!initialData && (
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'expenses'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('incomings')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'incomings'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Receita
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transfers')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'transfers'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Transferência
            </button>
          </div>
        )}

        {/* Formulário */}
        <TransactionFormBase
          key={activeTab}
          type={activeTab}
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

