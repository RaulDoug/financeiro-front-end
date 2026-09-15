import React, { useState } from 'react';
import { InvoiceMonthSelector } from './InvoiceMonthSelector.tsx';
import { TransactionList } from './TransactionList.tsx';
import { useCreditCardSummary } from '../../hooks/useCreditCards.ts';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import type { CreditCardItem } from '../../types/creditCard.ts';

interface InvoiceSummaryProps {
  card: CreditCardItem;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ card }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

      {/* KPI Cards: Total da Fatura e Limite Disponível */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total da Fatura
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1" data-testid="invoice-total">
            {formatCurrency(invoiceTotal)}
          </p>
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
    </div>
  );
};

