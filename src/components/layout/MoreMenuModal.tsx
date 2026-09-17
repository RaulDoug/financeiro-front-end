import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Landmark, BarChart2, TrendingUp, Settings, X } from 'lucide-react';
import { useModalTransition } from '../../hooks/useModalTransition.ts';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({ isOpen, onClose }) => {
  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen,
    duration: 200,
    onClose,
  });

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement)?.closest('button, a')) {
      return;
    }
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 90) {
      setDragY(0);
      triggerClose();
    } else {
      setDragY(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.closest('button, a')) {
      return;
    }
    touchStartY.current = e.clientY;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 90) {
      setDragY(0);
      triggerClose();
    } else {
      setDragY(0);
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragY((curr) => {
        if (curr > 90) {
          triggerClose();
          return 0;
        }
        return 0;
      });
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, triggerClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isRendered, triggerClose]);

  if (!isRendered) return null;

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
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity ${
          isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
        }`}
        style={{
          opacity: dragY > 0 ? Math.max(0, 1 - dragY / 300) : undefined,
        }}
        onClick={triggerClose}
        data-testid="more-menu-backdrop"
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl z-50 pb-safe ${
          isClosing ? 'animate-drawer-out' : isDragging || dragY > 0 ? '' : 'animate-drawer-in'
        }`}
        style={{
          transform: isClosing ? undefined : dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Handle superior de arraste */}
        <div
          className="w-full flex justify-center pb-2 pt-0.5 cursor-grab touch-none select-none active:cursor-grabbing"
          id="more-menu-handle"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>

        <div
          className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white pointer-events-none">Mais opções</h3>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerClose();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => {
              e.stopPropagation();
              triggerClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Fechar menu"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
                onClick={() => triggerClose()}
                onTouchStart={(e) => e.stopPropagation()}
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
