import React from 'react';
import { type AccountBalanceItem } from '../../../types/dashboard.ts';
import { formatCurrency } from '../../../utils/formatCurrency.ts';
import { Landmark } from 'lucide-react';

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
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-pulse h-64" />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm" data-testid="account-balances">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Landmark className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Saldos por Conta</h3>
        </div>
        {totalBalances !== undefined && (
          <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
            Total: {formatCurrency(totalBalances)}
          </span>
        )}
      </div>

      <div className="mt-4 divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
        {accounts.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">Nenhuma conta bancária cadastrada.</p>
        ) : (
          accounts.map((acc) => {
            const isNegative = acc.balance < 0;
            return (
              <div
                key={acc.id}
                data-testid={`account-item-${acc.id}`}
                className="py-2.5 flex items-center justify-between text-sm hover:bg-gray-50 px-1 rounded transition"
              >
                <span className="font-medium text-gray-800 truncate mr-2">{acc.bank_name}</span>
                <span className={`font-semibold shrink-0 ${isNegative ? 'text-rose-600' : 'text-gray-900'}`}>
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
