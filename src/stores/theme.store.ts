import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  initializeTheme: () => void;
}

const STORAGE_KEY = 'finflow_theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function applyThemeClass(resolvedTheme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  resolvedTheme: 'light',

  setTheme: (newTheme: ThemeMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newTheme);
    }
    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
    applyThemeClass(resolved);
    set({ theme: newTheme, resolvedTheme: resolved });
  },

  initializeTheme: () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const currentTheme: ThemeMode = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    const resolved = currentTheme === 'system' ? getSystemTheme() : currentTheme;

    applyThemeClass(resolved);
    set({ theme: currentTheme, resolvedTheme: resolved });

    // Listener para reagir a alterações no tema do SO
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = (e: MediaQueryListEvent) => {
        if (get().theme === 'system') {
          const updatedResolved = e.matches ? 'dark' : 'light';
          applyThemeClass(updatedResolved);
          set({ resolvedTheme: updatedResolved });
        }
      };

      mediaQuery.removeEventListener('change', handleSystemChange);
      mediaQuery.addEventListener('change', handleSystemChange);
    }
  },
}));

