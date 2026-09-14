import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService, type CategoryItem } from '../../services/category.service.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';

interface Props {
  type: 'incomings' | 'expenses';
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CategorySelect: React.FC<Props> = ({ type, value, onChange, error }) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  const { data: categories = [], isLoading } = useQuery<CategoryItem[]>({
    queryKey: ['categories', currentWalletId, type],
    queryFn: () => categoryService.getCategories(type),
    enabled: Boolean(currentWalletId),
  });

  React.useEffect(() => {
    if (!value && categories.length > 0) {
      onChange(categories[0].id);
    }
  }, [categories, value, onChange]);

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Categoria *</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{isLoading ? 'Carregando categorias...' : 'Selecione uma categoria'}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
};

