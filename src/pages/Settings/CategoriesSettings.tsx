import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useCategories, useCategoryMutations } from '../../hooks/useCategories.ts';
import { CategoryModal } from './CategoryModal.tsx';
import type { CategoryItem } from '../../services/category.service.ts';

export const CategoriesSettings: React.FC = () => {
  const { data: categories = [], isLoading, error: queryError } = useCategories();
  const { createMutation, updateMutation, deleteMutation } = useCategoryMutations();

  const [activeTab, setActiveTab] = useState<'all' | 'incomings' | 'expenses'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const counts = useMemo(() => {
    return {
      all: categories.length,
      incomings: categories.filter((c) => c.type === 'incomings').length,
      expenses: categories.filter((c) => c.type === 'expenses').length,
    };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) => {
        if (activeTab === 'incomings') return category.type === 'incomings';
        if (activeTab === 'expenses') return category.type === 'expenses';
        return true;
      })
      .filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
  }, [categories, activeTab, searchQuery]);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setModalOpen(true);
  };

  const handleSave = async (data: { name: string; type: 'incomings' | 'expenses' }) => {
    try {
      if (selectedCategory) {
        const idToUpdate = selectedCategory.display_id ?? selectedCategory.id;
        const res = await updateMutation.mutateAsync({
          id: idToUpdate,
          data,
        });
        setFeedbackMessage({
          text: res?.message || 'Categoria atualizada com sucesso!',
          type: 'success',
        });
      } else {
        const res = await createMutation.mutateAsync(data);
        setFeedbackMessage({
          text: res?.message || 'Categoria criada com sucesso!',
          type: 'success',
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao salvar categoria.';
      setFeedbackMessage({ text: msg, type: 'error' });
      throw err;
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${cat.name}"?`)) {
      return;
    }

    const idToDelete = cat.display_id ?? cat.id;
    try {
      const res = await deleteMutation.mutateAsync(idToDelete);
      setFeedbackMessage({
        text: res?.message || 'Categoria excluída com sucesso!',
        type: 'success',
      });
    } catch (err: any) {
      // AC-108: Restrição de Exclusão Padrão / em uso
      const msg =
        err?.response?.data?.message ||
        'Não foi possível excluir a categoria. Ela pode estar em uso em transações ou ser protegida pelo sistema.';
      setFeedbackMessage({ text: msg, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Categorias</h2>
          <p className="text-sm text-slate-500">
            Gerencie as categorias de receitas e despesas para organizar seus lançamentos.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-semibold hover:underline cursor-pointer ml-4"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        {/* Abas superiores com contadores */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
              {counts.all}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('incomings')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'incomings'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Receitas
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
              {counts.incomings}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'expenses'
                ? 'bg-rose-50 text-rose-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Despesas
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
              {counts.expenses}
            </span>
          </button>
        </div>

        {/* Campo de busca rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar categorias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
          />
        </div>
      </div>

      {/* Content List / Table */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Carregando categorias...</div>
      ) : queryError ? (
        <div className="p-8 text-center text-rose-500 text-sm">Erro ao carregar categorias.</div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-500 text-sm">Nenhuma categoria encontrada.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="divide-y divide-slate-100">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cat.type === 'incomings'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {cat.type === 'incomings' ? 'Receita' : 'Despesa'}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{cat.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    aria-label={`Editar ${cat.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    aria-label={`Excluir ${cat.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        category={selectedCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

