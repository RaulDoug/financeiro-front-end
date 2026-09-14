import React, { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, Check } from 'lucide-react';
import { useWalletStore, type Wallet as WalletType } from '../../stores/wallet.store.ts';

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { wallets, currentWallet, currentWalletId, setCurrentWalletId } = useWalletStore();

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
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-left shadow-xs"
      >
        <Wallet className="w-4 h-4 text-blue-600 shrink-0" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 truncate max-w-[140px]">
            {activeWallet?.name || 'Selecione'}
          </span>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
              roleBadgeColors[role] || roleBadgeColors.viewer
            }`}
          >
            {roleLabels[role] || role}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div
          data-testid="wallet-dropdown-list"
          className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 text-xs font-medium text-slate-400 border-b border-slate-100 mb-1">
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
        </div>
      )}
    </div>
  );
};

export default WalletSelector;
