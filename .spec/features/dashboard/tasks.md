# Tasks: Dashboard

> feature: dashboard

## T-022 — Layout Estrutural do Dashboard e Skeleton Loaders [pendente]
- Refs: US-008
- Arquivos: src/pages/Dashboard/DashboardPage.tsx, src/pages/Dashboard/DashboardSkeleton.tsx
- Notas: Implementar o layout estrutural da página de Dashboard (Grid principal) com estados de carregamento (Skeleton Loaders).

## T-023 — Cartões de KPI Principais e Estado Vazio [pendente]
- Refs: AC-029, AC-032
- Arquivos: src/pages/Dashboard/components/KpiCards.tsx, src/services/dashboard.service.ts, src/types/dashboard.ts
- Notas: Criar o componente de Cartões de KPI e integrá-lo ao endpoint de summary (/api/dashboard-report/summary), lidando com formatação monetária e estado vazio.

## T-024 — Saldos das Contas e Resumo de Cartões [pendente]
- Refs: AC-030, AC-031
- Arquivos: src/pages/Dashboard/components/AccountBalances.tsx, src/pages/Dashboard/components/CreditCardSummary.tsx
- Notas: Implementar os componentes de listagem de Saldos das Contas (/api/dashboard-report/account-balances) e Resumo de Cartões (/api/dashboard-report/credit-card-summary).

## T-025 — Seção de Transações Recentes e Ordenação [pendente]
- Refs: AC-033, AC-034
- Arquivos: src/pages/Dashboard/components/RecentTransactions.tsx, src/utils/formatDate.ts
- Notas: Desenvolver a seção de Transações Recentes consumindo endpoint (/api/dashboard-report/recent-transactions) com limite de 5 e prioridade de datas.

## T-026 — Alertas de Atrasos e Estado Tudo em Dia [pendente]
- Refs: AC-039, AC-040
- Arquivos: src/pages/Dashboard/components/OverdueAlerts.tsx
- Notas: Criar componente de Alertas de Atrasos (/api/dashboard-report/overdue-alerts), exibindo lista ou estado vazio positivo Tudo em dia.

## T-027 — Ações Rápidas de Lançamento e Store Global [pendente]
- Refs: AC-041, AC-042
- Arquivos: src/pages/Dashboard/components/QuickActions.tsx, src/stores/transactionModal.store.ts
- Notas: Implementar o bloco de Ações Rápidas (Nova Receita, Nova Despesa, Transferência) disparando store global que abrirá os modais (ASM-013).

## T-028 — Gráfico de Barras Receitas vs Despesas com Seletor de Ano [pendente]
- Refs: AC-035, AC-037, AC-038
- Arquivos: src/pages/Dashboard/components/IncomeExpenseChart.tsx
- Notas: Integrar Recharts e construir o Gráfico de Barras Receitas vs Despesas com controles de navegação de ano (< 2026 >), tooltips e fallback sem dados (/api/dashboard-report/income-vs-expense).

## T-029 — Gráfico de Rosca Despesas por Categoria [pendente]
- Refs: AC-036, AC-037, AC-038
- Arquivos: src/pages/Dashboard/components/CategoryExpenseChart.tsx
- Notas: Construir o Gráfico de Rosca Despesas por Categoria (/api/dashboard-report/expense-by-category), incluindo tooltips detalhadas e fallback sem dados.

## T-030 — Orquestração de Dados com TanStack Query [pendente]
- Refs: US-008, US-009, US-010
- Arquivos: src/hooks/useDashboardData.ts
- Notas: Criar hooks customizados do TanStack Query para orquestrar as chamadas do Dashboard, unificando tratamento de erro, refetch manual e invalidação ao mudar de carteira (ASM-011).
