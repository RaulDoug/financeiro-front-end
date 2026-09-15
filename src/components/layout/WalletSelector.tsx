import React, { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, Check, Plus, X } from 'lucide-react';
import { useWalletStore, type Wallet as WalletType } from '../../stores/wallet.store.ts';
import { walletService } from '../../services/wallet.service.ts';
import { queryClient } from '../../lib/queryClient.ts';

export interface WalletSelectorProps {
  onWalletChange?: (wallet: WalletType) => void;
}

const roleLabels: Record<string, string> = {
  owner: 'Proprietário',
  editor: 'Editor',
  viewer: 'Visualizador',
};

const roleBadgeColors: Record<string, string> = {
  owner: 'bg-blue-50 text-blue-700 border-blue-200',
  editor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  viewer: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const WalletSelector: React.FC<WalletSelectorProps> = ({ onWalletChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { wallets, currentWallet, currentWalletId, setCurrentWalletId, addWallet } = useWalletStore();

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim() || newWalletName.trim().length < 2) {
      setCreateError('O nome da carteira deve ter pelo menos 2 caracteres');
      return;
    }
    setCreateError(null);
    setIsCreating(true);
    try {
      const res = await walletService.registerWallet({ name: newWalletName.trim() });
      if (res?.wallet) {
        addWallet(res.wallet);
        setCurrentWalletId(res.wallet.id);
        queryClient.invalidateQueries();
        if (onWalletChange) onWalletChange(res.wallet);
      }
      setShowCreateModal(false);
      setNewWalletName('');
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || 'Erro ao criar carteira');
    } finally {
      setIsCreating(false);
    }
  };

  const activeWallet =
    currentWallet ||
    wallets.find((w) => w.id === currentWalletId) ||
    (wallets.length > 0 ? wallets[0] : null);

  const handleSelectWallet = (wallet: WalletType) => {
    setCurrentWalletId(wallet.id);
    setIsOpen(false);
    if (onWalletChange) {
      onWalletChange(wallet);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeWallet && wallets.length === 0) {
    return null;
  }

  const role = activeWallet?.role || 'owner';

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        type="button"
        data-testid="wallet-selector-button"
        aria-label="Selecionar carteira"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-full sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-left shadow-2xs shrink-0 max-w-[130px] sm:max-w-none"
      >
        <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[70px] sm:max-w-[140px]">
            {activeWallet?.name || 'Selecione'}
          </span>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border hidden sm:inline-block ${
              roleBadgeColors[role] || roleBadgeColors.viewer
            }`}
          >
            {roleLabels[role] || role}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div
          data-testid="wallet-dropdown-list"
          className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
            Suas Carteiras
          </div>

          <div className="max-h-60 overflow-y-auto space-y-0.5 px-1">
            {wallets.map((wallet) => {
              const isSelected = wallet.id === activeWallet?.id;
              const itemRole = wallet.role || 'owner';

              return (
                <button
                  key={wallet.id}
                  type="button"
                  data-testid={`wallet-item-${wallet.id}`}
                  onClick={() => handleSelectWallet(wallet)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate">{wallet.name}</span>
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider w-fit px-1 rounded mt-0.5 border ${
                        roleBadgeColors[itemRole] || roleBadgeColors.viewer
                      }`}
                    >
                      {roleLabels[itemRole] || itemRole}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800 px-1">
            <button
              type="button"
              data-testid="create-wallet-trigger"
              onClick={() => {
                setIsOpen(false);
                setShowCreateModal(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer text-left"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Carteira</span>
            </button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Criar Nova Carteira</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWallet} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome da Carteira *
                </label>
                <input
                  type="text"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="Ex: Pessoal, Empresa, Viagens..."
                  autoFocus
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {createError && <p className="text-xs text-rose-500 mt-1">{createError}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isCreating ? 'Criando...' : 'Criar Carteira'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSelector;
