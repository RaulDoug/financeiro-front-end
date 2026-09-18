import React from 'react';

interface Props {
  isInstallment: boolean;
  onToggleInstallment: (enabled: boolean) => void;
  isRecurrent?: boolean;
  onChangeIsRecurrent?: (recurrent: boolean) => void;
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
  isRecurrent = false,
  onChangeIsRecurrent,
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
    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={isInstallment}
            onChange={(e) => onToggleInstallment(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Transação parcelada / recorrente
        </label>
      </div>

      {isBlockedCreditCardIncome && (
        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg text-xs text-rose-700 dark:text-rose-400">
          Não é possível usar cartão de crédito como forma de entrada recorrente ou parcelada.
        </div>
      )}

      {isInstallment && !isBlockedCreditCardIncome && (
        <div className="space-y-3 p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg border border-gray-100 dark:border-slate-700">
          {/* Opção de Modo: Dividir vs Repetir */}
          <div>
            <span className="block text-[11px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Tipo de lançamento:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                data-testid="mode-split-label"
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                  !isRecurrent
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 font-medium'
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="installmentMode"
                  checked={!isRecurrent}
                  onChange={() => onChangeIsRecurrent?.(false)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold">Dividir valor</div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400">Divide o valor total entre as parcelas</div>
                </div>
              </label>

              <label
                data-testid="mode-recurrent-label"
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                  isRecurrent
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 font-medium'
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="installmentMode"
                  checked={Boolean(isRecurrent)}
                  onChange={() => onChangeIsRecurrent?.(true)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold">Repetir valor (Recorrente)</div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400">Mesmo valor todo mês (ex: assinatura, aluguel)</div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-slate-400 mb-1">
                {isRecurrent ? 'Qtd. Meses / Ocorrências *' : 'Qtd. Parcelas *'}
              </label>
              <input
                type="number"
                min={2}
                max={72}
                value={installmentsNumber || 2}
                onChange={(e) => onChangeInstallmentsNumber(parseInt(e.target.value, 10) || 2)}
                className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-slate-400 mb-1">Dia Vencimento (1–31)</label>
              <input
                type="number"
                min={1}
                max={31}
                value={dueDay || 10}
                onChange={(e) => onChangeDueDay(parseInt(e.target.value, 10) || 10)}
                className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center pt-4">
              <label className="text-xs text-gray-600 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer">
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
        </div>
      )}
    </div>
  );
};
