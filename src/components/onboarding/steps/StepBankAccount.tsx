import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { bankAccountService } from '../../../services/bankAccount.service.ts';
import { useWalletStore } from '../../../stores/wallet.store.ts';
import { useOnboardingStore } from '../../../stores/onboarding.store.ts';

const bankAccountSchema = z.object({
  bank_name: z.string().min(2, 'O nome do banco deve ter no mínimo 2 caracteres'),
  balance: z.string().optional(),
  allow_negative_balance: z.boolean(),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

const popularBanks = [
  'Nubank',
  'Itaú',
  'Bradesco',
  'Banco do Brasil',
  'Santander',
  'Inter',
  'C6 Bank',
  'Caixa',
];

export const StepBankAccount: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    createdWalletId,
    draftBankName,
    draftBalance,
    draftAllowNegativeBalance,
    setDraftBankAccount,
    setCreatedBankAccount,
    setCurrentStep,
  } = useOnboardingStore();

  const { currentWalletId } = useWalletStore();
  const effectiveWalletId = createdWalletId || currentWalletId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bank_name: draftBankName || '',
      balance: draftBalance || '',
      allow_negative_balance: draftAllowNegativeBalance || false,
    },
  });

  const onSubmit = async (data: BankAccountFormData) => {
    try {
      setApiError(null);
      setDraftBankAccount({
        bank_name: data.bank_name,
        balance: data.balance,
        allow_negative_balance: data.allow_negative_balance,
      });

      // Se o saldo for omitido ou vazio, assume 0
      const parsedBalance =
        data.balance && data.balance.trim() !== ''
          ? parseFloat(data.balance.replace(',', '.'))
          : 0;

      const response = await bankAccountService.registerBankAccount(
        {
          bank_name: data.bank_name,
          balance: isNaN(parsedBalance) ? 0 : parsedBalance,
          allow_negative_balance: Boolean(data.allow_negative_balance),
        },
        effectiveWalletId || undefined
      );

      if (response?.item) {
        setCreatedBankAccount(response.item.id);
        setCurrentStep(3);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Erro ao criar conta bancária. Tente novamente.';
      setApiError(message);
    }
  };

  const selectBank = (name: string) => {
    setValue('bank_name', name, { shouldValidate: true });
    setDraftBankAccount({ bank_name: name });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-500" />
          Qual é a sua principal conta bancária?
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Cadastre seu banco para controlar saldo corrente, depósitos e pagamentos.
        </p>
      </div>

      {apiError && (
        <div className="p-3.5 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400">
          {apiError}
        </div>
      )}

      <div>
        <span className="text-xs font-medium text-zinc-400 block mb-2">
          Bancos mais comuns:
        </span>
        <div className="flex flex-wrap gap-2">
          {popularBanks.map((bank) => (
            <button
              key={bank}
              type="button"
              onClick={() => selectBank(bank)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              {bank}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="bank-name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Nome do Banco / Instituição
          </label>
          <input
            id="bank-name"
            type="text"
            placeholder="Ex: Nubank, Itaú..."
            {...register('bank_name')}
            onChange={(e) => {
              register('bank_name').onChange(e);
              setDraftBankAccount({ bank_name: e.target.value });
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
          {errors.bank_name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.bank_name.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="bank-balance"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Saldo Inicial (R$)
            </label>
            <span className="text-xs text-zinc-400">Opcional (padrão: R$ 0,00)</span>
          </div>
          <input
            id="bank-balance"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register('balance')}
            onChange={(e) => {
              register('balance').onChange(e);
              setDraftBankAccount({ balance: e.target.value });
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            id="allow-negative"
            type="checkbox"
            {...register('allow_negative_balance')}
            onChange={(e) => {
              register('allow_negative_balance').onChange(e);
              setDraftBankAccount({ allow_negative_balance: e.target.checked });
            }}
            className="w-4 h-4 text-emerald-600 rounded border-zinc-300 dark:border-zinc-700 focus:ring-emerald-500 cursor-pointer"
          />
          <label
            htmlFor="allow-negative"
            className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none"
          >
            Permitir saldo negativo (limite de cheque especial)
          </label>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cadastrando conta...
              </>
            ) : (
              <>
                Continuar para Cartão
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepBankAccount;
