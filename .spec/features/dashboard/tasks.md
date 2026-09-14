# Tasks: Dashboard

> status: [pendente]

## Infraestrutura da Tela e Componentes Base
- **T-022** [pendente] Implementar o layout estrutural da página de Dashboard (Grid principal) com estados de carregamento (Skeleton Loaders).
  - **Refs:** US-008
  - **Arquivos:** `src/pages/Dashboard/index.tsx`, `src/pages/Dashboard/DashboardSkeleton.tsx`

## KPIs e Visão Geral
- **T-023** [pendente] Criar o componente de Cartões de KPI e integrá-lo ao endpoint de summary (`/api/dashboard-report/summary`), lidando com formatação monetária e estado vazio.
  - **Refs:** AC-029, AC-032
  - **Arquivos:** `src/pages/Dashboard/components/KpiCards.tsx`, `src/services/dashboard.ts`

- **T-024** [pendente] Implementar os componentes de listagem de "Saldos das Contas" (`/api/dashboard-report/account-balances`) e "Resumo de Cartões" (`/api/dashboard-report/credit-card-summary`).
  - **Refs:** AC-030, AC-031
  - **Arquivos:** `src/pages/Dashboard/components/AccountBalances.tsx`, `src/pages/Dashboard/components/CreditCardSummary.tsx`

- **T-025** [pendente] Desenvolver a seção de "Transações Recentes", consumindo o endpoint com limite de 5 e tratando prioridade de datas.
  - **Refs:** AC-033, AC-034
  - **Arquivos:** `src/pages/Dashboard/components/RecentTransactions.tsx`, `src/utils/formatDate.ts`

## Alertas e Ações
- **T-026** [pendente] Criar componente de Alertas de Atrasos (`/api/dashboard-report/overdue-alerts`), exibindo lista ou estado vazio positivo.
  - **Refs:** AC-039, AC-040
  - **Arquivos:** `src/pages/Dashboard/components/OverdueAlerts.tsx`

- **T-027** [pendente] Implementar o bloco de Ações Rápidas (Nova Receita, Nova Despesa, Transferência) disparando estados que abrirão os modais.
  - **Refs:** AC-041, AC-042, ASM-013
  - **Arquivos:** `src/pages/Dashboard/components/QuickActions.tsx`, `src/stores/useTransactionModalStore.ts`

## Gráficos e Recharts
- **T-028** [pendente] Integrar Recharts e construir o Gráfico de Barras "Receitas vs Despesas" com controles de navegação de ano (`< 2026 >`), consumindo dados mensais (`/api/dashboard-report/income-vs-expense?year=YYYY`).
  - **Refs:** AC-035, AC-037, AC-038
  - **Arquivos:** `src/pages/Dashboard/components/IncomeExpenseChart.tsx`

- **T-029** [pendente] Construir o Gráfico de Rosca/Donut "Despesas por Categoria" (`/api/dashboard-report/expense-by-category`), incluindo tooltips detalhadas.
  - **Refs:** AC-036, AC-037, AC-038
  - **Arquivos:** `src/pages/Dashboard/components/CategoryExpenseChart.tsx`

## Integração de Dados (Hooks)
- **T-030** [pendente] Criar hooks customizados do TanStack Query para orquestrar as chamadas do Dashboard, unificando o tratamento de erro e refetch ao mudar de carteira.
  - **Refs:** ASM-011, T-021
  - **Arquivos:** `src/hooks/useDashboardData.ts`
