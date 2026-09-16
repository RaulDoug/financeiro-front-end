import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Edit2,
  Trash2,
  Calendar,
  Wallet,
  Tag,
  CreditCard,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTransactionDetailsModalStore } from '../../stores/transactionDetailsModal.store.ts';
import { transactionService } from '../../services/transactionService.ts';
import { payMethodService } from '../../services/payMethod.service.ts';
import { bankAccountService } from '../../services/bankAccount.service.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';
import { useTransactionMutations } from '../../hooks/useTransactionMutations.ts';
import { useTransactionModalStore } from '../../stores/transactionModal.store.ts';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import type { Transaction } from '../../types/transaction.ts';

export const TransactionDetailsModal: React.FC = () => {
  const { isOpen, transaction: rawTransaction, closeModal, onEditCallback, onDeleteCallback } =
    useTransactionDetailsModalStore();

  const currentWalletId = useWalletStore((state) => state.currentWalletId);
  const { updateMutation } = useTransactionMutations();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const [selectedPayMethodId, setSelectedPayMethodId] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentFormRef = useRef<HTMLDivElement>(null);

  // Consulta detalhada sob demanda caso o item tenha sido aberto via alerta com dados parciais
  const { data: fullTransactionData } = useQuery({
    queryKey: ['transaction-detail', rawTransaction?.id],
    queryFn: () => transactionService.getTransactionById(rawTransaction!.id),
    enabled: Boolean(currentWalletId && isOpen && rawTransaction?.id),
    staleTime: 1000 * 30,
  });

  const transaction: Transaction | null = useMemo(() => {
    if (!rawTransaction) return null;
    if (!fullTransactionData) return rawTransaction;
    return {
      ...rawTransaction,
      ...fullTransactionData,
      status: rawTransaction.status === 'expired' ? 'expired' : (fullTransactionData.status || rawTransaction.status),
    };
  }, [rawTransaction, fullTransactionData]);

  const { data: bankAccountsData = [] } = useQuery({
    queryKey: ['bank-accounts', currentWalletId],
    queryFn: async () => {
      const res = await bankAccountService.getBankAccounts();
      return Array.isArray(res) ? res : res?.items || (res?.item ? [res.item] : []);
    },
    enabled: Boolean(currentWalletId && isOpen),
  });

  const { data: payMethodsData = [] } = useQuery({
    queryKey: ['pay-methods', currentWalletId],
    queryFn: async () => {
      const res = await payMethodService.getPayMethods();
      return Array.isArray(res) ? res : res?.items || (res?.item ? [res.item] : []);
    },
    enabled: Boolean(currentWalletId && isOpen),
  });

  // Sincronizar estados do formulário com a transação ativa
  useEffect(() => {
    if (transaction && isOpen) {
      setPaymentDate(new Date().toISOString().split('T')[0]);
      if (transaction.bank_account_id) {
        setSelectedBankAccountId(transaction.bank_account_id);
      }
      if (transaction.pay_methods_id || (transaction as any).pay_method_id) {
        setSelectedPayMethodId(transaction.pay_methods_id || (transaction as any).pay_method_id);
      }
      setShowPaymentForm(false);
      setPaymentError(null);
    }
  }, [transaction, isOpen]);

  // Se não houver conta selecionada, sugere a primeira conta disponível
  useEffect(() => {
    if (!selectedBankAccountId && bankAccountsData.length > 0) {
      setSelectedBankAccountId(bankAccountsData[0].id);
    }
  }, [bankAccountsData, selectedBankAccountId]);

  // Se não houver método selecionado, sugere o primeiro disponível
  useEffect(() => {
    if (!selectedPayMethodId && payMethodsData.length > 0) {
      setSelectedPayMethodId(payMethodsData[0].id);
    }
  }, [payMethodsData, selectedPayMethodId]);

  if (!isOpen || !transaction) return null;

  const overdueInfo = transactionService.calculateOverdue(transaction.due_date, transaction.status);
  const isIncome = transaction.type === 'incomings' || transaction.type === 'transfer_in';
  const isTransfer =
    transaction.type === 'transfers' ||
    transaction.type === 'transfer_out' ||
    transaction.type === 'transfer_in';

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    const datePart = String(dateStr).split('T')[0];
    const parts = datePart.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    return dateStr;
  };

  const handleEdit = () => {
    const currentTx = transaction;
    closeModal();
    if (onEditCallback) {
      onEditCallback(currentTx);
    } else if (currentTx) {
      const modalType =
        currentTx.type === 'incomings'
          ? 'incomings'
          : currentTx.type === 'transfers'
          ? 'transfers'
          : 'expenses';
      useTransactionModalStore.getState().openModal(modalType, currentTx);
    }
  };

  const handleDelete = () => {
    const currentTx = transaction;
    closeModal();
    if (onDeleteCallback) {
      onDeleteCallback(currentTx);
    }
  };

  const handleTogglePaymentForm = () => {
    const nextState = !showPaymentForm;
    setShowPaymentForm(nextState);
    if (nextState) {
      setTimeout(() => {
        paymentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  };

  const handleConfirmPayment = async () => {
    if (!transaction) return;
    if (!selectedBankAccountId) {
      setPaymentError('Selecione uma conta bancária para efetivar o pagamento.');
      return;
    }
    try {
      setIsProcessing(true);
      setPaymentError(null);
      await updateMutation.mutateAsync({
        id: transaction.id,
        payload: {
          status: 'completed',
          payment_date: paymentDate,
          bank_account_id: selectedBankAccountId,
          ...(selectedPayMethodId ? { pay_methods_id: selectedPayMethodId } : {}),
        },
      });
      setShowPaymentForm(false);
      closeModal();
    } catch (err: any) {
      console.error('Erro ao efetuar pagamento:', err);
      setPaymentError(err?.response?.data?.message || 'Erro ao confirmar pagamento.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      data-testid="transaction-details-modal"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-xl ${
                isIncome
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                  : isTransfer
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Detalhes da Transação</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Informações completas do lançamento</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Fechar"
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Valor de Destaque e Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-gray-500 dark:text-slate-400 block font-medium">Valor</span>
              <span
                data-testid="transaction-details-value"
                className={`text-2xl font-bold tracking-tight ${
                  isIncome
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isTransfer
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isIncome ? '+ ' : isTransfer ? '' : '- '}
                {formatCurrency(Number(transaction.value))}
              </span>
            </div>

            {/* Badges de Tipo e Status */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  transaction.type === 'transfer_in' || isIncome
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                    : isTransfer
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                    : 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300'
                }`}
              >
                {transaction.type === 'transfer_in'
                  ? 'Transferência (Entrada)'
                  : transaction.type === 'transfer_out'
                  ? 'Transferência (Saída)'
                  : isIncome
                  ? 'Receita'
                  : isTransfer
                  ? 'Transferência'
                  : 'Despesa'}
              </span>

              {transaction.status === 'cancelled' ? (
                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs font-medium px-2.5 py-1 rounded-full">
                  <XCircle className="w-3.5 h-3.5" />
                  Cancelada
                </span>
              ) : overdueInfo?.isOverdue ? (
                <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Atrasada ({overdueInfo.daysOverdue}d)
                </span>
              ) : transaction.status === 'expired' ? (
                <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 text-xs font-medium px-2.5 py-1 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Vencida
                </span>
              ) : transaction.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Concluída
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 text-xs font-medium px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  Pendente
                </span>
              )}
            </div>
          </div>

          {/* Descrição e Parcela */}
          <div>
            <span className="text-xs text-gray-500 dark:text-slate-400 block font-medium mb-1">Descrição</span>
            <div className="flex items-center gap-2">
              <span data-testid="transaction-details-description" className="text-base font-semibold text-gray-900 dark:text-white">
                {transaction.description}
              </span>
              {transaction.current_installment && (
                <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/50">
                  Parcela {transaction.current_installment}
                </span>
              )}
            </div>
          </div>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
              <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Data de Vencimento
              </span>
              <span className="font-semibold text-gray-800 dark:text-slate-200">
                {formatDate(transaction.due_date)}
              </span>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
              <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Data de Pagamento
              </span>
              <span className="font-semibold text-gray-800 dark:text-slate-200">
                {formatDate(transaction.payment_date)}
              </span>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
              <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Categoria
              </span>
              <span className="font-semibold text-gray-800 dark:text-slate-200">
                {transaction.category_name || 'Sem categoria'}
              </span>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
              <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                <Wallet className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Conta Bancária
              </span>
              <span className="font-semibold text-gray-800 dark:text-slate-200">
                {transaction.bank_account_name || '—'}
              </span>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
              <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Método de Pagamento
              </span>
              <span className="font-semibold text-gray-800 dark:text-slate-200">
                {transaction.pay_method_name || '—'}
              </span>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
              <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Contraparte / Beneficiário
              </span>
              <span className="font-semibold text-gray-800 dark:text-slate-200">
                {transaction.counterparty_name || '—'}
              </span>
            </div>
          </div>

          {/* Mini-Formulário para Efetuar Pagamento (AC-159 / AC-205..AC-209) */}
          {showPaymentForm && transaction.status !== 'completed' && (
            <div
              ref={paymentFormRef}
              className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
              data-testid="payment-mini-form"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Confirmar Pagamento
                </span>
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              {paymentError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-600 dark:text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Data do Pagamento */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Data do Pagamento *
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    data-testid="payment-date-input"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Conta Bancária (AC-206) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Conta Bancária *
                  </label>
                  <select
                    value={selectedBankAccountId}
                    onChange={(e) => setSelectedBankAccountId(e.target.value)}
                    data-testid="payment-account-select"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Selecione uma conta</option>
                    {bankAccountsData.map((acc: any) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.bank_name || acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Método de Pagamento (AC-207) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={selectedPayMethodId}
                    onChange={(e) => setSelectedPayMethodId(e.target.value)}
                    data-testid="payment-method-select"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Nenhuma / Manter atual</option>
                    {payMethodsData.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  data-testid="btn-confirm-payment"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Confirmando...' : 'Confirmar e Concluir Pagamento'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer com Ações de Edição, Exclusão e Pagamento */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-4 sm:px-5 py-3.5 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800">
          {/* Botão de Pagamento Mobile (Largura total no topo quando pendente) */}
          {transaction.status !== 'completed' && (
            <button
              type="button"
              onClick={handleTogglePaymentForm}
              data-testid="btn-details-pay"
              className="w-full sm:hidden inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Efetuar Pagamento
            </button>
          )}

          {/* Linha de Ações: Excluir à esquerda, Fechar e Editar (+ Pagamento desktop) à direita */}
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={handleDelete}
              data-testid="btn-details-delete"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              Excluir
            </button>

            <div className="flex items-center gap-2">
              {transaction.status !== 'completed' && (
                <button
                  type="button"
                  onClick={handleTogglePaymentForm}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Efetuar Pagamento
                </button>
              )}
              <button
                type="button"
                onClick={closeModal}
                className="px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer whitespace-nowrap"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleEdit}
                data-testid="btn-details-edit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-2xs cursor-pointer whitespace-nowrap"
              >
                <Edit2 className="w-3.5 h-3.5 shrink-0" />
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
