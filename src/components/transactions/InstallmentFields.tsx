import React from 'react';

interface Props {
  isInstallment: boolean;
  onToggleInstallment: (enabled: boolean) => void;
  installmentsNumber: number;
  onChangeInstallmentsNumber: (num: number) => void;
  dueDay?: number;
  onChangeDueDay: (day: number) => void;
  firstThisMonth: boolean;
  onChangeFirstThisMonth: (val: boolean) => void;
  isCreditCard: boolean;
  transactionType: 'incomings' | 'expenses' | 'transfers';
}

export const InstallmentFields: React.FC<Props> = ({
  isInstallment,
  onToggleInstallment,
  installmentsNumber,
  onChangeInstallmentsNumber,
  dueDay,
  onChangeDueDay,
  firstThisMonth,
  onChangeFirstThisMonth,
  isCreditCard,
  transactionType,
}) => {
  // AC-055: Alerta se tentar receita recorrente no cartão
  const isBlockedCreditCardIncome = isCreditCard && transactionType === 'incomings' && isInstallment;

  if (transactionType === 'transfers') {
    return null; // AC-017 / regra: transferência não parcela
  }

  return (
    <div className="space-y-3 pt-2 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-700 cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={isInstallment}
            onChange={(e) => onToggleInstallment(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Transação parcelada
        </label>
      </div>

      {isBlockedCreditCardIncome && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
          Não é possível usar cartão de crédito como forma de entrada recorrente ou parcelada.
        </div>
      )}

      {isInstallment && !isBlockedCreditCardIncome && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Qtd. Parcelas *</label>
            <input
              type="number"
              min={2}
              max={72}
              value={installmentsNumber || 2}
              onChange={(e) => onChangeInstallmentsNumber(parseInt(e.target.value, 10) || 2)}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Dia Vencimento (1–31)</label>
            <input
              type="number"
              min={1}
              max={31}
              value={dueDay || 10}
              onChange={(e) => onChangeDueDay(parseInt(e.target.value, 10) || 10)}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
            />
          </div>

          <div className="flex items-center pt-4">
            <label className="text-xs text-gray-600 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={firstThisMonth}
                onChange={(e) => onChangeFirstThisMonth(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              1ª parcela este mês
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

