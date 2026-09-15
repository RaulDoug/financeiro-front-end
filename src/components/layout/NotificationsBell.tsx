import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';
import { useTransactionDetailsModalStore } from '../../stores/transactionDetailsModal.store.ts';
import type { OverdueAlertItem } from '../../types/dashboard.ts';
import type { Transaction } from '../../types/transaction.ts';

export interface NotificationsBellProps {
  count?: number;
  onClick?: () => void;
}

export const NotificationsBell: React.FC<NotificationsBellProps> = ({
  count: externalCount,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const storeWalletId = useWalletStore((state) => state.currentWalletId);
  const currentWalletId =
    storeWalletId ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('active_wallet_id') : null);

  const { data: alertsData } = useQuery({
    queryKey: ['overdue-alerts', currentWalletId],
    queryFn: () => dashboardService.getOverdueAlerts(),
    enabled: Boolean(currentWalletId),
  });

  const queryCount =
    alertsData?.overdueAlerts?.items?.length ??
    alertsData?.overdueAlerts?.total_overdue;

  const count = externalCount !== undefined ? externalCount : (queryCount ?? 0);
  const overdueList: OverdueAlertItem[] = alertsData?.overdueAlerts?.items || [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
    if (onClick) onClick();
    setIsOpen((prev) => !prev);
  };

  const handleSelectOverdueItem = (item: OverdueAlertItem) => {
    setIsOpen(false);
    const tx: Transaction = {
      id: item.id,
      description: item.description,
      value: String(item.value),
      due_date: item.due_date,
      type: (item.type as any) || 'expenses',
      status: 'pending',
      payment_date: null,
      purchase_date: null,
      transfers_id: null,
      invoice_id: null,
      current_installment: null,
      bank_account_name: '',
      category_name: null,
      pay_method_name: '',
      counterparty_name: null,
      creator_user_name: '',
      created_at: '',
    };
    useTransactionDetailsModalStore.getState().openModal(tx);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Notificações"
        data-testid="notifications-bell"
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span
            data-testid="notifications-badge"
            className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900"
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          data-testid="notifications-popover"
          className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Notificações</span>
            {count > 0 && (
              <span className="text-[11px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-full">
                {count} pendência{count > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto px-2 py-2 space-y-1.5">
            {count === 0 ? (
              <div className="py-6 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tudo em dia!</p>
                <p className="text-[11px] text-slate-400">Nenhum pagamento em atraso nesta carteira.</p>
              </div>
            ) : (
              overdueList.map((item) => (
                <div
                  key={item.id}
                  data-testid={`overdue-item-${item.id}`}
                  onClick={() => handleSelectOverdueItem(item)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-start gap-2.5 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Venceu há {item.days_overdue} {item.days_overdue === 1 ? 'dia' : 'dias'} • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.value) || 0)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 px-3 border-t border-slate-100 dark:border-slate-800">
            {/* to="/transacoes" */}
            <Link
              to="/transactions?status=expired"
              data-testid="link-view-overdue"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver transações vencidas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
