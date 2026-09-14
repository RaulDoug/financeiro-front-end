import React, { useEffect, useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { investmentAssetSchema } from '../../schemas/investmentSchema.ts';
import { useBankAccounts } from '../../hooks/useBankAccounts.ts';
import type { InvestmentAssetItem } from '../../types/investment.ts';

interface InvestmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; bank_account_id: string; due_date?: string | null }) => Promise<void>;
  asset?: InvestmentAssetItem | null;
  isLoading?: boolean;
}

export const InvestmentFormModal: React.FC<InvestmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  asset,
  isLoading = false,
}) => {
  const { data: bankAccounts = [] } = useBankAccounts();

  const [name, setName] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<{ name?: string; bank_account_id?: string; due_date?: string }>({});

  const isEditing = Boolean(asset);

  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setBankAccountId(asset.bank_account_id || '');
      setDueDate(asset.due_date ? asset.due_date.slice(0, 10) : '');
    } else {
      setName('');
      setBankAccountId(bankAccounts[0]?.id || '');
      setDueDate('');
    }
    setErrors({});
  }, [asset, isOpen, bankAccounts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = investmentAssetSchema.safeParse({
      name,
      bank_account_id: bankAccountId,
      due_date: dueDate || null,
    });

    if (!result.success) {
      const fieldErrors: { name?: string; bank_account_id?: string; due_date?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (field === 'name') fieldErrors.name = err.message;
        if (field === 'bank_account_id') fieldErrors.bank_account_id = err.message;
        if (field === 'due_date') fieldErrors.due_date = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        bank_account_id: bankAccountId,
        due_date: dueDate ? dueDate : null,
      });
      onClose();
    } catch {
      // error handled by parent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing ? 'Editar Ativo de Investimento' : 'Novo Ativo de Investimento'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome do Ativo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Ex: Tesouro Selic 2029, CDB Banco XP..."
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.name ? 'border-rose-500' : 'border-slate-300'
              } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Conta Bancária Vinculada <span className="text-rose-500">*</span>
            </label>
            <select
              value={bankAccountId}
              disabled={isEditing}
              onChange={(e) => {
                setBankAccountId(e.target.value);
                setErrors((prev) => ({ ...prev, bank_account_id: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.bank_account_id ? 'border-rose-500' : 'border-slate-300'
              } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors disabled:bg-slate-50 disabled:text-slate-500`}
            >
              <option value="">Selecione uma conta</option>
              {bankAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.bank_name}
                </option>
              ))}
            </select>
            {errors.bank_account_id && (
              <p className="mt-1 text-xs text-rose-500">{errors.bank_account_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Data de Vencimento (opcional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Ativo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentFormModal;

