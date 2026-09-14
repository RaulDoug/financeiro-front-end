import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store.ts';
import { useOnboardingCheck } from '../hooks/useOnboardingCheck.ts';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const { isLoading, shouldRedirect, redirectPath } = useOnboardingCheck(location.pathname);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (shouldRedirect && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
