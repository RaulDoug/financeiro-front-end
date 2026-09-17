import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SettingsSidebar } from './SettingsSidebar.tsx';

export const SettingsLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configurações</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gerencie os cadastros, formas de pagamento, carteira e preferências do FinFlow.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-60 shrink-0">
          <SettingsSidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0">
          <div key={location.pathname} className="animate-view-fade-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;

