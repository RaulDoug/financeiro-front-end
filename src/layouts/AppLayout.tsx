import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Topbar } from '../components/layout/Topbar.tsx';
import { Sidebar } from '../components/layout/Sidebar.tsx';
import { WalletSelector } from '../components/layout/WalletSelector.tsx';
import { MobileNav } from '../components/layout/MobileNav.tsx';
import { TransactionDetailsModal } from '../components/transactions/TransactionDetailsModal.tsx';
import { GlobalTransactionModal } from '../components/transactions/GlobalTransactionModal.tsx';
import { useTransactionModalStore } from '../stores/transactionModal.store.ts';
import { useDemoStore } from '../stores/demo.store.ts';
import { useAuthStore } from '../stores/auth.store.ts';
import { Sparkles, LogOut } from 'lucide-react';

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

export function getAppShellNavLinks(isDemo = false): NavItem[] {
  if (isDemo) {
    return APP_SHELL_NAV_ITEMS.filter((item) => item.href !== '/investimentos' && item.href !== '/investments');
  }
  return APP_SHELL_NAV_ITEMS;
}

export interface AppLayoutProps {
  topbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ topbar, sidebar, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const closeModal = useTransactionModalStore((state) => state.closeModal);
  const token = useAuthStore((state) => state.token);
  const isDemoFromStore = useDemoStore((state) => state.isDemoMode);
  const isDemoMode = isDemoFromStore || token === 'mock-demo-session-token';
  const exitDemo = useDemoStore((state) => state.exitDemo);

  const handleExitDemo = () => {
    exitDemo();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    closeModal();
  }, [location.pathname, closeModal]);

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Banner de Modo Demonstração */}
      {isDemoMode && (
        <div
          data-testid="demo-mode-banner"
          className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-medium shadow-md sticky top-0 z-50"
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </span>
            <span>
              <strong>Modo Demonstração:</strong> Dados meramente ilustrativos e não refletem a realidade. Nenhuma informação é enviada ao servidor.
            </span>
          </div>
          <button
            type="button"
            onClick={handleExitDemo}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 text-white font-semibold cursor-pointer transition-colors shrink-0 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Demonstração</span>
          </button>
        </div>
      )}

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
          <div
            key={location.pathname.split('/')[1] || 'root'}
            className="animate-view-fade-in w-full h-full"
          >
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modal Global de Lançamento de Transação */}
      <GlobalTransactionModal />

      {/* Modal Global de Detalhes da Transação */}
      <TransactionDetailsModal />
    </div>
  );
};

export default AppLayout;
