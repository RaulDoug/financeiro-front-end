import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.ts';

interface AccountsTotalizerProps {
  total: number;
  accountsCount: number;
  isLoading?: boolean;
}

export const AccountsTotalizer: React.FC<AccountsTotalizerProps> = ({
  total,
  accountsCount,
  isLoading = false,
}) => {
  const isNegative = total < 0;

  if (isLoading) {
    return (
      <div className="h-28 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
    );
  }

  return (
    <div
      data-testid="accounts-totalizer"
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Saldo Consolidado em Contas
          </span>
          <span
            data-testid="total-balance-value"
            className={`text-3xl font-bold tracking-tight mt-0.5 block ${
              isNegative ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600">
        {isNegative ? (
          <TrendingDown className="w-4 h-4 text-rose-500" />
        ) : (
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        )}
        <span>
          <strong className="text-slate-900 font-semibold">{accountsCount}</strong>{' '}
          {accountsCount === 1 ? 'conta cadastrada' : 'contas cadastradas'}
        </span>
      </div>
    </div>
  );
};

export default AccountsTotalizer;

