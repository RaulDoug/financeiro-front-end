import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../stores/demo.store.ts';
import { Loader2, Sparkles } from 'lucide-react';

export const DemoRedirectPage: React.FC = () => {
  const navigate = useNavigate();
  const enterDemo = useDemoStore((state) => state.enterDemo);

  useEffect(() => {
    // Inicializar estado demonstrativo e redirecionar para o dashboard
    enterDemo();
    navigate('/dashboard', { replace: true });
  }, [enterDemo, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center gap-4 max-w-sm text-center">
        <div className="w-12 h-12 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Modo Demonstração</h2>
          <p className="text-xs text-slate-400 mt-1">
            Carregando ambiente com dados fictícios para você explorar...
          </p>
        </div>
        <div className="flex items-center gap-2 text-violet-400 text-xs font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Iniciando painel...</span>
        </div>
      </div>
    </div>
  );
};

export default DemoRedirectPage;
