import React, { useEffect, useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { payMethodSchema } from '../../schemas/settingsSchemas.ts';
import type { PayMethodItem, CreatePayMethodDTO } from '../../services/payMethod.service.ts';

interface PayMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePayMethodDTO) => Promise<void>;
  payMethod?: PayMethodItem | null;
  isLoading?: boolean;
}

export const PayMethodModal: React.FC<PayMethodModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  payMethod,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [isCreditCard, setIsCreditCard] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const isEditing = Boolean(payMethod);

  useEffect(() => {
    if (payMethod) {
      setName(payMethod.name);
      setIsCreditCard(Boolean(payMethod.credit_card));
    } else {
      setName('');
      setIsCreditCard(false);
    }
    setErrors({});
  }, [payMethod, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = payMethodSchema.safeParse({
      name,
      credit_card: isCreditCard,
    });

    if (!result.success) {
      const fieldErrors: { name?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'name') fieldErrors.name = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        credit_card: isCreditCard,
      });
      onClose();
    } catch {
      // error handled by parent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
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
              Nome do Método
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pix, Dinheiro, Cartão Visa..."
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.name ? 'border-rose-500' : 'border-slate-300'
              } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
            )}
          </div>

          {/* Opção É um cartão de crédito - Bloqueada em edição (AC-112) */}
          <div className="pt-2">
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                isEditing
                  ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-90'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900">
                      É um cartão de crédito?
                    </span>
                    {isEditing && (
                      <Lock className="w-3.5 h-3.5 text-slate-400" aria-label="Bloqueado para edição" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {isEditing
                      ? 'O tipo de cartão não pode ser alterado após a criação.'
                      : 'Habilita controle de faturas, limite e fechamento.'}
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={isCreditCard}
                disabled={isEditing}
                onChange={(e) => setIsCreditCard(e.target.checked)}
                aria-label="É um cartão de crédito?"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              />
            </div>
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
              {isLoading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Método'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

