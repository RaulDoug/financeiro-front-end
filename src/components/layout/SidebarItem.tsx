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
            ? 'bg-blue-50 text-blue-600 font-semibold dark:bg-blue-950/60 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
        }`
      }
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
