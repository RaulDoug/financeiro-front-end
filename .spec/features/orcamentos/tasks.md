# Tasks: Orcamentos

> feature: orcamentos

## T-248 — Tipos TypeScript e Serviço de API de Orçamentos [concluida]
- Refs: US-105, US-106, US-107, AC-374, AC-375, AC-378, AC-381, AC-382, AC-383
- Arquivos: src/types/budget.ts, src/services/budget.service.ts, src/services/index.ts
- Notas: Mapear contratos de endpoints `/api/budget`, `/api/budget/summary`, `/api/budget/register`, `/api/budget/update/:id`, `/api/budget/delete/:id`, `/api/budget/recalculate_used_amount`.

## T-249 — Hooks React Query para Busca e Mutações de Orçamentos [concluida]
- Refs: US-105, US-106, US-107, AC-375, AC-376, AC-377, AC-378, AC-381, AC-382, AC-383
- Arquivos: src/hooks/useBudgets.ts, src/hooks/useBudgetMutations.ts, src/hooks/index.ts
- Notas: Implementar `useBudgets(year, month)`, `useBudgetSummary(year, month)`, `useAnnualBudgets(year)` e mutações com invalidação granular de queries.

## T-250 — Componente de Resumo Superior com KPI Cards de Caixa e Metas [concluida]
- Refs: US-105, AC-375
- Arquivos: src/components/budgets/BudgetSummaryCards.tsx
- Notas: Exibir 4 KPIs (total orçado, gasto, restante da meta, previsão de sobra no caixa com tooltip explicativo), responsivo em mobile e desktop com skeletons de loading.

## T-251 — Componentes de Card de Categoria, Barra de Progresso e Ações [concluida]
- Refs: US-105, US-107, AC-376, AC-383
- Arquivos: src/components/budgets/BudgetCategoryCard.tsx, src/components/budgets/BudgetProgressBar.tsx, src/utils/budgetProgress.ts
- Notas: Grid mobile-first (1 col mobile, multi-col desktop), barra de progresso verde (<80%), amarela (80-99%) e vermelha (>=100%), indicador de estouro, badge de recorrência e ações (recalcular/editar/excluir).

## T-252 — Componente de Visão Anual com Gráfico Comparativo Mês a Mês [concluida]
- Refs: US-105, AC-377
- Arquivos: src/components/budgets/BudgetAnnualChart.tsx
- Notas: Alternância entre visão mensal e anual, gráfico de barras com Recharts comparando planejado vs gasto em cada mês do ano selecionado.

## T-253 — Modais de Formulário de Orçamento com Gestão de Escopo e Conflito [concluida]
- Refs: US-106, US-107, AC-378, AC-379, AC-380, AC-381, AC-382
- Arquivos: src/components/budgets/BudgetModal.tsx, src/components/budgets/BudgetDeleteDialog.tsx, src/schemas/budgetSchema.ts
- Notas: Form com validação Zod, filtro de categorias apenas para despesas, suporte a avulso/recorrente (2 a 12 meses), modal inteligente de escopo para edição/exclusão (apenas este mês vs seguintes) e tratamento do erro 409.

## T-254 — Página Principal de Orçamentos e Integração no Layout/Rotas [concluida]
- Refs: US-105, AC-374
- Arquivos: src/pages/Budgets/BudgetsPage.tsx, src/layouts/AppLayout.tsx, src/components/layout/Sidebar.tsx, src/components/layout/MoreMenuModal.tsx, src/components/layout/MobileNav.tsx, src/routes/index.tsx
- Notas: Registrar rotas `/budgets` e `/orcamentos`, adicionar item na Sidebar, AppLayout e MoreMenuModal (mobile drawer), criar container da página com header, seletor temporal e empty states.

## T-255 — Testes Automatizados dos Critérios de Aceite AC-374 a AC-383 [concluida]
- Refs: US-105, US-106, US-107, AC-374, AC-375, AC-376, AC-377, AC-378, AC-379, AC-380, AC-381, AC-382, AC-383
- Arquivos: test/orcamentos.spec.test.js
- Notas: Criar suíte de testes com tags `@spec:AC-374` até `@spec:AC-383` cobrindo regras de negócio, cálculos de percentual, mutações e validações.
