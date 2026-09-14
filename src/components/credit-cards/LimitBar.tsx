import React from 'react';
import { creditCardService } from '../../services/api/creditCards.ts';

interface LimitBarProps {
  used: number;
  total: number;
  showLabels?: boolean;
}

export const LimitBar: React.FC<LimitBarProps> = ({ used, total, showLabels = false }) => {
  const { percentage, status, colorClass } = creditCardService.calculateLimitStatus(used, total);

  const getBarColorClass = () => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'critical':
        return 'bg-rose-500';
      default:
        return 'bg-emerald-500';
    }
  };

  const statusLabel =
    status === 'healthy' ? 'Saudável' : status === 'warning' ? 'Atenção' : 'Crítico';

  return (
    <div className="space-y-1.5 w-full">
      {showLabels && (
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-slate-500">Uso do Limite</span>
          <span className={`${colorClass} font-semibold`}>
            {percentage.toFixed(0)}% ({statusLabel})
          </span>
        </div>
      )}
      <div
        className="w-full h-2 rounded-full bg-slate-200 overflow-hidden"
        data-testid="limit-bar-track"
      >
        <div
          data-testid="limit-bar-fill"
          data-status={status}
          className={`h-full rounded-full transition-all duration-300 ease-out ${getBarColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

