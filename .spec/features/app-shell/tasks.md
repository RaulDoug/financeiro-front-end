# Tasks: App Shell

> status: [pendente]

## Contexto Global e Estado
- **T-015** [pendente] Configurar store Zustand para gerenciar o contexto da Carteira (Wallet) ativa, persistindo no `localStorage`.
  - **Refs:** US-007, AC-026, ASM-008
  - **Arquivos:** `src/stores/useWalletStore.ts`

- **T-016** [pendente] Configurar interceptor do Axios para adicionar o header `x-wallet-id` em todas as requisições autenticadas.
  - **Refs:** AC-027
  - **Arquivos:** `src/lib/axios.ts`, `src/services/api.ts`

- **T-017** [pendente] Implementar proteção de rotas (RequireAuth) garantindo que o usuário tenha JWT válido e resolva a seleção de carteira padrão.
  - **Refs:** AC-028, ASM-010
  - **Arquivos:** `src/components/auth/RequireAuth.tsx`, `src/routes/index.tsx`

## Componentes de Layout
- **T-018** [pendente] Criar componente base de Layout com áreas para Sidebar e Topbar.
  - **Refs:** AC-021
  - **Arquivos:** `src/components/layout/AppLayout.tsx`

- **T-019** [pendente] Implementar o componente de Menu Lateral (Sidebar) com links de navegação e comportamento responsivo (collapsible/drawer no mobile).
  - **Refs:** AC-021, AC-022
  - **Arquivos:** `src/components/layout/Sidebar.tsx`, `src/components/layout/SidebarItem.tsx`

- **T-020** [pendente] Implementar a Topbar contendo Logo, botão de hambúrguer (mobile), e integrar sino de notificações (overdue count) e Avatar (User Menu).
  - **Refs:** AC-023, AC-024
  - **Arquivos:** `src/components/layout/Topbar.tsx`, `src/components/layout/NotificationsBell.tsx`, `src/components/layout/UserMenu.tsx`

- **T-021** [pendente] Criar hook e componente Dropdown seletor de Carteira consumindo `GET /api/wallet`, disparando a invalidação do React Query (`queryClient.invalidateQueries`) ao alterar.
  - **Refs:** AC-025, AC-026, ASM-007, ASM-009
  - **Arquivos:** `src/components/layout/WalletSelector.tsx`, `src/hooks/useWallets.ts`, `src/services/walletService.ts`
