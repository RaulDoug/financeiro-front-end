import React, { useState } from 'react';
import {
  RefreshCw,
  Edit2,
  Trash2,
  Repeat,
  AlertTriangle,
  AlertCircle,
  Folder,
} from 'lucide-react';
import type { EnrichedBudgetItem } from '../../types/budget.ts';
import { BudgetProgressBar, getProgressColor } from './BudgetProgressBar.tsx';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import { renderLucideIcon } from '../shared/IconPicker.tsx';

interface BudgetCategoryCardProps {
  budget: EnrichedBudgetItem;
  onEdit: (budget: EnrichedBudgetItem) => void;
  onDelete: (budget: EnrichedBudgetItem) => void;
  onRecalculate: (budget: EnrichedBudgetItem) => Promise<void>;
}

export const BudgetCategoryCard: React.FC<BudgetCategoryCardProps> = ({
  budget,
  onEdit,
  onDelete,
  onRecalculate,
}) => {
  const [isRecalculating, setIsRecalculating] = useState(false);

  const target = Number(budget.target_amount) || 0;
  const used = Number(budget.used_amount) || 0;
  const pendingAmount = Number(budget.pending_amount) || 0;
  const percentage =
    budget.percentage_used ?? (target > 0 ? (used / target) * 100 : 0);
  const remaining = budget.remaining_amount ?? target - used;
  const isExceeded = budget.status === 'exceeded' || used > target;
  const isRecurrent = Boolean(budget.recurrence_group_id);

  const { badgeClass, statusLabel } = getProgressColor(percentage);

  const handleRecalculate = async () => {
    try {
      setIsRecalculating(true);
      await onRecalculate(budget);
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <div
      data-testid={`budget-card-${budget.id}`}
      className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md flex flex-col justify-between ${
        isExceeded
          ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-200 dark:ring-rose-950/40'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      {/* Top Header: Categoria + Ações */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs"
            style={{ backgroundColor: budget.category_color || '#6366f1' }}
          >
            {renderLucideIcon(budget.category_icon, 'w-5 h-5') || (
              <Folder className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">
              {budget.category_name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                data-testid="budget-card-status-badge"
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeClass}`}
              >
                {statusLabel} ({percentage.toFixed(0)}%)
              </span>
              {isRecurrent && (
                <span
                  title="Orçamento recorrente"
                  className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md"
                >
                  <Repeat className="w-2.5 h-2.5" />
                  <span>Recorrente</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Menu de Ações Rápidas */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleRecalculate}
            disabled={isRecalculating}
            title="Recalcular gastos com base nas transações"
            aria-label="Recalcular"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin text-blue-500' : ''}`}
            />
          </button>
          <button
            type="button"
            onClick={() => onEdit(budget)}
            title="Editar orçamento"
            aria-label="Editar"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(budget)}
            title="Excluir orçamento"
            aria-label="Excluir"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Valores: Comprometido vs Teto */}
      <div className="my-3 space-y-1.5">
        <div className="flex items-baseline justify-between text-xs text-slate-500 dark:text-slate-400">
          <span title="Gasto comprometido (Pago + Pendente)">
            Comprometido:{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {formatCurrency(used)}
            </strong>
          </span>
          <span>
            Teto:{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {formatCurrency(target)}
            </strong>
          </span>
        </div>

        {/* Barra de Progresso */}
        <BudgetProgressBar percentage={percentage} />

        {/* Aviso de valor pendente (semelhante ao card de sobra) */}
        {pendingAmount > 0 && (
          <p
            data-testid={`budget-pending-warning-${budget.id}`}
            className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium leading-tight"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>
              Inclui {formatCurrency(pendingAmount)} ainda pendente
            </span>
          </p>
        )}
      </div>

      {/* Rodapé: Restante ou Estourado */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        {isExceeded ? (
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Estourado em {formatCurrency(Math.abs(remaining))}</span>
          </div>
        ) : (
          <span className="text-slate-600 dark:text-slate-300">
            Restante:{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {formatCurrency(remaining)}
            </strong>
          </span>
        )}
      </div>
    </div>
  );
};
