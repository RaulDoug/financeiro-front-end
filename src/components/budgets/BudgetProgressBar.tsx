import React from 'react';
import { getProgressColor } from '../../utils/budgetProgress.ts';

export { getProgressColor };

interface BudgetProgressBarProps {
  percentage: number;
  className?: string;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  percentage,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(percentage, 100));
  const { barClass } = getProgressColor(percentage);

  return (
    <div
      data-testid="budget-progress-bar-container"
      className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden ${className}`}
    >
      <div
        data-testid="budget-progress-bar-fill"
        className={`h-full rounded-full transition-all duration-500 ease-out ${barClass}`}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};
