import React from 'react';
import { type OverdueAlertItem } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { formatDate } from '../../../utils/formatDate.ts';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface OverdueAlertsProps {
  alerts?: OverdueAlertItem[];
  totalOverdue?: number;
  isLoading?: boolean;
}

export const OverdueAlerts: React.FC<OverdueAlertsProps> = ({
  alerts = [],
  totalOverdue = 0,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-pulse h-64" />
    );
  }

  const hasOverdue = totalOverdue > 0 || alerts.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm" data-testid="overdue-alerts">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              hasOverdue ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {hasOverdue ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900">Alertas de Vencimento</h3>
        </div>
        {hasOverdue && (
          <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">
            {totalOverdue || alerts.length} em atraso
          </span>
        )}
      </div>

      <div className="mt-4">
        {!hasOverdue ? (
          <div className="py-8 text-center" data-testid="all-in-order-state">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">Tudo em dia!</p>
            <p className="text-xs text-gray-500 mt-0.5">Nenhuma pendência ou conta vencida.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1" data-testid="overdue-list">
            {alerts.map((item) => (
              <div
                key={item.id}
                data-testid={`overdue-item-${item.id}`}
                className="py-2.5 flex items-center justify-between text-sm hover:bg-rose-50/50 px-1 rounded transition"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-medium text-gray-900 truncate">{item.description}</span>
                  <span className="text-xs text-rose-600 font-semibold">
                    {item.days_overdue} {item.days_overdue === 1 ? 'dia' : 'dias'} em atraso (Venceu em {formatDate(item.due_date)})
                  </span>
                </div>
                <span className="font-bold text-rose-700 shrink-0">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
