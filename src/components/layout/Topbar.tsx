import React from 'react';
import { Menu } from 'lucide-react';
import { NotificationsBell } from './NotificationsBell.tsx';
import { UserMenu } from './UserMenu.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';

export interface TopbarProps {
  onToggleMobileMenu?: () => void;
  walletSelectorSlot?: React.ReactNode;
  overdueAlertsCount?: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
  walletSelectorSlot,
  overdueAlertsCount,
}) => {
  return (
    <header className="h-16 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-4 max-w-full">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        {/* Menu hambúrguer ocultado no mobile pois a navegação é provida pela Bottom Navigation */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          data-testid="mobile-hamburger-button"
          aria-label="Abrir menu lateral"
          className="hidden p-1.5 sm:p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <img
            src="/logo.png"
            alt="FinFlow"
            className="w-8 h-8 rounded-xl object-contain"
          />
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight hidden md:block">
            FinFlow
          </span>
        </div>

        {/* Seletor de Carteira Slot */}
        {walletSelectorSlot && (
          <div className="min-w-0 max-w-[130px] sm:max-w-none ml-1 sm:ml-2 md:ml-4">{walletSelectorSlot}</div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
        <ThemeToggle />
        <NotificationsBell count={overdueAlertsCount} />
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;
