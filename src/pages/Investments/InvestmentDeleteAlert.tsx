import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import type { InvestmentAssetItem } from '../../types/investment.ts';

interface InvestmentDeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  asset: InvestmentAssetItem | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const InvestmentDeleteAlert: React.FC<InvestmentDeleteAlertProps> = ({
  isOpen,
  onClose,
  asset,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen || !asset) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch {
      // error handled by parent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/40">
          <div className="flex items-center gap-2.5 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900">Excluir Ativo de Investimento</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Tem certeza que deseja remover o ativo <strong className="text-slate-900 font-semibold">{asset.name}</strong>?
            Esta ação não poderá ser desfeita.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isLoading ? 'Excluindo...' : 'Excluir Ativo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDeleteAlert;

