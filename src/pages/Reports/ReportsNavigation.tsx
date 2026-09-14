import React from 'react';
import { BarChart3, PieChart, Users2 } from 'lucide-react';

export type ReportTab = 'annual' | 'category' | 'counterparty';

interface ReportsNavigationProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
}

export const ReportsNavigation: React.FC<ReportsNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'annual' as ReportTab, label: 'DRE (Anual)', icon: BarChart3 },
    { id: 'category' as ReportTab, label: 'Despesas por Categoria', icon: PieChart },
    { id: 'counterparty' as ReportTab, label: 'Relatório por Contraparte', icon: Users2 },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ReportsNavigation;

