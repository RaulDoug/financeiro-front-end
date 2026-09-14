import React from 'react';
import { Stepper } from '../../components/onboarding/Stepper.tsx';
import { useOnboardingStore } from '../../stores/onboarding.store.ts';
import { StepWallet } from '../../components/onboarding/steps/StepWallet.tsx';
import { StepBankAccount } from '../../components/onboarding/steps/StepBankAccount.tsx';
import { StepCreditCard } from '../../components/onboarding/steps/StepCreditCard.tsx';

export const OnboardingPage: React.FC = () => {
  const { currentStep } = useOnboardingStore();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 shadow-inner">
          <span className="text-xl font-bold tracking-tight">FF</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Configuração Inicial
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Monte sua estrutura financeira básica para desbloquear o sistema.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <Stepper currentStep={currentStep} />

        <div className="bg-white dark:bg-zinc-900 py-8 px-6 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:px-10">
          {currentStep === 1 && <StepWallet />}
          {currentStep === 2 && <StepBankAccount />}
          {currentStep === 3 && <StepCreditCard />}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
