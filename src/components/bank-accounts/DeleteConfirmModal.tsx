import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
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
  if (!isOpen || !account) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      data-testid="delete-confirm-modal"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-base">
            <AlertTriangle className="w-5 h-5" />
            Excluir Conta Bancária
          </div>
          <button
            type="button"
            aria-label="Fechar"
            data-testid="cancel-delete-x-button"
            onClick={onClose}
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
            onClick={onClose}
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
};

export default DeleteConfirmModal;

