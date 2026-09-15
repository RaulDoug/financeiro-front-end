# Tasks: App Shell

> feature: app-shell

## T-015 — Configurar Store de Wallet e Contexto Global [concluida]
- Refs: US-007, AC-026
- Arquivos: src/stores/wallet.store.ts
- Notas: Configurar store Zustand para gerenciar o contexto da Carteira (Wallet) ativa, persistindo no localStorage (ASM-008).

## T-016 — Configurar Interceptor do Axios com Header x-wallet-id [concluida]
- Refs: AC-027
- Arquivos: src/lib/axios.ts
- Notas: Configurar interceptor do Axios para adicionar o header x-wallet-id em todas as requisições autenticadas.

## T-017 — Implementar Proteção de Rotas com Seleção de Carteira [concluida]
- Refs: AC-028
- Arquivos: src/routes/PrivateRoute.tsx, src/routes/index.tsx
- Notas: Implementar proteção de rotas garantindo que o usuário tenha JWT válido e resolva a seleção de carteira padrão (ASM-010).

## T-018 — Layout Base com Áreas de Sidebar e Topbar [concluida]
- Refs: AC-021
- Arquivos: src/layouts/AppLayout.tsx, src/main.tsx, src/lib/queryClient.ts, src/assets/hero.png, src/assets/react.svg, src/assets/vite.svg, src/components/index.ts, src/hooks/index.ts, src/pages/index.ts, src/services/index.ts, src/stores/index.ts
- Notas: Criar componente base de Layout com áreas para Sidebar e Topbar.

## T-019 — Menu Lateral (Sidebar) Responsivo [concluida]
- Refs: AC-021, AC-022
- Arquivos: src/components/layout/Sidebar.tsx, src/components/layout/SidebarItem.tsx
- Notas: Implementar o componente de Menu Lateral (Sidebar) com links de navegação e comportamento responsivo (collapsible/drawer no mobile).

## T-020 — Barra Superior (Topbar) com Notificações e Menu de Perfil [concluida]
- Refs: AC-023, AC-024
- Arquivos: src/components/layout/Topbar.tsx, src/components/layout/NotificationsBell.tsx, src/components/layout/UserMenu.tsx
- Notas: Implementar a Topbar contendo Logo, botão de hambúrguer (mobile), e integrar sino de notificações (overdue count) e Avatar (User Menu).

## T-021 — Seletor de Carteira com Invalidação de Cache [concluida]
- Refs: AC-025, AC-026
- Arquivos: src/components/layout/WalletSelector.tsx, src/hooks/useWallets.ts
- Notas: Criar hook e componente Dropdown seletor de Carteira consumindo GET /api/wallet (ASM-007), disparando a invalidação do React Query (queryClient.invalidateQueries) ao alterar (ASM-009).

## T-082 — Configurar Store de Tema e Sincronização [concluida]
- Refs: US-034, AC-118, AC-119
- Arquivos: src/stores/theme.store.ts, src/App.tsx
- Notas: Criar store Zustand com suporte a light, dark e system, persistência no localStorage e listener para matchMedia.

## T-083 — Componente Seletor de Tema na Topbar [concluida]
- Refs: US-034, AC-118
- Arquivos: src/components/layout/ThemeToggle.tsx, src/components/layout/Topbar.tsx
- Notas: Adicionar seletor dropdown com opções Claro, Escuro e Sistema e ícones do Lucide.

## T-084 — Estilos e Classes Dark Mode no Tailwind [concluida]
- Refs: US-034, AC-119
- Arquivos: src/index.css, src/layouts/AppLayout.tsx
- Notas: Configurar custom-variant dark e classes de cor escura para transição suave de tela.

