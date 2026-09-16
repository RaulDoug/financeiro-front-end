import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  Building2,
  BarChart3,
  TrendingUp,
  Settings,
  X,
} from 'lucide-react';
import { SidebarItem } from './SidebarItem.tsx';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Transações', href: '/transacoes', icon: ArrowLeftRight },
  { label: 'Cartões', href: '/cartoes', icon: CreditCard },
  { label: 'Contas', href: '/contas', icon: Building2 },
  { label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { label: 'Investimentos', href: '/investimentos', icon: TrendingUp },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  return (
    <aside
      data-testid="app-sidebar"
      aria-label="Menu Lateral"
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:z-10 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Mobile close header */}
      <div className="flex items-center justify-between p-4 md:hidden border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="FinFlow"
            className="w-8 h-8 rounded-xl object-contain"
          />
          <span className="font-bold text-slate-900 dark:text-white">FinFlow</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            onClick={onClose}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
