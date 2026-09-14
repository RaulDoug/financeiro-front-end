import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ChartEmptyStateProps {
  message?: string;
  className?: string;
}

export const ChartEmptyState: React.FC<ChartEmptyStateProps> = ({
  message = 'Não há dados suficientes para exibição',
  className = 'h-64',
}) => {
  return (
    <div
      data-testid="chart-empty-state"
      className={`flex flex-col items-center justify-center text-center p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl ${className}`}
    >
      <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default ChartEmptyState;

