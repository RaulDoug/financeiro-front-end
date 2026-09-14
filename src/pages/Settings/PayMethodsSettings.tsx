import React, { useState } from 'react';
import { Plus, CreditCard, Banknote, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { usePayMethods, usePayMethodMutations } from '../../hooks/usePayMethods.ts';
import { PayMethodModal } from './PayMethodModal.tsx';
import type { PayMethodItem, CreatePayMethodDTO } from '../../services/payMethod.service.ts';

export const PayMethodsSettings: React.FC = () => {
  const { data: payMethods = [], isLoading, error: queryError } = usePayMethods();
  const { createMutation, updateMutation, deleteMutation } = usePayMethodMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<PayMethodItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleOpenCreate = () => {
    setSelectedPayMethod(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (pm: PayMethodItem) => {
    setSelectedPayMethod(pm);
    setModalOpen(true);
  };

  const handleSave = async (data: CreatePayMethodDTO) => {
    try {
      if (selectedPayMethod) {
        const idToUpdate = selectedPayMethod.display_id ?? selectedPayMethod.id;
        const res = await updateMutation.mutateAsync({
          id: idToUpdate,
          data,
        });
        setFeedbackMessage({
          text: res?.message || 'Forma de pagamento atualizada com sucesso!',
          type: 'success',
        });
      } else {
        const res = await createMutation.mutateAsync(data);
        setFeedbackMessage({
          text: res?.message || 'Forma de pagamento criada com sucesso!',
          type: 'success',
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao salvar forma de pagamento.';
      setFeedbackMessage({ text: msg, type: 'error' });
      throw err;
    }
  };

  const handleDelete = async (pm: PayMethodItem) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${pm.name}"?`)) {
      return;
    }

    const idToDelete = pm.display_id ?? pm.id;
    try {
      const res = await deleteMutation.mutateAsync(idToDelete);
      setFeedbackMessage({
        text: res?.message || 'Forma de pagamento excluída com sucesso!',
        type: 'success',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Não foi possível excluir o método de pagamento. Ele pode estar associado a transações existentes.';
      setFeedbackMessage({ text: msg, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Formas de Pagamento</h2>
          <p className="text-sm text-slate-500">
            Gerencie cartões de crédito, dinheiro, contas bancárias e outras modalidades de pagamento.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Método
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

      {/* Content List */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Carregando formas de pagamento...</div>
      ) : queryError ? (
        <div className="p-8 text-center text-rose-500 text-sm">Erro ao carregar formas de pagamento.</div>
      ) : payMethods.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-500 text-sm">Nenhuma forma de pagamento cadastrada.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="divide-y divide-slate-100">
            {payMethods.map((pm) => (
              <div
                key={pm.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      pm.credit_card
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pm.credit_card ? (
                      <CreditCard className="w-5 h-5" />
                    ) : (
                      <Banknote className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{pm.name}</span>
                      {/* AC-111: Indicador de Cartão de Crédito */}
                      {pm.credit_card && (
                        <span
                          data-testid="credit-card-indicator"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          <CreditCard className="w-3 h-3" />
                          Cartão de Crédito
                        </span>
                      )}
                    </div>
                    {pm.last_four_digits && (
                      <p className="text-xs text-slate-400">Final •••• {pm.last_four_digits}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(pm)}
                    aria-label={`Editar ${pm.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pm)}
                    aria-label={`Excluir ${pm.name}`}
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
      <PayMethodModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        payMethod={selectedPayMethod}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

