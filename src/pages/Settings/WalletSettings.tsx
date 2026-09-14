import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Save, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWalletSettings } from '../../hooks/useWalletSettings.ts';
import { walletNameSchema } from '../../schemas/settingsSchemas.ts';
import { WalletDeleteAlert } from './WalletDeleteAlert.tsx';

export const WalletSettings: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentWallet,
    isOwner,
    updateWalletName,
    deleteCurrentWallet,
    isLoading,
  } = useWalletSettings();

  const [walletName, setWalletName] = useState(currentWallet?.name || '');
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (currentWallet?.name) {
      setWalletName(currentWallet.name);
    }
  }, [currentWallet?.name]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = walletNameSchema.safeParse({ name: walletName });
    if (!result.success) {
      setNameError(result.error.errors[0]?.message || 'Nome inválido');
      return;
    }
    setNameError(null);

    try {
      const res = await updateWalletName(walletName.trim());
      setFeedback({
        text: res?.message || 'Nome da carteira atualizado com sucesso!',
        type: 'success',
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao atualizar carteira.';
      setFeedback({ text: msg, type: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCurrentWallet();
      // Redireciona para onboarding ou dashboard
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao excluir carteira.';
      setFeedback({ text: msg, type: 'error' });
      throw err;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Geral da Carteira</h2>
        <p className="text-sm text-slate-500">
          Gerencie o nome e configurações essenciais da carteira selecionada.
        </p>
      </div>

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

      {/* Rename Wallet Card (AC-114) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <form onSubmit={handleSaveName} className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Nome da Carteira</h3>
              <p className="text-xs text-slate-500">
                Este nome é exibido no topo da barra de navegação e em relatórios.
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={walletName}
              onChange={(e) => {
                setWalletName(e.target.value);
                setNameError(null);
              }}
              placeholder="Ex: Finanças Pessoais, Empresa..."
              className={`w-full px-3.5 py-2.5 bg-white border ${
                nameError ? 'border-rose-500' : 'border-slate-300'
              } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
            />
            {nameError && <p className="mt-1 text-xs text-rose-500">{nameError}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Wallet Deletion (AC-115) */}
      <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-rose-900">Zona de Perigo</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Excluir esta carteira apagará permanentemente todos os registros vinculados.
            </p>
            {!isOwner && (
              <p className="text-xs text-amber-600 font-medium mt-1">
                Apenas usuários com papel de proprietário (owner) podem excluir a carteira.
              </p>
            )}
          </div>

          {isOwner && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Carteira
            </button>
          )}
        </div>
      </div>

      {/* Critical Delete Confirmation Modal */}
      {currentWallet && (
        <WalletDeleteAlert
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          walletName={currentWallet.name}
          onConfirmDelete={handleConfirmDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

