import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarItemProps {
  label: string;
  href: string;
  icon?: React.ElementType;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon: Icon,
  onClick,
}) => {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
        }`
      }
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
