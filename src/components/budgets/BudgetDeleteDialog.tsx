import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { useModalTransition } from '../../hooks/useModalTransition.ts';
import type { EnrichedBudgetItem } from '../../types/budget.ts';

interface BudgetDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  budget: EnrichedBudgetItem | null;
  onConfirm: (id: string, scope: 'single' | 'following') => Promise<void>;
}

export const BudgetDeleteDialog: React.FC<BudgetDeleteDialogProps> = ({
  isOpen,
  onClose,
  budget,
  onConfirm,
}) => {
  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen,
    duration: 200,
    onClose,
  });

  const [scope, setScope] = useState<'single' | 'following'>('single');
  const [isDeleting, setIsDeleting] = useState(false);

  const isRecurrent = Boolean(budget?.recurrence_group_id);

  useEffect(() => {
    setScope('single');
  }, [budget]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRendered, triggerClose]);

  if (!isRendered || !budget) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(budget.id, scope);
      triggerClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-testid="budget-delete-dialog"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity ${
          isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
        }`}
        onClick={triggerClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl z-50 overflow-hidden ${
          isClosing ? 'animate-dialog-out' : 'animate-dialog-in'
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={triggerClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Excluir Orçamento?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Você está prestes a remover o orçamento da categoria{' '}
          <strong className="text-slate-900 dark:text-white font-semibold">
            {budget.category_name}
          </strong>
          .
        </p>

        {isRecurrent && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Este orçamento é recorrente. Escolha o escopo da exclusão:
            </span>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="delete-scope"
                  value="single"
                  checked={scope === 'single'}
                  onChange={() => setScope('single')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Excluir apenas este mês</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="delete-scope"
                  value="following"
                  checked={scope === 'following'}
                  onChange={() => setScope('following')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Excluir este e todos os próximos meses</span>
              </label>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={triggerClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            data-testid="budget-delete-confirm-button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
