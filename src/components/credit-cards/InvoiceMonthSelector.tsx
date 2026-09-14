import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InvoiceMonthSelectorProps {
  currentDate: Date;
  onChange: (newDate: Date) => void;
}

export const InvoiceMonthSelector: React.FC<InvoiceMonthSelectorProps> = ({
  currentDate,
  onChange,
}) => {
  const handlePrev = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    onChange(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    onChange(d);
  };

  const monthLabel = currentDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center gap-2" data-testid="invoice-month-selector">
      <button
        type="button"
        aria-label="Mês anterior"
        onClick={handlePrev}
        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-sm font-semibold capitalize text-slate-800 min-w-[140px] text-center">
        {monthLabel}
      </span>

      <button
        type="button"
        aria-label="Próximo mês"
        onClick={handleNext}
        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

