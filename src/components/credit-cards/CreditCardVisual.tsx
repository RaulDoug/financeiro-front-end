import React from 'react';
import { CreditCard as CardIcon, Wifi } from 'lucide-react';
import { LimitBar } from './LimitBar.tsx';
import { CreditCardMenu } from './CreditCardMenu.tsx';
import { formatCurrency } from '../../utils/formatCurrency.ts';
import { normalizeCardColor } from '../../utils/creditCardColors.ts';
import type { CreditCardItem } from '../../types/creditCard.ts';

interface CreditCardVisualProps {
  card: CreditCardItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CARD_GRADIENTS: Record<string, string> = {
  navy: 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950',
  slate: 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-slate-900',
  emerald: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950',
  wine: 'bg-gradient-to-br from-rose-950 via-slate-900 to-purple-950',
  violet: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950',
  bronze: 'bg-gradient-to-br from-amber-950 via-slate-900 to-stone-900',
};

export const CreditCardVisual: React.FC<CreditCardVisualProps> = ({
  card,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const used = card.used_credit_limit ?? 0;
  const total = card.credit_limit || 0;
  const available = card.available_limit ?? Math.max(0, total - used);
  const colorKey = normalizeCardColor(card.color);
  const gradientClass = CARD_GRADIENTS[colorKey] || CARD_GRADIENTS.navy;

  return (
    <div
      data-testid={`credit-card-card-${card.id}`}
      data-color={colorKey}
      onClick={onSelect}
      className={`relative overflow-hidden rounded-2xl p-6 transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-lg scale-[1.01]'
          : 'hover:shadow-md border border-slate-800'
      } ${gradientClass} text-white min-h-[220px] flex flex-col justify-between`}
    >
      {/* Top row: Brand & Menu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-xs">
            <CardIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-base font-bold tracking-tight text-white">{card.name}</h4>
            {card.bank_account_name && (
              <span className="text-[11px] text-slate-400">{card.bank_account_name}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(card.brand || (card.icon && card.icon !== 'credit-card')) && (
            <span
              data-testid="credit-card-brand-badge"
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white backdrop-blur-xs border border-white/20 shadow-xs"
            >
              {card.brand || card.icon}
            </span>
          )}
          <Wifi className="w-4 h-4 text-white/50 rotate-90" />
          <CreditCardMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      {/* Card number digits */}
      <div className="py-2">
        <div className="text-sm font-mono tracking-widest text-slate-300">
          •••• •••• •••• {card.last_four_digits}
        </div>
      </div>

      {/* Dates: Closing & Due */}
      <div className="grid grid-cols-2 gap-2 text-xs py-1 border-t border-white/10">
        <div>
          <span className="text-slate-400 text-[10px] uppercase font-medium">Fechamento</span>
          <p className="font-semibold text-white">Dia {card.closing_day}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase font-medium">Vencimento</span>
          <p className="font-semibold text-white">Dia {card.due_day}</p>
        </div>
      </div>

      {/* Limits & Progress Bar */}
      <div className="pt-2 border-t border-white/10 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">
            Usado: <strong className="text-white font-semibold">{formatCurrency(used)}</strong>
          </span>
          <span className="text-slate-400">
            Limite: <strong className="text-white font-semibold">{formatCurrency(total)}</strong>
          </span>
        </div>
        <LimitBar used={used} total={total} />
        <div className="text-right text-[11px] text-slate-400">
          Disponível: <span className="text-emerald-400 font-semibold">{formatCurrency(available)}</span>
        </div>
      </div>
    </div>
  );
};

