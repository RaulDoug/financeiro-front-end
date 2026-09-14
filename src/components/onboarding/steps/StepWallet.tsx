import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, ArrowRight, Loader2 } from 'lucide-react';
import { walletService } from '../../../services/wallet.service.ts';
import { useWalletStore } from '../../../stores/wallet.store.ts';
import { useOnboardingStore } from '../../../stores/onboarding.store.ts';

const walletSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
});

type WalletFormData = z.infer<typeof walletSchema>;

export const StepWallet: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const { draftWalletName, setDraftWallet, setCreatedWallet, setCurrentStep } = useOnboardingStore();
  const { addWallet } = useWalletStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WalletFormData>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: draftWalletName || '',
    },
  });

  const onSubmit = async (data: WalletFormData) => {
    try {
      setApiError(null);
      setDraftWallet(data.name);

      const response = await walletService.registerWallet({ name: data.name });

      if (response?.wallet) {
        addWallet(response.wallet);
        setCreatedWallet(response.wallet.id, response.wallet.name);
        setCurrentStep(2);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Erro ao criar carteira. Tente novamente.';
      setApiError(message);
    }
  };

  const handleSuggestion = (name: string) => {
    setValue('name', name, { shouldValidate: true });
    setDraftWallet(name);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-500" />
          Como devemos chamar seu espaço financeiro?
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          A carteira é o ambiente central onde todas as suas contas, faturas e transações ficam agrupadas.
        </p>
      </div>

      {apiError && (
        <div className="p-3.5 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="wallet-name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Nome da Carteira
          </label>
          <input
            id="wallet-name"
            type="text"
            placeholder="Ex: Finanças Pessoais, Familiar..."
            {...register('name')}
            onChange={(e) => {
              register('name').onChange(e);
              setDraftWallet(e.target.value);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <span className="text-xs font-medium text-zinc-400 block mb-2">
            Sugestões rápidas:
          </span>
          <div className="flex flex-wrap gap-2">
            {['Finanças Pessoais', 'Casa & Família', 'Empresa / PJ', 'Investimentos'].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando carteira...
              </>
            ) : (
              <>
                Continuar para Contas
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepWallet;
