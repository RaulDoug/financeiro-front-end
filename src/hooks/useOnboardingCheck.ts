import { useEffect } from 'react';
import { useWalletStore } from '../stores/wallet.store.ts';
import { useAuthStore } from '../stores/auth.store.ts';

export interface OnboardingRedirectResult {
  shouldRedirect: boolean;
  redirectPath: string | null;
  isLoading: boolean;
}

export function evaluateOnboardingRedirect(
  isAuthenticated: boolean,
  hasCheckedWallets: boolean,
  walletsCount: number,
  currentPath: string
): OnboardingRedirectResult {
  if (!isAuthenticated) {
    return { shouldRedirect: true, redirectPath: '/login', isLoading: false };
  }

  if (!hasCheckedWallets) {
    return { shouldRedirect: false, redirectPath: null, isLoading: true };
  }

  const needsOnboarding = walletsCount === 0;

  if (needsOnboarding) {
    if (currentPath !== '/onboarding') {
      return { shouldRedirect: true, redirectPath: '/onboarding', isLoading: false };
    }
  } else {
    if (currentPath === '/onboarding') {
      return { shouldRedirect: true, redirectPath: '/dashboard', isLoading: false };
    }
  }

  return { shouldRedirect: false, redirectPath: null, isLoading: false };
}

export function useOnboardingCheck(currentPath: string) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { wallets, hasCheckedWallets, isLoading, fetchWallets } = useWalletStore();

  useEffect(() => {
    if (isAuthenticated && !hasCheckedWallets && !isLoading) {
      fetchWallets().catch(() => {
        // Silently catch to avoid uncaught promise rejections in UI
      });
    }
  }, [isAuthenticated, hasCheckedWallets, isLoading, fetchWallets]);

  const evaluation = evaluateOnboardingRedirect(
    isAuthenticated,
    hasCheckedWallets,
    wallets.length,
    currentPath
  );

  return {
    ...evaluation,
    isLoading: isLoading || evaluation.isLoading,
    needsOnboarding: hasCheckedWallets ? wallets.length === 0 : false,
  };
}

