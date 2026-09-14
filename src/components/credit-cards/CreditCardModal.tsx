import React from 'react';
import { X } from 'lucide-react';
import { CreditCardForm } from './CreditCardForm.tsx';
import type { CreditCardItem, CreditCardFormData } from '../../types/creditCard.ts';

interface CreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CreditCardItem | null;
  onSubmit: (data: CreditCardFormData) => void;
  isSubmitting?: boolean;
}

export const CreditCardModal: React.FC<CreditCardModalProps> = ({
  isOpen,
  onClose,
  initialData = null,
  onSubmit,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto backdrop-blur-xs"
      data-testid="credit-card-modal"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {initialData ? 'Editar Cartão de Crédito' : 'Novo Cartão de Crédito'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CreditCardForm
          initialData={initialData}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

