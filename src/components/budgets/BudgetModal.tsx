import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, Repeat, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModalTransition } from '../../hooks/useModalTransition.ts';
import { useCategories } from '../../hooks/useCategories.ts';
import {
  createBudgetFormSchema,
  updateBudgetFormSchema,
  type CreateBudgetFormData,
  type UpdateBudgetFormData,
} from '../../schemas/budgetSchema.ts';
import type { EnrichedBudgetItem } from '../../types/budget.ts';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBudget?: EnrichedBudgetItem | null;
  selectedYear: number;
  selectedMonth: number;
  onCreate: (data: CreateBudgetFormData) => Promise<void>;
  onUpdate: (id: string, data: UpdateBudgetFormData) => Promise<void>;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  initialBudget = null,
  selectedYear,
  selectedMonth,
  onCreate,
  onUpdate,
}) => {
  const isEditing = Boolean(initialBudget);
  const isRecurrent = Boolean(initialBudget?.recurrence_group_id);

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories('expenses');

  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen,
    duration: 200,
    onClose,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestos de arraste para fechar no celular
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);

  // Forms
  const createForm = useForm<CreateBudgetFormData>({
    resolver: zodResolver(createBudgetFormSchema),
    defaultValues: {
      category_id: '',
      year: selectedYear,
      month: selectedMonth,
      target_amount: undefined,
      mode: 'single',
      months_quantity: 12,
    },
  });

  const updateForm = useForm<UpdateBudgetFormData>({
    resolver: zodResolver(updateBudgetFormSchema),
    defaultValues: {
      target_amount: Number(initialBudget?.target_amount) || 0,
      scope: 'single',
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (initialBudget) {
      updateForm.reset({
        target_amount: Number(initialBudget.target_amount) || 0,
        scope: 'single',
      });
    } else {
      createForm.reset({
        category_id: categories.length > 0 ? categories[0].id : '',
        year: selectedYear,
        month: selectedMonth,
        target_amount: undefined,
        mode: 'single',
        months_quantity: 12,
      });
    }
    setErrorMessage(null);
  }, [isOpen, initialBudget, selectedYear, selectedMonth]);

  useEffect(() => {
    if (isOpen && !initialBudget && categories.length > 0 && !createForm.getValues('category_id')) {
      createForm.setValue('category_id', categories[0].id);
    }
  }, [isOpen, initialBudget, categories.length, createForm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRendered, triggerClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement)?.closest('button, a, input, select, textarea')) {
      return;
    }
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 90) {
      setDragY(0);
      triggerClose();
    } else {
      setDragY(0);
    }
  };

  const onSubmit = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      if (isEditing && initialBudget) {
        const data = updateForm.getValues();
        const valid = await updateForm.trigger();
        if (!valid) return;
        await onUpdate(initialBudget.id, data);
      } else {
        const data = createForm.getValues();
        const valid = await createForm.trigger();
        if (!valid) return;
        await onCreate(data);
      }
      triggerClose();
    } catch (error: any) {
      console.error('Erro ao salvar orçamento:', error);
      if (error?.response?.status === 409) {
        setErrorMessage(
          'Esta categoria já possui um orçamento cadastrado para este mês/ano. Edite o orçamento existente em vez de criar um novo.'
        );
      } else {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          'Ocorreu um erro ao salvar o orçamento.';
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRendered) return null;

  const modeValue = createForm.watch('mode');

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      data-testid="budget-modal"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity ${
          isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
        }`}
        style={{
          opacity: dragY > 0 ? Math.max(0, 1 - dragY / 300) : undefined,
        }}
        onClick={triggerClose}
        data-testid="budget-modal-backdrop"
      />

      {/* Modal Dialog / Drawer */}
      <div
        className={`relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden pb-safe max-h-[90vh] flex flex-col ${
          isClosing
            ? 'animate-drawer-out'
            : isDragging || dragY > 0
              ? ''
              : 'animate-drawer-in'
        }`}
        style={{
          transform:
            isClosing
              ? undefined
              : dragY > 0
                ? `translateY(${dragY}px)`
                : undefined,
          transition: isDragging
            ? 'none'
            : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Handle para mobile */}
        <div
          className="w-full flex justify-center pb-1 pt-2.5 md:hidden cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Editar Meta de Gastos' : 'Novo Orçamento'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? `Atualize o teto planejado para ${initialBudget?.category_name}`
                : 'Defina um teto mensal para controlar os gastos da categoria'}
            </p>
          </div>
          <button
            type="button"
            onClick={triggerClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body com Scroll */}
        <div className="p-5 overflow-y-auto space-y-4">
          {errorMessage && (
            <div
              data-testid="budget-modal-error-alert"
              className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isEditing ? (
            /* Formulário de Criação */
            <form className="space-y-4">
              {/* Categoria */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Categoria de Despesa *
                </label>
                <select
                  data-testid="budget-input-category"
                  {...createForm.register('category_id')}
                  disabled={isLoadingCategories}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                >
                  <option value="">Selecione uma categoria...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {createForm.formState.errors.category_id && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {createForm.formState.errors.category_id.message}
                  </p>
                )}
              </div>

              {/* Mês e Ano */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mês de Início
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      {...createForm.register('month', { valueAsNumber: true })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ano
                  </label>
                  <input
                    type="number"
                    min={2020}
                    {...createForm.register('year', { valueAsNumber: true })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Valor da Meta */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Valor da Meta (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    data-testid="budget-input-target-amount"
                    {...createForm.register('target_amount', {
                      valueAsNumber: true,
                    })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                {createForm.formState.errors.target_amount && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {createForm.formState.errors.target_amount.message}
                  </p>
                )}
              </div>

              {/* Modo de Recorrência */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Tipo de Meta
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      modeValue === 'single'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value="single"
                      {...createForm.register('mode')}
                      className="hidden"
                    />
                    <span>Apenas este mês</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      modeValue === 'recurrent'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value="recurrent"
                      {...createForm.register('mode')}
                      className="hidden"
                    />
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Recorrente</span>
                  </label>
                </div>

                {modeValue === 'recurrent' && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-slate-600 dark:text-slate-400 font-medium">
                        Repetir por quantos meses?
                      </label>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {createForm.watch('months_quantity')} meses
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      data-testid="budget-input-months-quantity"
                      {...createForm.register('months_quantity', {
                        valueAsNumber: true,
                      })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </form>
          ) : (
            /* Formulário de Edição */
            <form className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Categoria:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {initialBudget?.category_name}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Novo Valor da Meta (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    data-testid="budget-input-update-target-amount"
                    {...updateForm.register('target_amount', {
                      valueAsNumber: true,
                    })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                {updateForm.formState.errors.target_amount && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {updateForm.formState.errors.target_amount.message}
                  </p>
                )}
              </div>

              {/* Seleção de Escopo para orçamentos recorrentes */}
              {isRecurrent && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Escopo da Alteração
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        value="single"
                        {...updateForm.register('scope')}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <strong className="block font-medium">Apenas este mês</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Ideal para meses atípicos. Mantém os próximos meses inalterados.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        value="following"
                        {...updateForm.register('scope')}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <strong className="block font-medium">
                          Este e os próximos meses
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Altera permanentemente este mês e todos os meses seguintes deste grupo.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer com Botões */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <button
            type="button"
            onClick={triggerClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            data-testid="budget-modal-submit-button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Orçamento'}</span>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
