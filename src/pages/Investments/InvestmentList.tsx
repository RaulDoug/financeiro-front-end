import React from 'react';
import { TrendingUp, Building2, Calendar, Edit2, Trash2 } from 'lucide-react';
import type { InvestmentAssetItem } from '../../types/investment.ts';
import { useBankAccounts } from '../../hooks/useBankAccounts.ts';

interface InvestmentListProps {
  assets: InvestmentAssetItem[];
  onEdit: (asset: InvestmentAssetItem) => void;
  onDelete: (asset: InvestmentAssetItem) => void;
}

export const InvestmentList: React.FC<InvestmentListProps> = ({
  assets,
  onEdit,
  onDelete,
}) => {
  const { data: bankAccounts = [] } = useBankAccounts();

  const getAccountName = (bankAccountId: string, fallbackName?: string) => {
    if (fallbackName) return fallbackName;
    const found = bankAccounts.find((a) => a.id === bankAccountId);
    return found ? found.bank_name : 'Conta Vinculada';
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      const parts = dateStr.slice(0, 10).split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  if (assets.length === 0) {
    return (
      <div className="p-10 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800">Nenhum ativo cadastrado</h4>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Cadastre seus investimentos (CDB, Ações, Tesouro Direto, Fundos) para começar a acompanhar seu patrimônio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => {
        const formattedDate = formatDate(asset.due_date);
        const accountName = getAccountName(asset.bank_account_id, asset.bank_account_name);

        return (
          <div
            key={asset.id}
            data-testid="investment-asset-card"
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {asset.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{accountName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEdit(asset)}
                    aria-label={`Editar ${asset.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(asset)}
                    aria-label={`Excluir ${asset.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer com Data de Vencimento (AC-089) */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Vencimento:</span>
              {formattedDate ? (
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formattedDate}
                </span>
              ) : (
                <span className="text-slate-400">Sem vencimento</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvestmentList;

