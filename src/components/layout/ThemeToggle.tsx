import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useThemeStore, type ThemeMode } from '../../stores/theme.store.ts';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Claro', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { mode: 'dark', label: 'Escuro', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
    { mode: 'system', label: 'Sistema', icon: <Monitor className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Alternar tema de cor"
        data-testid="theme-toggle-button"
        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-5 h-5 text-indigo-400" />
        ) : (
          <Sun className="w-5 h-5 text-amber-500" />
        )}
      </button>

      {isOpen && (
        <div
          data-testid="theme-dropdown"
          className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 text-xs"
        >
          {options.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              onClick={() => {
                setTheme(opt.mode);
                setIsOpen(false);
              }}
              data-testid={`theme-option-${opt.mode}`}
              className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                theme === opt.mode
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {opt.icon}
                <span>{opt.label}</span>
              </div>
              {theme === opt.mode && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;

