import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout.tsx';
import { LoginPage } from '../pages/auth/LoginPage.tsx';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage.tsx';
import { PublicRoute } from './PublicRoute.tsx';
import { PrivateRoute } from './PrivateRoute.tsx';
import { AppLayout } from '../layouts/AppLayout.tsx';
import { DashboardPage } from '../pages/Dashboard/DashboardPage.tsx';

import { TransactionsPage } from '../pages/Transactions/index.tsx';
import { CreditCardsPage } from '../pages/CreditCardsPage.tsx';
import { BankAccountsPage } from '../pages/BankAccountsPage.tsx';
import { InvestmentsPage } from '../pages/Investments/index.tsx';
import { ReportsPage } from '../pages/Reports/index.tsx';
import { DemoRedirectPage } from '../pages/demo/DemoRedirectPage.tsx';
import { useDemoStore } from '../stores/demo.store.ts';
import { useAuthStore } from '../stores/auth.store.ts';
import {
  SettingsLayout,
  WalletSettings,
  CategoriesSettings,
  CounterpartiesSettings,
  PayMethodsSettings,
  MembersSettings,
} from '../pages/Settings/index.tsx';

const InvestmentsRoute: React.FC = () => {
  const isDemoStore = useDemoStore((state) => state.isDemoMode);
  const token = useAuthStore((state) => state.token);
  const isDemoMode = isDemoStore || token === 'mock-demo-session-token';
  if (isDemoMode) {
    return <Navigate to="/dashboard" replace />;
  }
  return <InvestmentsPage />;
};

const DefaultRoute: React.FC = () => {
  const { isAuthenticated, token } = useAuthStore();
  const isDemoMode = useDemoStore((state) => state.isDemoMode);

  // Usuário autenticado com conta real (não demo) permanece no dashboard
  const isRealUser = isAuthenticated && !isDemoMode && token && token !== 'mock-demo-session-token';
  if (isRealUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Tela padrão: Modo Demonstração
  return <Navigate to="/demo" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota direta do Modo Demo */}
        <Route path="/demo" element={<DemoRedirectPage />} />

        {/* Rotas Públicas com AuthLayout */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        {/* Rotas Privadas */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transacoes" element={<TransactionsPage />} />
            <Route path="/credit-cards" element={<CreditCardsPage />} />
            <Route path="/cartoes" element={<CreditCardsPage />} />
            <Route path="/bank-accounts" element={<BankAccountsPage />} />
            <Route path="/contas" element={<BankAccountsPage />} />
            <Route path="/investments" element={<InvestmentsRoute />} />
            <Route path="/investimentos" element={<InvestmentsRoute />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/relatorios" element={<ReportsPage />} />

            {/* Configurações */}
            <Route path="/settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="/settings/categories" replace />} />
              <Route path="general" element={<WalletSettings />} />
              <Route path="categories" element={<CategoriesSettings />} />
              <Route path="counterparties" element={<CounterpartiesSettings />} />
              <Route path="pay-methods" element={<PayMethodsSettings />} />
              <Route path="members" element={<MembersSettings />} />
            </Route>
            <Route path="/configuracoes" element={<Navigate to="/settings/categories" replace />} />
            <Route path="/configuracoes/*" element={<Navigate to="/settings" replace />} />
            <Route path="/convites" element={<Navigate to="/settings/members" replace />} />
            <Route path="/invites" element={<Navigate to="/settings/members" replace />} />
            <Route path="/membros" element={<Navigate to="/settings/members" replace />} />
          </Route>
          <Route path="/onboarding" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback & Redirecionamentos */}
        <Route path="/" element={<DefaultRoute />} />
        <Route path="*" element={<DefaultRoute />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

