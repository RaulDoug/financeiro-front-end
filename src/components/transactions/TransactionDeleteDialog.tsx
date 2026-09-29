import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { useModalTransition } from '../../hooks/useModalTransition.ts';
import { formatInstallment } from '../../utils/formatInstallment.ts';
import type { Transaction } from '../../types/transaction.ts';

interface Props {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: (payload: { all_installments?: boolean; redistribute?: boolean }) => void;
  isDeleting?: boolean;
}

export const TransactionDeleteDialog: React.FC<Props> = ({
  isOpen,
  transaction,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const [allInstallments, setAllInstallments] = useState(false);
  const [redistribute, setRedistribute] = useState(false);

  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen: isOpen && Boolean(transaction),
    duration: 200,
    onClose,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRendered, triggerClose]);

  useEffect(() => {
    if (isOpen) {
      setAllInstallments(false);
      setRedistribute(false);
    }
  }, [isOpen]);

  if (!isRendered || !transaction) return null;

  const isInstallment = Boolean(transaction.current_installment);
  const formattedInstallment = formatInstallment(transaction.current_installment, transaction.total_installments) ?? transaction.current_installment;
  const isTransfer = transaction.type === 'transfers';
  const isCompleted = transaction.status === 'completed';

  const handleConfirm = () => {
    onConfirm({
      all_installments: allInstallments,
      redistribute: !allInstallments ? redistribute : false,
    });
  };

  const content = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-scrollbar ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      data-testid="transaction-delete-dialog"
      onClick={triggerClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100 dark:border-slate-800 my-auto ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500 font-semibold text-lg">
            <AlertTriangle className="w-5 h-5" />
            Excluir Transação
          </div>
          <button
            onClick={triggerClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-slate-300">
          Tem certeza de que deseja excluir a transação{' '}
          <strong className="text-gray-900 dark:text-white font-semibold">"{transaction.description}"</strong> de valor{' '}
          <strong className="text-gray-900 dark:text-white font-semibold">R$ {transaction.value}</strong>?
        </p>

        {isCompleted && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg text-xs text-amber-800 dark:text-amber-300">
            <strong>Aviso de Saldo:</strong> Esta transação já foi compensada. Ao excluí-la, o saldo da conta será revertido proporcionalmente.
          </div>
        )}

        {isTransfer && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-lg text-xs text-blue-800 dark:text-blue-300">
            Esta é uma transferência. A exclusão removerá ambos os lançamentos (saída na origem e entrada no destino).
          </div>
        )}

        {/* Escolha para parcelamento (Q-014) */}
        {isInstallment && (
          <div className="space-y-2 p-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">Esta compra é parcelada ({formattedInstallment}):</p>
            <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="deleteOption"
                checked={!allInstallments}
                onChange={() => setAllInstallments(false)}
                className="text-blue-600 focus:ring-blue-500"
              />
              Excluir apenas esta parcela ({formattedInstallment})
            </label>
            {!allInstallments && (
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400 cursor-pointer pt-1 pl-4">
                <input
                  type="checkbox"
                  checked={redistribute}
                  onChange={(e) => setRedistribute(e.target.checked)}
                  className="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                Redistribuir saldo entre parcelas restantes
              </label>
            )}
            <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="deleteOption"
                checked={allInstallments}
                onChange={() => {
                  setAllInstallments(true);
                  setRedistribute(false);
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              Excluir todas as parcelas da série
            </label>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={triggerClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            data-testid="confirm-delete-button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
};

export default TransactionDeleteDialog;
