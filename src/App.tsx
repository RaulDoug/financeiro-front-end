import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.ts';
import { AppRoutes } from './routes/index.tsx';
import { useThemeStore } from './stores/theme.store.ts';

export const App: React.FC = () => {
  useEffect(() => {
    useThemeStore.getState().initializeTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;
