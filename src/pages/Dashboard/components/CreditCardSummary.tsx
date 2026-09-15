import React from 'react';
import { type CreditCardSummaryItem } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { CreditCard } from 'lucide-react';

interface CreditCardSummaryProps {
  cards?: CreditCardSummaryItem[];
  isLoading?: boolean;
}

export const CreditCardSummary: React.FC<CreditCardSummaryProps> = ({ cards = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm animate-pulse h-64" />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm" data-testid="credit-card-summary">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Cartões de Crédito</h3>
        </div>
      </div>

      <div className="mt-4 divide-y divide-gray-100 dark:divide-slate-800 max-h-56 overflow-y-auto pr-1">
        {cards.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-slate-400 py-4 text-center">Nenhum cartão cadastrado.</p>
        ) : (
          cards.map((card) => (
            <div
              key={card.pay_method_id}
              data-testid={`card-item-${card.pay_method_id}`}
              className="py-3 flex flex-col gap-1 text-sm hover:bg-gray-50 dark:hover:bg-slate-800/60 px-1 rounded transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 dark:text-slate-200">{card.name}</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  Fatura:{' '}
                  <strong className="text-rose-600 dark:text-rose-400 font-semibold">
                    {formatCurrency(card.current_invoice_total)}
                  </strong>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <span>Disponível:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(card.available_limit)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
