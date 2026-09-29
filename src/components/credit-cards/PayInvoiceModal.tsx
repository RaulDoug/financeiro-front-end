import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Building2, Calendar, CreditCard, Loader2 } from 'lucide-react';
import { useModalTransition } from '../../hooks/useModalTransition.ts';
import { useBankAccounts } from '../../hooks/useBankAccounts.ts';
import { useTransactionMutations } from '../../hooks/useTransactionMutations.ts';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import type { CreditCardItem, CreditCardTransaction } from '../../types/creditCard.ts';

interface PayInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCardItem;
  targetTransaction: CreditCardTransaction | null;
  invoiceTotal: number;
  pendingCount: number;
  selectedDate: Date;
  onSuccess?: (result: any) => void;
}

export const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({
  isOpen,
  onClose,
  card,
  targetTransaction,
  invoiceTotal,
  pendingCount,
  selectedDate,
  onSuccess,
}) => {
  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen: isOpen && Boolean(targetTransaction),
    duration: 200,
    onClose,
  });

  const { data: accounts = [], isLoading: isLoadingAccounts } = useBankAccounts();
  const { updateMutation } = useTransactionMutations();

  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inicializa a conta bancária padrão
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      const defaultAccountId =
        targetTransaction?.bank_account_id ||
        card.bank_account_id ||
        (accounts.length > 0 ? accounts[0].id : '');
      setSelectedBankAccountId(defaultAccountId);
    }
  }, [isOpen, targetTransaction, card.bank_account_id, accounts]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRendered, triggerClose]);

  if (!isRendered || !targetTransaction) return null;

  const selectedAccount = accounts.find((acc) => acc.id === selectedBankAccountId);
  const accountBalance = selectedAccount ? Number(selectedAccount.balance) : 0;
  const isBalanceInsufficient =
    selectedAccount &&
    !selectedAccount.allow_negative_balance &&
    accountBalance < invoiceTotal;

  const formattedMonth = selectedDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  const capitalizedMonth = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

  const handleConfirmPayment = async () => {
    if (!targetTransaction) return;

    if (!selectedBankAccountId) {
      setErrorMessage('Selecione uma conta bancária para debitar o pagamento.');
      return;
    }

    try {
      setErrorMessage(null);
      const result = await updateMutation.mutateAsync({
        id: targetTransaction.id,
        payload: {
          status: 'completed',
          total_invoice: true,
          bank_account_id: selectedBankAccountId,
        },
      });

      if (onSuccess) {
        onSuccess(result);
      }
      triggerClose();
    } catch (err: any) {
      console.error('Erro ao pagar fatura:', err);
      const apiMessage = err?.response?.data?.message || err?.message;

      if (
        apiMessage?.includes('saldo suficiente') ||
        apiMessage === 'Conta bancária sem saldo suficiente para realizar a transação'
      ) {
        setErrorMessage('Conta bancária sem saldo suficiente para realizar a transação.');
      } else if (
        apiMessage?.includes('não possui fatura') ||
        apiMessage === 'A transação informada não possui fatura vinculada'
      ) {
        setErrorMessage('A transação informada não possui fatura vinculada.');
      } else {
        setErrorMessage(apiMessage || 'Erro ao processar o pagamento da fatura.');
      }
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-scrollbar ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      data-testid="pay-invoice-modal"
      onClick={triggerClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 my-auto ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pagar Fatura</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {card.name} (final {card.last_four_digits})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={triggerClose}
            data-testid="pay-invoice-close-button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback de Erro de Negócio */}
        {errorMessage && (
          <div
            data-testid="pay-invoice-error"
            className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 font-bold ml-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Resumo da Fatura */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Fatura de Referência
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {capitalizedMonth}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <CreditCard className="w-3.5 h-3.5" />
              Lançamentos a Liquidar
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {pendingCount} {pendingCount === 1 ? 'compra pendente' : 'compras pendentes'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Total a Pagar
            </span>
            <span
              className="text-xl font-extrabold text-slate-900 dark:text-white"
              data-testid="pay-invoice-modal-total"
            >
              {formatCurrency(invoiceTotal)}
            </span>
          </div>
        </div>

        {/* Seletor de Conta Bancária */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            Conta Bancária para Débito
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            O valor total da fatura será debitado do saldo da conta escolhida.
          </p>

          {isLoadingAccounts ? (
            <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ) : (
            <select
              value={selectedBankAccountId}
              onChange={(e) => setSelectedBankAccountId(e.target.value)}
              data-testid="pay-invoice-account-select"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-colors"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.bank_name} — Saldo: {formatCurrency(Number(acc.balance))}
                </option>
              ))}
            </select>
          )}

          {isBalanceInsufficient && (
            <div
              data-testid="pay-invoice-insufficient-warning"
              className="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Atenção: O saldo atual desta conta ({formatCurrency(accountBalance)}) é inferior ao valor da fatura.
              </span>
            </div>
          )}
        </div>

        {/* Rodapé / Ações */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={triggerClose}
            disabled={updateMutation.isPending}
            data-testid="pay-invoice-cancel-button"
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={updateMutation.isPending || !selectedBankAccountId}
            data-testid="pay-invoice-confirm-button"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Pagamento</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
