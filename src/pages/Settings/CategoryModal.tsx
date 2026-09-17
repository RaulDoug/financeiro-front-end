import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { categorySchema } from '../../schemas/settingsSchemas.ts';
import type { CategoryItem } from '../../services/category.service.ts';
import { IconPicker } from '../../components/shared/IconPicker.tsx';
import { useModalTransition } from '../../hooks/useModalTransition.ts';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    type: 'incomings' | 'expenses';
    icon?: string;
    color?: string;
  }) => Promise<void>;
  category?: CategoryItem | null;
  isLoading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  isLoading = false,
}) => {
  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen,
    duration: 200,
    onClose,
  });

  const [name, setName] = useState('');
  const [type, setType] = useState<'incomings' | 'expenses'>('expenses');
  const [icon, setIcon] = useState('smile');
  const [color, setColor] = useState('#3b82f6');
  const [errors, setErrors] = useState<{ name?: string; type?: string }>({});

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setIcon(category.icon || 'smile');
      setColor(category.color || '#3b82f6');
    } else {
      setName('');
      setType('expenses');
      setIcon('smile');
      setColor('#3b82f6');
    }
    setErrors({});
  }, [category, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRendered, triggerClose]);

  if (!isRendered) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = categorySchema.safeParse({ name, type });
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
      await onSubmit({ name: name.trim(), type, icon, color });
      triggerClose();
    } catch {
      // error handled by parent or hook
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-scrollbar ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      onClick={triggerClose}
      data-testid="category-modal"
    >
      <div
        className={`bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button
            type="button"
            onClick={triggerClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alimentação, Salário, Moradia..."
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
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('expenses')}
                className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                  type === 'expenses'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType('incomings')}
                className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                  type === 'incomings'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Receita
              </button>
            </div>
            {errors.type && (
              <p className="mt-1 text-xs text-rose-500">{errors.type}</p>
            )}
          </div>

          <div>
            <IconPicker
              selectedIcon={icon}
              selectedColor={color}
              onSelectIcon={setIcon}
              onSelectColor={setColor}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={triggerClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : category ? 'Salvar Alterações' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

