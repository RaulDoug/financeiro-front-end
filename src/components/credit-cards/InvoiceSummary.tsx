import React, { useState } from 'react';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { InvoiceMonthSelector } from './InvoiceMonthSelector.tsx';
import { TransactionList } from './TransactionList.tsx';
import { PayInvoiceModal } from './PayInvoiceModal.tsx';
import { useCreditCardSummary } from '../../hooks/useCreditCards.ts';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import type { CreditCardItem } from '../../types/creditCard.ts';

interface InvoiceSummaryProps {
  card: CreditCardItem;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ card }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Calcular startDate e endDate para o mês selecionado
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDate = firstDay.toISOString().split('T')[0];
  const endDate = lastDay.toISOString().split('T')[0];

  const { data: summaryList = [], isLoading } = useCreditCardSummary({
    startDate,
    endDate,
  });

  const cardSummary = summaryList.find((s) => s.pay_method_id === card.id);

  const invoiceTotal = cardSummary?.current_invoice_total ?? card.used_credit_limit ?? 0;
  const availableLimit =
    cardSummary?.available_limit ?? Math.max(0, card.credit_limit - invoiceTotal);
  const transactions = cardSummary?.transactions || [];

  const pendingTransactions = transactions.filter((tx) => tx.status !== 'completed');
  const isAllPaid = transactions.length > 0 && pendingTransactions.length === 0;
  const hasPendingTransactions = pendingTransactions.length > 0;
  const targetTransaction = pendingTransactions[0] || transactions[0] || null;

  const handlePaymentSuccess = (result: any) => {
    const totalPaid = result?.item?.totalValueSum;
    const formattedTotal = totalPaid !== undefined ? formatCurrency(totalPaid) : formatCurrency(invoiceTotal);
    setSuccessMessage(`Fatura quitada com sucesso! Total liquidado: ${formattedTotal}.`);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6"
      data-testid="invoice-summary-container"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Detalhamento da Fatura</h3>
          <p className="text-xs text-slate-500">Cartão: {card.name} (final {card.last_four_digits})</p>
        </div>
        <InvoiceMonthSelector currentDate={selectedDate} onChange={setSelectedDate} />
      </div>

      {/* Banner de Sucesso */}
      {successMessage && (
        <div
          data-testid="invoice-payment-success-banner"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold cursor-pointer ml-4"
          >
            Fechar
          </button>
        </div>
      )}

      {/* KPI Cards: Total da Fatura e Limite Disponível */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total da Fatura
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1" data-testid="invoice-total">
                {formatCurrency(invoiceTotal)}
              </p>
            </div>

            {/* Ação ou Status do Pagamento */}
            {isAllPaid ? (
              <span
                data-testid="paid-invoice-badge"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Fatura Paga
              </span>
            ) : hasPendingTransactions ? (
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage(null);
                  setIsPayModalOpen(true);
                }}
                data-testid="pay-invoice-button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pagar Fatura
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium self-center">
                Sem compras na fatura
              </span>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {transactions.length === 0
                ? 'Nenhum lançamento no período'
                : `${pendingTransactions.length} de ${transactions.length} pendentes`}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Limite Disponível
            </span>
            <p className="text-2xl font-bold text-emerald-600 mt-1" data-testid="available-limit">
              {formatCurrency(availableLimit)}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500" data-testid="invoice-dates-info">
            <span>Vencimento dia <strong className="text-slate-700 font-semibold">{card.due_day}</strong></span>
            {card.closing_day && (
              <span>Fecha dia <strong className="text-slate-700 font-semibold">{card.closing_day}</strong></span>
            )}
          </div>
        </div>
      </div>

      {/* Transações da Fatura */}
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-2">Transações Desta Fatura</h4>
        <TransactionList transactions={transactions} isLoading={isLoading} />
      </div>

      {/* Modal de Pagamento da Fatura */}
      <PayInvoiceModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        card={card}
        targetTransaction={targetTransaction}
        invoiceTotal={invoiceTotal}
        pendingCount={pendingTransactions.length}
        selectedDate={selectedDate}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};


