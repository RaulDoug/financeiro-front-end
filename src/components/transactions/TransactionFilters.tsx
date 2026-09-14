import React from 'react';
import { Search, X } from 'lucide-react';
import type { TransactionFilters as FiltersType, TransactionType, TransactionStatus } from '../../types/transaction.ts';

interface Props {
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
}

export const TransactionFilters: React.FC<Props> = ({ filters, onChange }) => {
  const handleTypeChange = (type?: TransactionType) => {
    onChange({ ...filters, type, page: 1 });
  };

  const handleStatusChange = (status?: TransactionStatus) => {
    onChange({ ...filters, status, page: 1 });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, description: e.target.value || undefined, page: 1 });
  };

  const handleClear = () => {
    onChange({});
  };

  const hasActiveFilters = Boolean(
    filters.type ||
    filters.status ||
    filters.description ||
    filters.due_date_from ||
    filters.due_date_to
  );

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Barra de busca */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.description || ''}
            onChange={handleSearchChange}
            placeholder="Buscar por descrição..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Datas */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="date"
            value={filters.due_date_from || ''}
            onChange={(e) => onChange({ ...filters, due_date_from: e.target.value || undefined, page: 1 })}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">até</span>
          <input
            type="date"
            value={filters.due_date_to || ''}
            onChange={(e) => onChange({ ...filters, due_date_to: e.target.value || undefined, page: 1 })}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 ml-2 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              title="Limpar filtros"
            >
              <X className="w-3.5 h-3.5" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Abas / Pílulas de Tipo e Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-50">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleTypeChange(undefined)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !filters.type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => handleTypeChange('incomings')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.type === 'incomings' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => handleTypeChange('expenses')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.type === 'expenses' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Despesas
          </button>
          <button
            onClick={() => handleTypeChange('transfers')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.type === 'transfers' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Transferências
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleStatusChange(undefined)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              !filters.status ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos Status
          </button>
          <button
            onClick={() => handleStatusChange('pending')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => handleStatusChange('completed')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Concluídos
          </button>
          <button
            onClick={() => handleStatusChange('expired')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === 'expired' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Vencidos
          </button>
          <button
            onClick={() => handleStatusChange('cancelled')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === 'cancelled' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Cancelados
          </button>
        </div>
      </div>
    </div>
  );
};
