import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Topbar } from '../components/layout/Topbar.tsx';
import { Sidebar } from '../components/layout/Sidebar.tsx';
import { WalletSelector } from '../components/layout/WalletSelector.tsx';
import { MobileNav } from '../components/layout/MobileNav.tsx';

export interface NavItem {
  label: string;
  href: string;
}

export const APP_SHELL_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Transações', href: '/transacoes' },
  { label: 'Cartões', href: '/cartoes' },
  { label: 'Contas', href: '/contas' },
  { label: 'Relatórios', href: '/relatorios' },
  { label: 'Investimentos', href: '/investimentos' },
  { label: 'Configurações', href: '/configuracoes' },
];

export function getAppShellNavLinks(): NavItem[] {
  return APP_SHELL_NAV_ITEMS;
}

export interface AppLayoutProps {
  topbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ topbar, sidebar, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Topbar container */}
      <div className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        {topbar || (
          <Topbar
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
            walletSelectorSlot={<WalletSelector />}
          />
        )}
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebar || (
          <Sidebar
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main
          data-testid="app-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8"
        >
          {children || <Outlet />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default AppLayout;
