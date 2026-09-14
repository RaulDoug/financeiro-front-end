import React from 'react';
import { Bell } from 'lucide-react';

export interface NotificationsBellProps {
  count?: number;
  onClick?: () => void;
}

export const NotificationsBell: React.FC<NotificationsBellProps> = ({
  count = 0,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notificações"
      data-testid="notifications-bell"
      className="relative p-2 rounded-xl text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
    >
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <span
          data-testid="notifications-badge"
          className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-zinc-900"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationsBell;
