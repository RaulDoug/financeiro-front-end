import React from 'react';
import { BRAZILIAN_BANKS, type BankInfo } from '../../lib/bankDetector.ts';
import { Check, Sparkles } from 'lucide-react';

interface BankPickerProps {
  selectedBankId?: string | null;
  autoDetectedBank?: BankInfo | null;
  onSelectBank: (bank: BankInfo) => void;
}

export const BankPicker: React.FC<BankPickerProps> = ({
  selectedBankId,
  autoDetectedBank,
  onSelectBank,
}) => {
  return (
    <div className="space-y-2.5" data-testid="bank-picker-component">
      {/* Banner de Auto-Detecção (AC-176) */}
      {autoDetectedBank && (
        <div
          data-testid="auto-detected-bank-preview"
          className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xs text-xs font-bold"
              style={{ backgroundColor: autoDetectedBank.primaryColor }}
            >
              {autoDetectedBank.name.substring(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {autoDetectedBank.name}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/60 px-1.5 py-0.2 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> Auto-detectado
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Ícone e cores selecionados automaticamente pelo nome
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-apply-detected-bank"
            onClick={() => onSelectBank(autoDetectedBank)}
            className="px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 transition cursor-pointer"
          >
            Usar este
          </button>
        </div>
      )}

      {/* Grid de Bancos Disponíveis para Seleção Manual (AC-177) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Ou escolha um banco manualmente:
        </label>
        <div
          data-testid="banks-grid-selection"
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1.5 bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          {BRAZILIAN_BANKS.map((bank) => {
            const isSelected = selectedBankId === bank.id;

            return (
              <button
                key={bank.id}
                type="button"
                data-testid={`bank-select-${bank.id}`}
                onClick={() => onSelectBank(bank)}
                className={`p-2 rounded-xl flex items-center gap-2 border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 dark:bg-blue-950/40'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold shadow-2xs"
                  style={{ backgroundColor: bank.primaryColor }}
                >
                  {bank.name.substring(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate flex-1">
                  {bank.name}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BankPicker;
