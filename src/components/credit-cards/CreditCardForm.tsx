import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bankAccountService, type BankAccountItem } from '../../services/bankAccount.service.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';
import { creditCardSchema } from '../../schemas/creditCardSchema.ts';
import type { CreditCardItem, CreditCardFormData } from '../../types/creditCard.ts';

interface CreditCardFormProps {
  initialData?: CreditCardItem | null;
  onSubmit: (data: CreditCardFormData) => void;
  isSubmitting?: boolean;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  const [name, setName] = useState(initialData?.name || '');
  const [bankAccountId, setBankAccountId] = useState(initialData?.bank_account_id || '');
  const [dueDay, setDueDay] = useState(initialData?.due_day?.toString() || '');
  const [closingDay, setClosingDay] = useState(initialData?.closing_day?.toString() || '');
  const [lastFourDigits, setLastFourDigits] = useState(initialData?.last_four_digits || '');
  const [creditLimit, setCreditLimit] = useState(initialData?.credit_limit?.toString() || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: accountsData = [] } = useQuery({
    queryKey: ['bank-accounts', currentWalletId],
    queryFn: async () => {
      const res = await bankAccountService.getBankAccounts();
      return Array.isArray(res) ? res : res?.item ? [res.item] : [];
    },
    enabled: Boolean(currentWalletId),
  });

  useEffect(() => {
    if (!bankAccountId && accountsData.length > 0 && !initialData) {
      setBankAccountId(accountsData[0].id);
    }
  }, [accountsData, bankAccountId, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rawData = {
      name: name.trim(),
      bank_account_id: bankAccountId,
      due_day: parseInt(dueDay, 10),
      closing_day: parseInt(closingDay, 10),
      last_four_digits: lastFourDigits.trim(),
      credit_limit: parseFloat(creditLimit),
    };

    const validation = creditCardSchema.safeParse(rawData);

    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        formattedErrors[field] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    onSubmit(validation.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="credit-card-form">
      {/* Nome do Cartão */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Nome do Cartão *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Nubank Ultravioleta, Black Itaú..."
          className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
            errors.name ? 'border-rose-300 ring-rose-200' : 'border-slate-200 focus:ring-blue-500'
          }`}
        />
        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
      </div>

      {/* Conta Bancária Associada */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Conta Bancária Associada *
        </label>
        <select
          value={bankAccountId}
          onChange={(e) => setBankAccountId(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
            errors.bank_account_id
              ? 'border-rose-300 ring-rose-200'
              : 'border-slate-200 focus:ring-blue-500'
          }`}
        >
          <option value="">Selecione uma conta bancária</option>
          {accountsData.map((acc: BankAccountItem) => (
            <option key={acc.id} value={acc.id}>
              {acc.bank_name}
            </option>
          ))}
        </select>
        {errors.bank_account_id && (
          <p className="text-xs text-rose-500 mt-1">{errors.bank_account_id}</p>
        )}
      </div>

      {/* Limite de Crédito e 4 Últimos Dígitos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Limite Total (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            min="1"
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
            placeholder="5000,00"
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
              errors.credit_limit
                ? 'border-rose-300 ring-rose-200'
                : 'border-slate-200 focus:ring-blue-500'
            }`}
          />
          {errors.credit_limit && (
            <p className="text-xs text-rose-500 mt-1">{errors.credit_limit}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            4 Últimos Dígitos *
          </label>
          <input
            type="text"
            maxLength={4}
            value={lastFourDigits}
            onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/g, ''))}
            placeholder="1234"
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
              errors.last_four_digits
                ? 'border-rose-300 ring-rose-200'
                : 'border-slate-200 focus:ring-blue-500'
            }`}
          />
          {errors.last_four_digits && (
            <p className="text-xs text-rose-500 mt-1">{errors.last_four_digits}</p>
          )}
        </div>
      </div>

      {/* Dias de Fechamento e Vencimento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Dia de Fechamento (1–31) *
          </label>
          <input
            type="number"
            min={1}
            max={31}
            value={closingDay}
            onChange={(e) => setClosingDay(e.target.value)}
            placeholder="Ex: 5"
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
              errors.closing_day
                ? 'border-rose-300 ring-rose-200'
                : 'border-slate-200 focus:ring-blue-500'
            }`}
          />
          {errors.closing_day && (
            <p className="text-xs text-rose-500 mt-1">{errors.closing_day}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Dia de Vencimento (1–31) *
          </label>
          <input
            type="number"
            min={1}
            max={31}
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            placeholder="Ex: 15"
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
              errors.due_day
                ? 'border-rose-300 ring-rose-200'
                : 'border-slate-200 focus:ring-blue-500'
            }`}
          />
          {errors.due_day && (
            <p className="text-xs text-rose-500 mt-1">{errors.due_day}</p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {isSubmitting
            ? 'Salvando...'
            : initialData
            ? 'Salvar Alterações'
            : 'Cadastrar Cartão'}
        </button>
      </div>
    </form>
  );
};

