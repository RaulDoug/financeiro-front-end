import React from 'react';
import { Menu } from 'lucide-react';
import { NotificationsBell } from './NotificationsBell.tsx';
import { UserMenu } from './UserMenu.tsx';

export interface TopbarProps {
  onToggleMobileMenu?: () => void;
  walletSelectorSlot?: React.ReactNode;
  overdueAlertsCount?: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
  walletSelectorSlot,
  overdueAlertsCount = 0,
}) => {
  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          data-testid="mobile-hamburger-button"
          aria-label="Abrir menu lateral"
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 md:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            FF
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight hidden sm:block">
            FinFlow
          </span>
        </div>

        {/* Seletor de Carteira Slot */}
        {walletSelectorSlot && (
          <div className="ml-2 md:ml-4">{walletSelectorSlot}</div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationsBell count={overdueAlertsCount} />
        <div className="h-5 w-px bg-slate-200 hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;
