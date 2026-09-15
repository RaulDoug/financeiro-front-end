import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Landmark, BarChart2, TrendingUp, Settings, X } from 'lucide-react';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const moreItems = [
    { label: 'Contas Bancárias', href: '/contas', icon: Landmark, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50' },
    { label: 'Relatórios Financeiros', href: '/relatorios', icon: BarChart2, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'Investimentos', href: '/investimentos', icon: TrendingUp, color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50' },
    { label: 'Configurações', href: '/configuracoes', icon: Settings, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden" data-testid="more-menu-modal">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        data-testid="more-menu-backdrop"
      />

      {/* Drawer */}
      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl z-50 animate-in slide-in-from-bottom duration-200 pb-safe">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Mais opções</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 py-4">
          {moreItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <div className={`p-2.5 rounded-xl ${item.color} mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoreMenuModal;

