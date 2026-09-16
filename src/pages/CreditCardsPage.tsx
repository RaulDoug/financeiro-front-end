import React, { useState } from 'react';
import { Plus, CreditCard as CardIcon } from 'lucide-react';
import { useCreditCards } from '../hooks/useCreditCards.ts';
import { useCreditCardMutations } from '../hooks/useCreditCardMutations.ts';
import { CreditCardVisual } from '../components/credit-cards/CreditCardVisual.tsx';
import { InvoiceSummary } from '../components/credit-cards/InvoiceSummary.tsx';
import { CreditCardModal } from '../components/credit-cards/CreditCardModal.tsx';
import { CreditCardDeleteDialog } from '../components/credit-cards/CreditCardDeleteDialog.tsx';
import type { CreditCardItem, CreditCardFormData } from '../types/creditCard.ts';

export const CreditCardsPage: React.FC = () => {
  const { data: cards = [], isLoading } = useCreditCards();
  const { createMutation, updateMutation, deleteMutation } = useCreditCardMutations();

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCardItem | null>(null);
  const [deletingCard, setDeletingCard] = useState<CreditCardItem | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const activeCard =
    cards.find((c) => c.id === selectedCardId) || (cards.length > 0 ? cards[0] : null);

  const handleOpenNew = () => {
    setErrorFeedback(null);
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card: CreditCardItem) => {
    setErrorFeedback(null);
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreditCardFormData) => {
    try {
      setErrorFeedback(null);
      if (editingCard) {
        const idToUpdate = (editingCard.display_id ?? editingCard.id) as any;
        await updateMutation.mutateAsync({ id: idToUpdate, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingCard(null);
    } catch (error: any) {
      console.error('Erro ao salvar cartão:', error);
      const msg = error?.response?.data?.message || error?.message || 'Erro ao salvar cartão de crédito.';
      setErrorFeedback(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCard) return;
    try {
      setErrorFeedback(null);
      const idToDelete = (deletingCard.display_id ?? deletingCard.id) as any;
      await deleteMutation.mutateAsync(idToDelete);
      if (selectedCardId === deletingCard.id) {
        setSelectedCardId(null);
      }
      setDeletingCard(null);
    } catch (error: any) {
      console.error('Erro ao excluir cartão:', error);
      const msg = error?.response?.data?.message || error?.message || 'Erro ao excluir cartão de crédito.';
      setErrorFeedback(msg);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto" data-testid="credit-cards-page">
      {errorFeedback && (
        <div
          data-testid="credit-card-error-banner"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between"
        >
          <span>{errorFeedback}</span>
          <button
            type="button"
            onClick={() => setErrorFeedback(null)}
            className="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer ml-4"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cartões de Crédito</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie limites, vencimentos e o detalhamento das faturas dos seus cartões.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          data-testid="new-credit-card-button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Cartão
        </button>
      </div>

      {/* Grid de Cartões Físicos */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <CardIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Nenhum cartão cadastrado</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Cadastre seu primeiro cartão de crédito para acompanhar faturas e limites em tempo real.
          </p>
          <button
            type="button"
            onClick={handleOpenNew}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Cadastrar Cartão Agora
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="credit-cards-grid">
            {cards.map((card) => (
              <CreditCardVisual
                key={card.id}
                card={card}
                isSelected={activeCard?.id === card.id}
                onSelect={() => setSelectedCardId(card.id)}
                onEdit={() => handleOpenEdit(card)}
                onDelete={() => setDeletingCard(card)}
              />
            ))}
          </div>

          {/* Detalhe da fatura do cartão selecionado */}
          {activeCard && <InvoiceSummary card={activeCard} />}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <CreditCardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
        }}
        initialData={editingCard}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Diálogo de Exclusão */}
      <CreditCardDeleteDialog
        isOpen={Boolean(deletingCard)}
        card={deletingCard}
        onClose={() => setDeletingCard(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default CreditCardsPage;

