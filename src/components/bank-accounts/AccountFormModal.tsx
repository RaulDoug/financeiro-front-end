import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle } from 'lucide-react';
import { bankAccountSchema } from '../../schemas/bankAccountSchema.ts';
import type { BankAccountItem, BankAccountFormData } from '../../types/bankAccount.ts';
import { detectBankByName, BRAZILIAN_BANKS, type BankInfo } from '../../lib/bankDetector.ts';
import { BankPicker } from '../shared/BankPicker.tsx';
import { useModalTransition } from '../../hooks/useModalTransition.ts';

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
  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen,
    duration: 200,
    onClose,
  });

  const [bankName, setBankName] = useState(initialData?.bank_name || '');
  const [balance, setBalance] = useState(
    initialData ? String(initialData.balance ?? 0) : '0'
  );
  const [allowNegativeBalance, setAllowNegativeBalance] = useState(
    initialData?.allow_negative_balance ?? false
  );
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(() => {
    if (initialData?.color) {
      return (
        BRAZILIAN_BANKS.find(
          (b) => b.primaryColor === initialData.color || b.icon === initialData.icon
        ) || null
      );
    }
    return initialData?.bank_name ? detectBankByName(initialData.bank_name) : null;
  });
  const [autoDetected, setAutoDetected] = useState<BankInfo | null>(() =>
    initialData?.bank_name ? detectBankByName(initialData.bank_name) : null
  );
  const [hasManualSelection, setHasManualSelection] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setBankName(initialData.bank_name || '');
      setBalance(String(initialData.balance ?? 0));
      setAllowNegativeBalance(Boolean(initialData.allow_negative_balance));
      const detected = initialData.bank_name ? detectBankByName(initialData.bank_name) : null;
      setAutoDetected(detected);
      const match = initialData.color
        ? BRAZILIAN_BANKS.find((b) => b.primaryColor === initialData.color)
        : detected;
      setSelectedBank(match || detected);
      setHasManualSelection(Boolean(initialData.color && !detected));
    } else {
      setBankName('');
      setBalance('0');
      setAllowNegativeBalance(false);
      setSelectedBank(null);
      setAutoDetected(null);
      setHasManualSelection(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRendered, triggerClose]);

  const handleBankNameChange = (val: string) => {
    setBankName(val);
    const detected = detectBankByName(val);
    setAutoDetected(detected);
    if (detected && !hasManualSelection) {
      setSelectedBank(detected);
    }
  };

  const handleSelectBank = (bank: BankInfo) => {
    setSelectedBank(bank);
    setHasManualSelection(true);
  };

  if (!isRendered) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedBalance = parseFloat(String(balance).replace(',', '.'));
    const rawData = {
      bank_name: bankName.trim(),
      balance: isNaN(parsedBalance) ? 0 : parsedBalance,
      allow_negative_balance: allowNegativeBalance,
      icon: selectedBank?.icon || autoDetected?.icon || 'landmark',
      color: selectedBank?.primaryColor || autoDetected?.primaryColor || '#3b82f6',
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

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-scrollbar ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      data-testid="account-form-modal"
      onClick={triggerClose}
    >
      <div
        className={`bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">
            {initialData ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
          </h2>
          <button
            type="button"
            onClick={triggerClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1" data-testid="bank-account-form">
          {/* Nome do Banco */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome da Instituição / Banco *
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => handleBankNameChange(e.target.value)}
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

          {/* Auto-detecção e Seleção Manual de Banco (AC-175, AC-176, AC-177) */}
          <BankPicker
            selectedBankId={selectedBank?.id}
            autoDetectedBank={autoDetected}
            onSelectBank={handleSelectBank}
          />

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

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default AccountFormModal;

