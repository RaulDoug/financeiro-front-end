import React from 'react';
import { type AccountBalanceItem } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { Landmark } from 'lucide-react';
import { detectBankByName } from '../../../lib/bankDetector.ts';

interface AccountBalancesProps {
  accounts?: AccountBalanceItem[];
  totalBalances?: number;
  isLoading?: boolean;
}

export const AccountBalances: React.FC<AccountBalancesProps> = ({
  accounts = [],
  totalBalances,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm animate-pulse h-64" />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm" data-testid="account-balances">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <Landmark className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Saldos por Conta</h3>
        </div>
        {totalBalances !== undefined && (
          <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-full">
            Total: {formatCurrency(totalBalances)}
          </span>
        )}
      </div>

      <div className="mt-4 divide-y divide-gray-100 dark:divide-slate-800 max-h-56 overflow-y-auto pr-1">
        {accounts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-slate-400 py-4 text-center">Nenhuma conta bancária cadastrada.</p>
        ) : (
          accounts.map((acc) => {
            const isNegative = acc.balance < 0;
            const detected = detectBankByName(acc.bank_name);
            const color = (acc as any).color || detected?.primaryColor || '#3b82f6';
            return (
              <div
                key={acc.id}
                data-testid={`account-item-${acc.id}`}
                className="py-2.5 flex items-center justify-between text-sm hover:bg-gray-50 dark:hover:bg-slate-800/60 px-1 rounded transition"
              >
                <div className="flex items-center gap-2 truncate mr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-gray-800 dark:text-slate-200 truncate">{acc.bank_name}</span>
                </div>
                <span className={`font-semibold shrink-0 ${isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                  {formatCurrency(acc.balance)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
