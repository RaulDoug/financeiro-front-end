import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { CreditCardItem } from '../../types/creditCard.ts';

interface CreditCardDeleteDialogProps {
  isOpen: boolean;
  card: CreditCardItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const CreditCardDeleteDialog: React.FC<CreditCardDeleteDialogProps> = ({
  isOpen,
  card,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !card) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      data-testid="credit-card-delete-dialog"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-base">
            <AlertTriangle className="w-5 h-5" />
            Excluir Cartão de Crédito
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600">
          Tem certeza de que deseja excluir o cartão de crédito{' '}
          <strong className="text-slate-900 font-semibold">{card.name}</strong> (final{' '}
          {card.last_four_digits})?
        </p>

        <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
          Esta ação removerá a forma de pagamento do sistema. Transações vinculadas a este cartão não serão apagadas automaticamente.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
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

