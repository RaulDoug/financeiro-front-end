import React, { useState } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Target,
  Calendar,
} from 'lucide-react';
import {
  useEnrichedBudgets,
  useBudgetSummary,
  useAnnualBudgets,
} from '../../hooks/useBudgets.ts';
import { useBudgetMutations } from '../../hooks/useBudgetMutations.ts';
import { BudgetSummaryCards } from '../../components/budgets/BudgetSummaryCards.tsx';
import { BudgetCategoryCard } from '../../components/budgets/BudgetCategoryCard.tsx';
import { BudgetAnnualChart } from '../../components/budgets/BudgetAnnualChart.tsx';
import { BudgetModal } from '../../components/budgets/BudgetModal.tsx';
import { BudgetDeleteDialog } from '../../components/budgets/BudgetDeleteDialog.tsx';
import type { EnrichedBudgetItem } from '../../types/budget.ts';
import type {
  CreateBudgetFormData,
  UpdateBudgetFormData,
} from '../../schemas/budgetSchema.ts';

const MONTH_NAMES_FULL = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const BudgetsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');

  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth() + 1; // 1 a 12

  // Queries
  const {
    data: budgets = [],
    isLoading: isLoadingBudgets,
    isCategoriesLoading,
    totalPending = 0,
  } = useEnrichedBudgets(selectedYear, selectedMonth);

  const { data: summary, isLoading: isLoadingSummary } = useBudgetSummary(
    selectedYear,
    selectedMonth
  );

  const { data: annualData, isLoading: isLoadingAnnual } = useAnnualBudgets(
    selectedYear
  );

  // Mutations
  const {
    createMutation,
    updateMutation,
    deleteMutation,
    recalculateMutation,
  } = useBudgetMutations();

  // Modais e Feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<EnrichedBudgetItem | null>(
    null
  );
  const [deletingBudget, setDeletingBudget] =
    useState<EnrichedBudgetItem | null>(null);
  const [feedback, setFeedback] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const handlePrevMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleOpenNew = () => {
    setFeedback(null);
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budget: EnrichedBudgetItem) => {
    setFeedback(null);
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (budget: EnrichedBudgetItem) => {
    setFeedback(null);
    setDeletingBudget(budget);
  };

  const handleCreate = async (data: CreateBudgetFormData) => {
    await createMutation.mutateAsync(data);
    setFeedback({
      text: 'Orçamento cadastrado com sucesso!',
      type: 'success',
    });
  };

  const handleUpdate = async (id: string, data: UpdateBudgetFormData) => {
    await updateMutation.mutateAsync({ id, payload: data });
    setFeedback({
      text: 'Orçamento atualizado com sucesso!',
      type: 'success',
    });
  };

  const handleDelete = async (id: string, scope: 'single' | 'following') => {
    await deleteMutation.mutateAsync({ id, scope });
    setFeedback({
      text: 'Orçamento excluído com sucesso!',
      type: 'success',
    });
  };

  const handleRecalculate = async (budget: EnrichedBudgetItem) => {
    try {
      await recalculateMutation.mutateAsync({
        categoryId: budget.category_id,
        year: selectedYear,
        month: selectedMonth,
      });
      setFeedback({
        text: `Gastos de ${budget.category_name} recalculados com sucesso!`,
        type: 'success',
      });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Não foi possível recalcular os gastos da categoria.';
      setFeedback({
        text: errorMsg,
        type: 'error',
      });
    }
  };

  const isLoadingTotal = isLoadingBudgets || isCategoriesLoading;

  return (
    <div
      data-testid="budgets-page"
      className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Toast / Alerta de Feedback */}
      {feedback && (
        <div
          data-testid="budget-feedback-banner"
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold cursor-pointer underline ml-4"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header Principal da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Orçamentos e Metas
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Planeje tetos mensais por categoria e acompanhe suas previsões de sobra no caixa.
          </p>
        </div>

        {/* Controles de Ação de Topo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Toggle Mensal / Anual */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              data-testid="budget-tab-monthly"
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              data-testid="budget-tab-annual"
              onClick={() => setViewMode('annual')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Anual
            </button>
          </div>

          {/* Botão Novo Orçamento */}
          <button
            type="button"
            data-testid="budget-new-button"
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Meta</span>
          </button>
        </div>
      </div>

      {/* Seletor Temporal de Mês/Ano (Visível na visão mensal) */}
      {viewMode === 'monthly' && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <button
            type="button"
            data-testid="budget-prev-month-button"
            onClick={handlePrevMonth}
            aria-label="Mês anterior"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span
              data-testid="budget-current-month-display"
              className="text-sm sm:text-base font-bold text-slate-900 dark:text-white"
            >
              {MONTH_NAMES_FULL[selectedMonth - 1]} de {selectedYear}
            </span>
          </div>

          <button
            type="button"
            data-testid="budget-next-month-button"
            onClick={handleNextMonth}
            aria-label="Próximo mês"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Resumo Superior de Caixa e Metas (KPI Cards) */}
      <BudgetSummaryCards
        summary={summary}
        isLoading={isLoadingSummary}
        totalPending={totalPending}
      />

      {/* Conteúdo Principal baseado no Modo Ativo */}
      {viewMode === 'monthly' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Metas por Categoria ({budgets.length})
            </h2>
          </div>

          {isLoadingTotal ? (
            /* Skeletons */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
              ))}
            </div>
          ) : budgets.length === 0 ? (
            /* Estado Vazio */
            <div
              data-testid="budget-empty-state"
              className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Target className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Nenhum orçamento para {MONTH_NAMES_FULL[selectedMonth - 1]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Estabeleça metas mensais de despesas para acompanhar seu ritmo de gastos antes de estourar seus limites.
                </p>
              </div>
              <button
                type="button"
                data-testid="budget-empty-create-button"
                onClick={handleOpenNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Definir Primeira Meta</span>
              </button>
            </div>
          ) : (
            /* Grid de Cards */
            <div
              data-testid="budget-category-grid"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {budgets.map((budget) => (
                <BudgetCategoryCard
                  key={budget.id}
                  budget={budget}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onRecalculate={handleRecalculate}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Visão Anual Panorâmica */
        <BudgetAnnualChart
          annualData={annualData}
          selectedYear={selectedYear}
          onYearChange={(year) => setSelectedDate(new Date(year, 0, 1))}
          isLoading={isLoadingAnnual}
        />
      )}

      {/* Modal de Criação / Edição */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialBudget={editingBudget}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {/* Diálogo de Exclusão */}
      <BudgetDeleteDialog
        isOpen={Boolean(deletingBudget)}
        onClose={() => setDeletingBudget(null)}
        budget={deletingBudget}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BudgetsPage;
