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
            ? 'bg-blue-50 text-blue-600 font-semibold'
            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
        }`
      }
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
