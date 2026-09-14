import React, { useState } from 'react';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useInvestmentAssets, useInvestmentAssetMutations } from '../../hooks/useInvestmentAssets.ts';
import { PendingFeaturesBanner } from './PendingFeaturesBanner.tsx';
import { InvestmentList } from './InvestmentList.tsx';
import { InvestmentFormModal } from './InvestmentFormModal.tsx';
import { InvestmentDeleteAlert } from './InvestmentDeleteAlert.tsx';
import type { InvestmentAssetItem } from '../../types/investment.ts';

export const InvestmentsPage: React.FC = () => {
  const { data: assets = [], isLoading, error: queryError } = useInvestmentAssets();
  const { createMutation, updateMutation, deleteMutation } = useInvestmentAssetMutations();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<InvestmentAssetItem | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleOpenCreate = () => {
    setSelectedAsset(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (asset: InvestmentAssetItem) => {
    setSelectedAsset(asset);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (asset: InvestmentAssetItem) => {
    setSelectedAsset(asset);
    setDeleteModalOpen(true);
  };

  const handleSaveAsset = async (data: { name: string; bank_account_id: string; due_date?: string | null }) => {
    try {
      if (selectedAsset) {
        const idToUpdate = selectedAsset.display_id ?? selectedAsset.id;
        const res = await updateMutation.mutateAsync({
          id: idToUpdate,
          data: {
            name: data.name,
            due_date: data.due_date,
          },
        });
        setFeedback({
          text: res?.message || 'Ativo atualizado com sucesso!',
          type: 'success',
        });
      } else {
        const res = await createMutation.mutateAsync(data);
        setFeedback({
          text: res?.message || 'Ativo criado com sucesso!',
          type: 'success',
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao salvar ativo.';
      setFeedback({ text: msg, type: 'error' });
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAsset) return;
    const idToDelete = selectedAsset.display_id ?? selectedAsset.id;
    try {
      const res = await deleteMutation.mutateAsync(idToDelete);
      setFeedback({
        text: res?.message || 'Ativo removido com sucesso!',
        type: 'success',
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao remover ativo.';
      setFeedback({ text: msg, type: 'error' });
      throw err;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Investimentos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe a custódia dos seus ativos financeiros e títulos patrimoniais.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Ativo
        </button>
      </div>

      {/* Banner de Em Breve (AC-095) */}
      <PendingFeaturesBanner />

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold hover:underline cursor-pointer ml-4"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Main Content (AC-089) */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Carregando ativos de investimento...</div>
      ) : queryError ? (
        <div className="p-12 text-center text-rose-500 text-sm">Erro ao carregar ativos de investimento.</div>
      ) : (
        <InvestmentList
          assets={assets}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Form Modal (AC-090, AC-091, AC-093, AC-094) */}
      <InvestmentFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSaveAsset}
        asset={selectedAsset}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Alert (AC-092) */}
      <InvestmentDeleteAlert
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        asset={selectedAsset}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default InvestmentsPage;
