import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store.ts';
import { useDemoStore } from '../stores/demo.store.ts';

interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();
  const isDemoMode = useDemoStore((state) => state.isDemoMode);
  const isDemoSession = isDemoMode || token === 'mock-demo-session-token';

  // Se o usuário estiver em sessão demo e acessar uma rota pública (ex: /login), encerra a demo
  useEffect(() => {
    if (isDemoSession) {
      useDemoStore.getState().exitDemo();
    }
  }, [isDemoSession]);

  // Apenas redireciona para o dashboard se for um usuário autenticado REAL (não-demo)
  const isRealUser = isAuthenticated && !isDemoSession && token;
  if (isRealUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;

