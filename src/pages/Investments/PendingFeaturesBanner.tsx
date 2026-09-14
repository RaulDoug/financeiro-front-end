import React from 'react';
import { Sparkles, Clock } from 'lucide-react';

export const PendingFeaturesBanner: React.FC = () => {
  return (
    <div
      data-testid="investment-pending-banner"
      className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-100 rounded-2xl shadow-2xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Movimentações de investimento em breve
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                <Clock className="w-3 h-3" />
                Em desenvolvimento
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              Nesta fase você pode catalogar seus ativos de custódia. Em breve estarão disponíveis as movimentações completas: aportes, resgates, apuração de rendimentos e controle de impostos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingFeaturesBanner;
