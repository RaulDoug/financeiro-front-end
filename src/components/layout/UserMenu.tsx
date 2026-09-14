import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store.ts';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const displayName = user?.name || 'Usuário';
  const displayEmail = user?.email || '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigateProfile = () => {
    setIsOpen(false);
    navigate('/configuracoes');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        data-testid="user-avatar-button"
        aria-label="Menu do Usuário"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
          {initials || <User className="w-4 h-4" />}
        </div>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 hidden sm:block">
          {displayName}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-400" />
      </button>

      {isOpen && (
        <div
          data-testid="user-dropdown-menu"
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
              {displayName}
            </p>
            {displayEmail && (
              <p className="text-xs text-zinc-400 truncate mt-0.5">{displayEmail}</p>
            )}
          </div>

          <button
            type="button"
            data-testid="user-menu-profile"
            onClick={handleNavigateProfile}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            Perfil & Configurações
          </button>

          <button
            type="button"
            data-testid="user-menu-logout"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left border-t border-zinc-100 dark:border-zinc-800"
          >
            <LogOut className="w-4 h-4" />
            Sair (Logout)
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
