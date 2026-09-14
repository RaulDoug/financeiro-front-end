import React, { useState } from 'react';
import { ReportsNavigation, type ReportTab } from './ReportsNavigation.tsx';
import { AnnualReport } from './AnnualReport.tsx';
import { CategoryReport } from './CategoryReport.tsx';
import { CounterpartyReport } from './CounterpartyReport.tsx';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('annual');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Relatórios Financeiros</h1>
        <p className="text-sm text-slate-500 mt-1">
          Acompanhe o demonstrativo anual, a distribuição de gastos por categoria e os fluxos por contraparte.
        </p>
      </div>

      {/* Navigation Tabs (AC-105) */}
      <ReportsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'annual' && <AnnualReport />}
      {activeTab === 'category' && <CategoryReport />}
      {activeTab === 'counterparty' && <CounterpartyReport />}
    </div>
  );
};

export default ReportsPage;

