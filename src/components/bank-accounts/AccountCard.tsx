import React from 'react';
import { Building2, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import type { BankAccountItem } from '../../types/bankAccount.ts';
import { detectBankByName } from '../../lib/bankDetector.ts';
import { renderLucideIcon } from '../shared/IconPicker.tsx';

interface AccountCardProps {
  account: BankAccountItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  const numericBalance =
    typeof account.balance === 'string' ? parseFloat(account.balance) : Number(account.balance ?? 0);
  const isNegative = numericBalance < 0;

  const detected = !account.color ? detectBankByName(account.bank_name) : null;
  const effectiveColor = account.color || detected?.primaryColor;
  const effectiveIcon = account.icon || detected?.icon;

  return (
    <div
      data-testid={`bank-account-card-${account.id}`}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            data-testid={`bank-icon-${account.id}`}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs"
            style={{
              backgroundColor: effectiveColor ? `${effectiveColor}20` : '#eff6ff',
              color: effectiveColor || '#2563eb',
            }}
          >
            {effectiveIcon && renderLucideIcon(effectiveIcon, 'w-5 h-5') ? (
              renderLucideIcon(effectiveIcon, 'w-5 h-5')
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-900 leading-tight">{account.bank_name}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Conta Corrente</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Editar conta"
            data-testid="edit-account-button"
            onClick={onEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Excluir conta"
            data-testid="delete-account-button"
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-end justify-between">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">
            Saldo Atual
          </span>
          <span
            data-testid="account-balance"
            className={`text-2xl font-bold tracking-tight ${
              isNegative ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {formatCurrency(numericBalance)}
          </span>
        </div>

        {/* Badge de saldo negativo */}
        {account.allow_negative_balance && (
          <span
            data-testid="negative-balance-badge"
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
              isNegative
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isNegative && <AlertCircle className="w-3 h-3" />}
            Permite saldo negativo
          </span>
        )}
      </div>
    </div>
  );
};

export default AccountCard;

