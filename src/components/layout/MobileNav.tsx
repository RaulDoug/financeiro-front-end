import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, CreditCard, Grid, Plus } from 'lucide-react';
import { useTransactionModalStore } from '../../stores/transactionModal.store.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';
import { MoreMenuModal } from './MoreMenuModal.tsx';

export const MobileNav: React.FC = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const openModal = useTransactionModalStore((state) => state.openModal);
  const currentWallet = useWalletStore((state) => state.currentWallet);
  const isViewer = currentWallet?.role === 'viewer';

  const navItems = [
    { label: 'Início', href: '/dashboard', icon: LayoutDashboard, testId: 'mobile-nav-dashboard' },
    { label: 'Transações', href: '/transacoes', icon: ArrowLeftRight, testId: 'mobile-nav-transacoes' },
    { label: 'Cartões', href: '/cartoes', icon: CreditCard, testId: 'mobile-nav-cartoes' },
  ];

  const isMoreActive = ['/contas', '/relatorios', '/investimentos', '/configuracoes'].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <nav
        aria-label="Navegação móvel"
        data-testid="mobile-bottom-nav"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] md:hidden pb-safe"
      >
        <div className="relative flex items-center justify-around h-16 px-2">
          {/* Item 1: Início */}
          <NavLink
            to={navItems[0].href}
            data-testid={navItems[0].testId}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{navItems[0].label}</span>
          </NavLink>

          {/* Item 2: Transações */}
          <NavLink
            to={navItems[1].href}
            data-testid={navItems[1].testId}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{navItems[1].label}</span>
          </NavLink>

          {/* Item Central: Botão Flutuante de Nova Transação */}
          {!isViewer && (
            <div className="relative -top-5 flex justify-center items-center w-14 shrink-0">
              <button
                type="button"
                onClick={() => openModal()}
                data-testid="mobile-nav-quick-add"
                aria-label="Nova Transação"
                className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/35 flex items-center justify-center active:scale-95 transition-transform cursor-pointer ring-4 ring-[#faf8ff] dark:ring-slate-950"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Item 3: Cartões */}
          <NavLink
            to={navItems[2].href}
            data-testid={navItems[2].testId}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{navItems[2].label}</span>
          </NavLink>

          {/* Item 4: Mais */}
          <button
            type="button"
            data-testid="mobile-nav-more"
            onClick={() => setIsMoreOpen(true)}
            aria-label="Mais opções"
            className={`flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-colors cursor-pointer ${
              isMoreActive
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Mais</span>
          </button>
        </div>
      </nav>

      {/* Modal / Drawer com opções adicionais */}
      <MoreMenuModal isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
};

export default MobileNav;

