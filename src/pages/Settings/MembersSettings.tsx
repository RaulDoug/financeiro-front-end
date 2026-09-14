import React from 'react';
import { Users, Clock, ShieldCheck } from 'lucide-react';

export const MembersSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Equipe & Membros</h2>
        <p className="text-sm text-slate-500">
          Gerenciamento de acessos compartilhados, convites e permissões da carteira.
        </p>
      </div>

      {/* AC-116: Interface de Equipe (Placeholder card) */}
      <div
        data-testid="members-placeholder"
        className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs text-center max-w-xl mx-auto my-8 space-y-4"
      >
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Users className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Em Breve
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Compartilhamento de Carteiras & Gestão de Equipe
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            O recurso de convites de membros, controle granular de papéis (proprietário, editor, visualizador) e auditoria de atividades estará disponível em uma próxima versão.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-left">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Níveis de Acesso
            </div>
            <p className="text-xs text-slate-500">
              Defina quem pode criar lançamentos ou apenas visualizar gráficos.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              Colaboração em Tempo Real
            </div>
            <p className="text-xs text-slate-500">
              Gerencie despesas de família ou negócios com múltiplos participantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersSettings;

