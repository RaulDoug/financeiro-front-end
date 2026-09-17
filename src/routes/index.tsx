import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout.tsx';
import { LoginPage } from '../pages/auth/LoginPage.tsx';
import { RegisterPage } from '../pages/auth/RegisterPage.tsx';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage.tsx';
import { PublicRoute } from './PublicRoute.tsx';
import { PrivateRoute } from './PrivateRoute.tsx';
import { OnboardingPage } from '../pages/onboarding/OnboardingPage.tsx';
import { AppLayout } from '../layouts/AppLayout.tsx';
import { DashboardPage } from '../pages/Dashboard/DashboardPage.tsx';

import { TransactionsPage } from '../pages/Transactions/index.tsx';
import { CreditCardsPage } from '../pages/CreditCardsPage.tsx';
import { BankAccountsPage } from '../pages/BankAccountsPage.tsx';
import { InvestmentsPage } from '../pages/Investments/index.tsx';
import { ReportsPage } from '../pages/Reports/index.tsx';
import {
  SettingsLayout,
  WalletSettings,
  CategoriesSettings,
  CounterpartiesSettings,
  PayMethodsSettings,
  MembersSettings,
} from '../pages/Settings/index.tsx';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas com AuthLayout */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
            <Route path="/investments" element={<InvestmentsPage />} />
            <Route path="/investimentos" element={<InvestmentsPage />} />
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
          </Route>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Fallback & Redirecionamentos */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

