import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
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

  if (!isOpen || !transaction) return null;

  const isInstallment = Boolean(transaction.current_installment);
  const formattedInstallment = formatInstallment(transaction.current_installment, transaction.total_installments) ?? transaction.current_installment;
  const isTransfer = transaction.type === 'transfers';
  const isCompleted = transaction.status === 'completed';

  React.useEffect(() => {
    if (isOpen) {
      setAllInstallments(false);
      setRedistribute(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm({
      all_installments: allInstallments,
      redistribute: !allInstallments ? redistribute : false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-lg">
            <AlertTriangle className="w-5 h-5" />
            Excluir Transação
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Tem certeza de que deseja excluir a transação{' '}
          <strong className="text-gray-900 font-semibold">"{transaction.description}"</strong> de valor{' '}
          <strong className="text-gray-900 font-semibold">R$ {transaction.value}</strong>?
        </p>

        {isCompleted && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <strong>Aviso de Saldo:</strong> Esta transação já foi compensada. Ao excluí-la, o saldo da conta será revertido proporcionalmente.
          </div>
        )}

        {isTransfer && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            Esta é uma transferência. A exclusão removerá ambos os lançamentos (saída na origem e entrada no destino).
          </div>
        )}

        {/* Escolha para parcelamento (Q-014) */}
        {isInstallment && (
          <div className="space-y-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-700">Esta compra é parcelada ({formattedInstallment}):</p>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
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
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer pt-1 pl-4">
                <input
                  type="checkbox"
                  checked={redistribute}
                  onChange={(e) => setRedistribute(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Redistribuir saldo entre parcelas restantes
              </label>
            )}
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
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
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
};
