# Tasks: Ajustes mobile tema notificacoes

> feature: ajustes-mobile-tema-notificacoes

## T-087 — Correção do fluxo de dados e badge do Sino de Notificações [concluida]
- Refs: US-031, AC-123, AC-124, AC-125
- Arquivos: src/components/layout/NotificationsBell.tsx, src/components/layout/Topbar.tsx
- Notas: Remover default que forçava count=0 no Topbar; permitir que NotificationsBell busque pendências autônomas via getOverdueAlerts() para a carteira ativa; exibir badge correto e lista de pendências no popover.

## T-088 — Ajuste de cores dos cards da Dashboard e componentes no Tema Escuro [concluida]
- Refs: US-032, AC-126
- Arquivos: src/pages/Dashboard/components/KpiCards.tsx, src/pages/Dashboard/components/AccountBalances.tsx, src/pages/Dashboard/components/CreditCardSummary.tsx, src/pages/Dashboard/components/RecentTransactions.tsx, src/pages/Dashboard/components/OverdueAlerts.tsx, src/pages/Dashboard/components/QuickActions.tsx, src/index.css
- Notas: Aplicar dark:bg-slate-900, dark:border-slate-800 e dark:text-slate-100 nos cards de KPI, gráficos e seções; ajustar CSS para evitar que .bg-white prevaleça indevidamente no modo escuro.

## T-089 — Adaptação da Tabela e Filtros de Transações ao Tema Escuro [concluida]
- Refs: US-032, AC-127, AC-128
- Arquivos: src/components/transactions/TransactionTable.tsx, src/components/transactions/TransactionFilters.tsx, src/pages/Transactions/index.tsx
- Notas: Atualizar tabela de transações, cabeçalho thead, linhas, divisores e botões de filtro com classes dark: (dark:bg-slate-900, dark:divide-slate-800, dark:text-slate-300).

## T-090 — Header Mobile Compacto Anti-Quebra e Seletor de Carteira Responsivo [concluida]
- Refs: US-033, AC-129
- Arquivos: src/components/layout/Topbar.tsx, src/components/layout/WalletSelector.tsx
- Notas: Otimizar disposição do header em viewports < 640px conforme design de dashboard_finflow; limitar e truncar a pílula da carteira (max-w-[120px] no mobile); evitar transbordamento horizontal de ícones.

## T-091 — Barra de Navegação Inferior Mobile (Bottom Navigation) com Ação Rápida [concluida]
- Refs: US-033, AC-130, AC-131, AC-132
- Arquivos: src/components/layout/MobileNav.tsx, src/layouts/AppLayout.tsx, src/components/layout/MoreMenuModal.tsx
- Notas: Criar barra inferior fixa (Início, Transações, Botão central +, Cartões, Mais) em telas < md; disparar modal de nova transação no botão +; fornecer modal MoreMenuModal com os links secundários; aplicar pb-24 no conteúdo principal no mobile.

## T-092 — Testes Automatizados de Especificação da Feature [concluida]
- Refs: US-031, US-032, US-033, AC-123, AC-124, AC-125, AC-126, AC-127, AC-128, AC-129, AC-130, AC-131, AC-132
- Arquivos: test/ajustes-mobile-tema-notificacoes.spec.test.js
- Notas: Escrever e registrar testes executáveis anotados com @spec:AC-123 até @spec:AC-132 para auditoria mecânica e verificação pelo test runner.
