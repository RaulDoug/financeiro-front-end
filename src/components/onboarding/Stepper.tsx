import React from 'react';
import { Wallet, Building2, CreditCard, Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Carteira',
    subtitle: 'Espaço financeiro',
    icon: Wallet,
  },
  {
    id: 2,
    title: 'Conta Bancária',
    subtitle: 'Saldo e banco',
    icon: Building2,
  },
  {
    id: 3,
    title: 'Cartão de Crédito',
    subtitle: 'Opcional',
    icon: CreditCard,
  },
];

interface StepperProps {
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-zinc-200 dark:bg-zinc-800 -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 transition-all duration-300 -z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 font-semibold text-sm ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : isActive
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20 shadow-md'
                    : 'bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
              </div>

              <div className="text-center mt-2">
                <p
                  className={`text-xs font-semibold ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : isCompleted
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-400'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-zinc-400 hidden sm:block">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
