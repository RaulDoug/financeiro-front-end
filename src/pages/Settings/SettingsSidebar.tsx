import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, Tag, Users2, CreditCard, Users } from 'lucide-react';

export interface SettingsNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const settingsNavItems: SettingsNavItem[] = [
  { id: 'general', label: 'Geral (Carteira)', href: '/settings/general', icon: Wallet },
  { id: 'categories', label: 'Categorias', href: '/settings/categories', icon: Tag },
  { id: 'counterparties', label: 'Contrapartes', href: '/settings/counterparties', icon: Users2 },
  { id: 'pay-methods', label: 'Métodos de Pagamento', href: '/settings/pay-methods', icon: CreditCard },
  { id: 'members', label: 'Membros', href: '/settings/members', icon: Users },
];

export const SettingsSidebar: React.FC = () => {
  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 shrink-0">
      {settingsNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

