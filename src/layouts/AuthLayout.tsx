import React from 'react';
import { Outlet } from 'react-router-dom';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 text-white font-black text-2xl shadow-lg shadow-violet-500/30 mb-3">
          F
        </div>
        <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
          FinFlow
        </h2>
        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
          Gestão Financeira Descomplicada
        </p>
      </header>

      <main className="w-full flex justify-center">
        {children || <Outlet />}
      </main>

      <footer className="mt-8 text-xs text-zinc-400 dark:text-zinc-500">
        &copy; {new Date().getFullYear()} FinFlow. Todos os direitos reservados.
      </footer>
    </div>
  );
};

