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

const DashboardPlaceholder = () => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard FinFlow</h1>
    <p className="text-zinc-500 mt-2">Área autenticada com sucesso.</p>
  </div>
);

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
            <Route path="/dashboard" element={<DashboardPlaceholder />} />
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

