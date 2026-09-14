# Tasks: App Shell

> feature: app-shell

## T-015 — Configurar Store de Wallet e Contexto Global [pendente]
- Refs: US-007, AC-026, ASM-008
- Arquivos: src/stores/wallet.store.ts
- Notas: Configurar store Zustand para gerenciar o contexto da Carteira (Wallet) ativa, persistindo no localStorage.

## T-016 — Configurar Interceptor do Axios com Header x-wallet-id [pendente]
- Refs: AC-027
- Arquivos: src/lib/axios.ts
- Notas: Configurar interceptor do Axios para adicionar o header x-wallet-id em todas as requisições autenticadas.

## T-017 — Implementar Proteção de Rotas com Seleção de Carteira [pendente]
- Refs: AC-028, ASM-010
- Arquivos: src/routes/PrivateRoute.tsx, src/routes/index.tsx
- Notas: Implementar proteção de rotas garantindo que o usuário tenha JWT válido e resolva a seleção de carteira padrão.

## T-018 — Layout Base com Áreas de Sidebar e Topbar [pendente]
- Refs: AC-021
- Arquivos: src/layouts/AppLayout.tsx
- Notas: Criar componente base de Layout com áreas para Sidebar e Topbar.

## T-019 — Menu Lateral (Sidebar) Responsivo [pendente]
- Refs: AC-021, AC-022
- Arquivos: src/components/layout/Sidebar.tsx, src/components/layout/SidebarItem.tsx
- Notas: Implementar o componente de Menu Lateral (Sidebar) com links de navegação e comportamento responsivo (collapsible/drawer no mobile).

## T-020 — Barra Superior (Topbar) com Notificações e Menu de Perfil [pendente]
- Refs: AC-023, AC-024
- Arquivos: src/components/layout/Topbar.tsx, src/components/layout/NotificationsBell.tsx, src/components/layout/UserMenu.tsx
- Notas: Implementar a Topbar contendo Logo, botão de hambúrguer (mobile), e integrar sino de notificações (overdue count) e Avatar (User Menu).

## T-021 — Seletor de Carteira com Invalidação de Cache [pendente]
- Refs: AC-025, AC-026, ASM-007, ASM-009
- Arquivos: src/components/layout/WalletSelector.tsx, src/hooks/useWallets.ts
- Notas: Criar hook e componente Dropdown seletor de Carteira consumindo GET /api/wallet, disparando a invalidação do React Query (queryClient.invalidateQueries) ao alterar.
