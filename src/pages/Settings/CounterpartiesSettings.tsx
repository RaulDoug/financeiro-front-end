import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useCounterparties, useCounterpartyMutations } from '../../hooks/useCounterparties.ts';
import { CounterpartyModal } from './CounterpartyModal.tsx';
import type { CounterpartyItem } from '../../services/counterparty.service.ts';

export const CounterpartiesSettings: React.FC = () => {
  const { data: counterparties = [], isLoading, error: queryError } = useCounterparties();
  const { createMutation, updateMutation, deleteMutation } = useCounterpartyMutations();

  const [activeTab, setActiveTab] = useState<'all' | 'payer' | 'payee'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCounterparty, setSelectedCounterparty] = useState<CounterpartyItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const counts = useMemo(() => {
    return {
      all: counterparties.length,
      payer: counterparties.filter((c) => c.type === 'payer').length,
      payee: counterparties.filter((c) => c.type === 'payee').length,
    };
  }, [counterparties]);

  const filteredCounterparties = useMemo(() => {
    return counterparties
      .filter((cp) => {
        if (activeTab === 'payer') return cp.type === 'payer';
        if (activeTab === 'payee') return cp.type === 'payee';
        return true;
      })
      .filter((cp) =>
        cp.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
  }, [counterparties, activeTab, searchQuery]);

  const handleOpenCreate = () => {
    setSelectedCounterparty(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cp: CounterpartyItem) => {
    setSelectedCounterparty(cp);
    setModalOpen(true);
  };

  const handleSave = async (data: { name: string; type: 'payer' | 'payee' }) => {
    try {
      if (selectedCounterparty) {
        const idToUpdate = selectedCounterparty.display_id ?? selectedCounterparty.id;
        const res = await updateMutation.mutateAsync({
          id: idToUpdate,
          data,
        });
        setFeedbackMessage({
          text: res?.message || 'Contraparte atualizada com sucesso!',
          type: 'success',
        });
      } else {
        const res = await createMutation.mutateAsync(data);
        setFeedbackMessage({
          text: res?.message || 'Contraparte criada com sucesso!',
          type: 'success',
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao salvar contraparte.';
      setFeedbackMessage({ text: msg, type: 'error' });
      throw err;
    }
  };

  const handleDelete = async (cp: CounterpartyItem) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${cp.name}"?`)) {
      return;
    }

    const idToDelete = cp.display_id ?? cp.id;
    try {
      const res = await deleteMutation.mutateAsync(idToDelete);
      setFeedbackMessage({
        text: res?.message || 'Contraparte excluída com sucesso!',
        type: 'success',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Não foi possível excluir a contraparte. Ela pode estar vinculada a transações existentes.';
      setFeedbackMessage({ text: msg, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Contrapartes</h2>
          <p className="text-sm text-slate-500">
            Cadastre e gerencie pagadores e recebedores para organizar as origens e destinos das transações.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nova Contraparte
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
            Todos
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
              {counts.all}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payer')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payer'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pagadores
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
              {counts.payer}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payee')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payee'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Recebedores
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
              {counts.payee}
            </span>
          </button>
        </div>

        {/* Campo de busca rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar contrapartes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
          />
        </div>
      </div>

      {/* Content List / Table */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Carregando contrapartes...</div>
      ) : queryError ? (
        <div className="p-8 text-center text-rose-500 text-sm">Erro ao carregar contrapartes.</div>
      ) : filteredCounterparties.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-500 text-sm">Nenhuma contraparte encontrada.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="divide-y divide-slate-100">
            {filteredCounterparties.map((cp) => (
              <div
                key={cp.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cp.type === 'payer'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {cp.type === 'payer' ? 'Pagador' : 'Recebedor'}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{cp.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cp)}
                    aria-label={`Editar ${cp.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cp)}
                    aria-label={`Excluir ${cp.name}`}
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
      <CounterpartyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        counterparty={selectedCounterparty}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

