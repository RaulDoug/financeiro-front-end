import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { useModalTransition } from '../../hooks/useModalTransition.ts';

interface WalletDeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  walletName: string;
  onConfirmDelete: () => Promise<void>;
  isLoading?: boolean;
}

export const WalletDeleteAlert: React.FC<WalletDeleteAlertProps> = ({
  isOpen,
  onClose,
  walletName,
  onConfirmDelete,
  isLoading = false,
}) => {
  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen,
    duration: 200,
    onClose,
  });

  const [typedName, setTypedName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRendered, triggerClose]);

  useEffect(() => {
    if (!isOpen) {
      setTypedName('');
      setError(null);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  const isMatching = typedName.trim() === walletName.trim();

  const handleConfirm = async () => {
    if (!isMatching) {
      setError('O nome digitado não coincide com o nome da carteira.');
      return;
    }

    try {
      await onConfirmDelete();
      triggerClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Erro ao excluir carteira.');
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-scrollbar ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      onClick={triggerClose}
      data-testid="wallet-delete-alert"
    >
      <div
        className={`bg-white rounded-2xl shadow-xl border border-rose-100 w-full max-w-md overflow-hidden ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/50">
          <div className="flex items-center gap-2.5 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold text-rose-900">Excluir Carteira Definitivamente</h2>
          </div>
          <button
            type="button"
            onClick={triggerClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Esta ação é <strong className="text-rose-600 font-semibold">irreversível</strong>. Todos os dados associados a esta carteira (lançamentos, cartões, contas e configurações) serão excluídos permanentemente.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
            Para confirmar a exclusão, digite exatamente o nome da carteira:{' '}
            <strong className="select-all font-mono font-bold text-slate-900">{walletName}</strong>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Confirmação do nome da carteira
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => {
                setTypedName(e.target.value);
                setError(null);
              }}
              placeholder={walletName}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
            />
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={triggerClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!isMatching || isLoading}
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              {isLoading ? 'Excluindo...' : 'Sim, excluir carteira'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

