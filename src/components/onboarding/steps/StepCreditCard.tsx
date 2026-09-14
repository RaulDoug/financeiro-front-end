import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, ArrowLeft, Loader2, SkipForward } from 'lucide-react';
import { payMethodService } from '../../../services/payMethod.service.ts';
import { useWalletStore } from '../../../stores/wallet.store.ts';
import { useAuthStore } from '../../../stores/auth.store.ts';
import { useOnboardingStore } from '../../../stores/onboarding.store.ts';

const creditCardSchema = z.object({
  name: z.string().min(2, 'O apelido do cartão deve ter no mínimo 2 caracteres'),
  credit_limit: z.string().min(1, 'Informe o limite de crédito'),
  closing_day: z.coerce.number().int().min(1, 'Dia entre 1 e 31').max(31, 'Dia entre 1 e 31'),
  due_day: z.coerce.number().int().min(1, 'Dia entre 1 e 31').max(31, 'Dia entre 1 e 31'),
  last_four_digits: z.string().regex(/^\d{4}$/, 'Informe exatamente 4 dígitos numéricos'),
});

type CreditCardFormData = z.infer<typeof creditCardSchema>;

export const StepCreditCard: React.FC = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    createdWalletId,
    createdBankAccountId,
    setCurrentStep,
    resetOnboarding,
  } = useOnboardingStore();

  const { currentWalletId, setCurrentWalletId } = useWalletStore();
  const { setActiveWalletId } = useAuthStore();

  const effectiveWalletId = createdWalletId || currentWalletId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      name: '',
      credit_limit: '',
      closing_day: 5,
      due_day: 12,
      last_four_digits: '',
    },
  });

  const finalizeOnboarding = () => {
    if (effectiveWalletId) {
      setCurrentWalletId(effectiveWalletId);
      setActiveWalletId(effectiveWalletId);
    }
    resetOnboarding();
    navigate('/dashboard');
  };

  const onSubmit = async (data: CreditCardFormData) => {
    try {
      setApiError(null);
      const limit = parseFloat(data.credit_limit.replace(',', '.'));

      await payMethodService.registerPayMethod(
        {
          name: data.name,
          credit_card: true,
          bank_account_id: createdBankAccountId || undefined,
          credit_limit: isNaN(limit) ? 0 : limit,
          closing_day: data.closing_day,
          due_day: data.due_day,
          last_four_digits: data.last_four_digits,
        },
        effectiveWalletId || undefined
      );

      finalizeOnboarding();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Erro ao cadastrar cartão de crédito. Tente novamente.';
      setApiError(message);
    }
  };

  const handleSkip = () => {
    finalizeOnboarding();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              Deseja cadastrar um cartão de crédito?
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
              Opcional
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Acompanhe faturas, limites disponíveis e controle de compras parceladas.
          </p>
        </div>
      </div>

      {apiError && (
        <div className="p-3.5 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="card-name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Apelido do Cartão
          </label>
          <input
            id="card-name"
            type="text"
            placeholder="Ex: Nubank Roxinho, Cartão Black..."
            {...register('name')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="card-limit"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Limite Total (R$)
            </label>
            <input
              id="card-limit"
              type="number"
              step="0.01"
              placeholder="5000,00"
              {...register('credit_limit')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
            {errors.credit_limit && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.credit_limit.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="card-digits"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Últimos 4 dígitos
            </label>
            <input
              id="card-digits"
              type="text"
              maxLength={4}
              placeholder="1234"
              {...register('last_four_digits')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
            {errors.last_four_digits && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.last_four_digits.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="closing-day"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Dia de Fechamento
            </label>
            <input
              id="closing-day"
              type="number"
              min={1}
              max={31}
              {...register('closing_day')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
            {errors.closing_day && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.closing_day.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="due-day"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Dia de Vencimento
            </label>
            <input
              id="due-day"
              type="number"
              min={1}
              max={31}
              {...register('due_day')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
            {errors.due_day && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.due_day.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <SkipForward className="w-4 h-4" />
            Pular esta etapa
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finalizando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Finalizar e Acessar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepCreditCard;
