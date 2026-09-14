import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { bankAccountSchema } from '../../schemas/bankAccountSchema.ts';
import type { BankAccountItem, BankAccountFormData } from '../../types/bankAccount.ts';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BankAccountItem | null;
  onSubmit: (data: BankAccountFormData) => void;
  isSubmitting?: boolean;
}

export const AccountFormModal: React.FC<AccountFormModalProps> = ({
  isOpen,
  onClose,
  initialData = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const [bankName, setBankName] = useState(initialData?.bank_name || '');
  const [balance, setBalance] = useState(
    initialData ? String(initialData.balance ?? 0) : '0'
  );
  const [allowNegativeBalance, setAllowNegativeBalance] = useState(
    initialData?.allow_negative_balance ?? false
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rawData = {
      bank_name: bankName.trim(),
      balance: parseFloat(balance) || 0,
      allow_negative_balance: allowNegativeBalance,
    };

    const validation = bankAccountSchema.safeParse(rawData);

    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        formattedErrors[field] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    onSubmit(validation.data);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto backdrop-blur-xs"
      data-testid="account-form-modal"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {initialData ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="bank-account-form">
          {/* Nome do Banco */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome da Instituição / Banco *
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Ex: Nubank, Itaú, Santander, Carteira Física..."
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
                errors.bank_name
                  ? 'border-rose-300 ring-rose-200'
                  : 'border-slate-200 focus:ring-blue-500'
              }`}
            />
            {errors.bank_name && (
              <p className="text-xs text-rose-500 mt-1" data-testid="bank-name-error">
                {errors.bank_name}
              </p>
            )}
          </div>

          {/* Saldo Inicial / Atual */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {initialData ? 'Saldo da Conta (R$)' : 'Saldo Inicial (R$)'}
            </label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0,00"
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
                errors.balance
                  ? 'border-rose-300 ring-rose-200'
                  : 'border-slate-200 focus:ring-blue-500'
              }`}
            />
            {errors.balance && (
              <p className="text-xs text-rose-500 mt-1">{errors.balance}</p>
            )}
          </div>

          {/* Aviso de conciliação para ajuste manual na edição */}
          {initialData && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Aviso de Conciliação:</strong> Alterar o valor de saldo diretamente ajustará o total sem criar lançamentos no histórico de transações.
              </span>
            </div>
          )}

          {/* Permite Saldo Negativo */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={allowNegativeBalance}
                onChange={(e) => setAllowNegativeBalance(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Permitir que o saldo fique negativo (ex: cheque especial)
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting
                ? 'Salvando...'
                : initialData
                ? 'Atualizar Conta'
                : 'Cadastrar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountFormModal;

