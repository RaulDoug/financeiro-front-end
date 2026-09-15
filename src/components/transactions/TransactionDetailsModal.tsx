import React from 'react';
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
import { useTransactionDetailsModalStore } from '../../stores/transactionDetailsModal.store.ts';
import { transactionService } from '../../services/transactionService.ts';
import { formatCurrency } from '../../utils/formatCurrency.ts';

export const TransactionDetailsModal: React.FC = () => {
  const { isOpen, transaction, closeModal, onEditCallback, onDeleteCallback } =
    useTransactionDetailsModalStore();

  if (!isOpen || !transaction) return null;

  const overdueInfo = transactionService.calculateOverdue(transaction.due_date, transaction.status);
  const isIncome = transaction.type === 'incomings';
  const isTransfer = transaction.type === 'transfers';

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
    }
  };

  const handleDelete = () => {
    const currentTx = transaction;
    closeModal();
    if (onDeleteCallback) {
      onDeleteCallback(currentTx);
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
                  isIncome
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                    : isTransfer
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                    : 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300'
                }`}
              >
                {isIncome ? 'Receita' : isTransfer ? 'Transferência' : 'Despesa'}
              </span>

              {overdueInfo?.isOverdue ? (
                <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Atrasada ({overdueInfo.daysOverdue}d)
                </span>
              ) : transaction.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Concluída
                </span>
              ) : transaction.status === 'pending' ? (
                <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 text-xs font-medium px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  Pendente
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs font-medium px-2.5 py-1 rounded-full">
                  <XCircle className="w-3.5 h-3.5" />
                  Cancelada
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
        </div>

        {/* Footer com Ações de Edição e Exclusão */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleDelete}
            data-testid="btn-details-delete"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleEdit}
              data-testid="btn-details-edit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
