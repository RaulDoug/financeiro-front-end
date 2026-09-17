import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { useModalTransition } from '../../hooks/useModalTransition.ts';
import type { BankAccountItem } from '../../types/bankAccount.ts';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  account: BankAccountItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  errorMessage?: string | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  account,
  onClose,
  onConfirm,
  isDeleting = false,
  errorMessage = null,
}) => {
  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen: isOpen && Boolean(account),
    duration: 150,
    onClose,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isRendered, triggerClose]);

  if (!isRendered || !account) return null;

  const content = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      data-testid="delete-confirm-modal"
      onClick={triggerClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-base">
            <AlertTriangle className="w-5 h-5" />
            Excluir Conta Bancária
          </div>
          <button
            type="button"
            aria-label="Fechar"
            data-testid="cancel-delete-x-button"
            onClick={triggerClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600">
          Tem certeza de que deseja excluir a conta{' '}
          <strong className="text-slate-900 font-semibold">"{account.bank_name}"</strong>?
        </p>

        {/* Alerta de erro retornado pela API caso possua movimentações */}
        {errorMessage ? (
          <div
            className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1"
            data-testid="linked-transactions-error"
          >
            <strong>Atenção:</strong> {errorMessage}
            <p className="text-[11px] text-rose-600 mt-1">
              Transfira ou remova as movimentações e cartões vinculados a esta conta antes de excluí-la.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>Aviso preventivo:</strong> Se existirem transações vinculadas a esta conta, a exclusão será recusada para preservar a integridade do seu saldo e histórico.
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            data-testid="cancel-delete-button"
            onClick={triggerClose}
            /* onClick={onClose} */
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            data-testid="confirm-delete-button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : content;
};

export default DeleteConfirmModal;

