import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { counterpartySchema } from '../../schemas/settingsSchemas.ts';
import type { CounterpartyItem } from '../../services/counterparty.service.ts';

interface CounterpartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: 'payer' | 'payee' }) => Promise<void>;
  counterparty?: CounterpartyItem | null;
  isLoading?: boolean;
}

export const CounterpartyModal: React.FC<CounterpartyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  counterparty,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'payer' | 'payee'>('payee');
  const [errors, setErrors] = useState<{ name?: string; type?: string }>({});

  useEffect(() => {
    if (counterparty) {
      setName(counterparty.name);
      setType(counterparty.type);
    } else {
      setName('');
      setType('payee');
    }
    setErrors({});
  }, [counterparty, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = counterpartySchema.safeParse({ name, type });
    if (!result.success) {
      const fieldErrors: { name?: string; type?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'name') fieldErrors.name = err.message;
        if (err.path[0] === 'type') fieldErrors.type = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit({ name: name.trim(), type });
      onClose();
    } catch {
      // error handled by caller
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            {counterparty ? 'Editar Contraparte' : 'Nova Contraparte'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome da Pessoa ou Empresa
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supermercado Extra, Empresa ABC..."
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
              Papel da Contraparte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('payee')}
                className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                  type === 'payee'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Recebedor (Despesa)
              </button>
              <button
                type="button"
                onClick={() => setType('payer')}
                className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                  type === 'payer'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Pagador (Receita)
              </button>
            </div>
            {errors.type && (
              <p className="mt-1 text-xs text-rose-500">{errors.type}</p>
            )}
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
              {isLoading ? 'Salvando...' : counterparty ? 'Salvar Alterações' : 'Criar Contraparte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

