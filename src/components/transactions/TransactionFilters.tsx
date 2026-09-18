import React, { useState, useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Calendar, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import type { TransactionFilters as FiltersType, TransactionType, TransactionStatus } from '../../types/transaction.ts';
import { TransactionAdvancedFiltersModal } from './TransactionAdvancedFiltersModal.tsx';

interface Props {
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
}

export const TransactionFilters: React.FC<Props> = ({ filters, onChange }) => {
  const advancedFiltersContainerRef = useRef<HTMLDivElement>(null);
  const handleTypeChange = (type?: TransactionType) => {
    onChange({ ...filters, type, page: 1, order_by: 'due_date' });
  };

  const handleStatusChange = (status?: TransactionStatus) => {
    onChange({ ...filters, status, page: 1, order_by: 'due_date' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, description: e.target.value || undefined, page: 1, order_by: 'due_date' });
  };

  const handleClear = () => {
    onChange({
      order_by: 'due_date',
      order_dir: 'ASC',
    });
  };

  // Referência de mês para navegação baseada no due_date_from
  const activeDate = filters.due_date_from
    ? new Date(`${filters.due_date_from}T00:00:00`)
    : new Date();

  const getMonthBounds = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDayNum = new Date(year, month + 1, 0).getDate();
    const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDayNum).padStart(2, '0')}`;
    return { firstDay, lastDay };
  };

  const handlePrevMonth = () => {
    const prev = new Date(activeDate.getFullYear(), activeDate.getMonth() - 1, 1);
    const { firstDay, lastDay } = getMonthBounds(prev);
    onChange({
      ...filters,
      due_date_from: firstDay,
      due_date_to: lastDay,
      order_by: 'due_date',
      page: 1,
    });
  };

  const handleNextMonth = () => {
    const next = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 1);
    const { firstDay, lastDay } = getMonthBounds(next);
    onChange({
      ...filters,
      due_date_from: firstDay,
      due_date_to: lastDay,
      order_by: 'due_date',
      page: 1,
    });
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const { firstDay, lastDay } = getMonthBounds(now);
    onChange({
      ...filters,
      due_date_from: firstDay,
      due_date_to: lastDay,
      order_by: 'due_date',
      page: 1,
    });
  };

  const handleAllDates = () => {
    onChange({
      ...filters,
      due_date_from: undefined,
      due_date_to: undefined,
      order_by: 'due_date',
      page: 1,
    });
  };

  const handleToggleOrderDir = () => {
    const newDir = filters.order_dir === 'DESC' ? 'ASC' : 'DESC';
    onChange({
      ...filters,
      order_by: 'due_date',
      order_dir: newDir,
      page: 1,
    });
  };

  const formattedMonthLabel = filters.due_date_from
    ? new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(activeDate)
    : 'Todas as datas';

  const hasActiveFilters = Boolean(
    filters.type ||
    filters.status ||
    filters.description ||
    filters.due_date_from ||
    filters.due_date_to ||
    filters.category_id ||
    filters.pay_methods_id ||
    filters.bank_account_id ||
    filters.value_min !== undefined ||
    filters.value_max !== undefined
  );

  const isAscending = (filters.order_dir ?? 'ASC') === 'ASC';
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const hasValueFilter = filters.value_min !== undefined || filters.value_max !== undefined;
  const activeAdvancedCount = [
    filters.category_id,
    filters.pay_methods_id,
    filters.bank_account_id,
    hasValueFilter,
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
      {/* Linha superior: Navegação de mês, busca, filtros avançados e ordenação */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
        {/* Navegador de Mês e Período (2 linhas no mobile, 1 linha no desktop) */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 bg-gray-50 dark:bg-slate-800/70 p-1.5 rounded-xl border border-gray-200 dark:border-slate-700 w-full lg:w-auto"
          data-testid="month-filter-section"
        >
          {/* Linha superior no mobile: Seletor de mês */}
          <div className="flex items-center justify-between sm:justify-start gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
              title="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 px-3 py-1 flex-1 sm:flex-initial">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold capitalize text-gray-800 dark:text-slate-200 min-w-[120px] text-center">
                {formattedMonthLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
              title="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:block h-4 w-px bg-gray-300 dark:bg-slate-600 mx-1" />

          {/* Linha inferior no mobile: Atalhos 'Este Mês' e 'Todas as datas' */}
          <div className="flex items-center justify-center sm:justify-start gap-1 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleCurrentMonth}
              className="flex-1 sm:flex-none px-2.5 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition text-center cursor-pointer"
            >
              Este Mês
            </button>

            {filters.due_date_from && (
              <button
                type="button"
                onClick={handleAllDates}
                className="flex-1 sm:flex-none px-2.5 py-1 text-[11px] font-medium text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition text-center cursor-pointer"
              >
                Todas as datas
              </button>
            )}
          </div>
        </div>

        {/* Busca, Filtros Avançados e Ordenação */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Barra de busca */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.description || ''}
              onChange={handleSearchChange}
              placeholder="Buscar por descrição..."
              className="w-full pl-9 pr-4 py-1.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Botão de Filtros Avançados com Popover Desktop / Modal Mobile */}
          <div className="relative" ref={advancedFiltersContainerRef}>
            <button
              type="button"
              onClick={() => setIsAdvancedFiltersOpen((prev) => !prev)}
              data-testid="btn-advanced-filters"
              aria-expanded={isAdvancedFiltersOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Abrir filtros avançados"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Filtros</span>
              {activeAdvancedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeAdvancedCount}
                </span>
              )}
            </button>

            {/* Modal / Popover de Filtros Avançados */}
            <TransactionAdvancedFiltersModal
              isOpen={isAdvancedFiltersOpen}
              onClose={() => setIsAdvancedFiltersOpen(false)}
              filters={filters}
              onApply={(newFilters) => onChange({ ...filters, ...newFilters })}
              onReset={() =>
                onChange({
                  ...filters,
                  category_id: undefined,
                  pay_methods_id: undefined,
                  bank_account_id: undefined,
                  status: undefined,
                  type: undefined,
                  value_min: undefined,
                  value_max: undefined,
                  page: 1,
                })
              }
              containerRef={advancedFiltersContainerRef}
            />
          </div>

          {/* Botão de Direção da Ordenação por Vencimento */}
          <button
            type="button"
            onClick={handleToggleOrderDir}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Alternar direção de ordenação por data de vencimento"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Vencimento: {isAscending ? 'Crescente (↑)' : 'Decrescente (↓)'}</span>
          </button>
        </div>
      </div>

      {/* Linha intermediária: Filtro de datas explícito */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Período de Vencimento:</span>
          <input
            type="date"
            value={filters.due_date_from || ''}
            onChange={(e) => onChange({ ...filters, due_date_from: e.target.value || undefined, page: 1, order_by: 'due_date' })}
            className="px-2.5 py-1 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400">até</span>
          <input
            type="date"
            value={filters.due_date_to || ''}
            onChange={(e) => onChange({ ...filters, due_date_to: e.target.value || undefined, page: 1, order_by: 'due_date' })}
            className="px-2.5 py-1 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-auto"
            title="Limpar filtros"
          >
            <X className="w-3.5 h-3.5" />
            Limpar filtros
          </button>
        )}
      </div>

      {/* Abas / Pílulas de Tipo e Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleTypeChange(undefined)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !filters.type ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => handleTypeChange('incomings')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.type === 'incomings' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => handleTypeChange('expenses')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.type === 'expenses' ? 'bg-rose-600 text-white' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100'
            }`}
          >
            Despesas
          </button>
          <button
            onClick={() => handleTypeChange('transfers')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.type === 'transfers' ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100'
            }`}
          >
            Transferências
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            data-testid="filter-status-all"
            onClick={() => handleStatusChange(undefined)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              !filters.status ? 'bg-gray-800 dark:bg-slate-700 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Todos Status
          </button>
          <button
            type="button"
            data-testid="filter-status-pending"
            onClick={() => handleStatusChange('pending')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100'
            }`}
          >
            Pendentes
          </button>
          <button
            type="button"
            data-testid="filter-status-completed"
            onClick={() => handleStatusChange('completed')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
            }`}
          >
            Concluídos
          </button>
          <button
            type="button"
            data-testid="filter-status-expired"
            onClick={() => handleStatusChange('expired')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === 'expired' ? 'bg-rose-600 text-white' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100'
            }`}
          >
            Vencidos
          </button>
          <button
            type="button"
            data-testid="filter-status-cancelled"
            onClick={() => handleStatusChange('cancelled')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === 'cancelled' ? 'bg-gray-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Cancelados
          </button>
        </div>
      </div>
    </div>
  );
};

